import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    User,
    ArrowLeft,
    Check,
    Clock,
    Settings,
    LogOut,
    Printer,
    Moon,
} from 'lucide-react';

interface SettingsPageProps {
    taxRate: string;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
    flash: { success: string | null; error: string | null };
}

export default function CashierSettings() {
    const { props } = usePage<SettingsPageProps>();
    const { auth, flash } = props;

    const [currentTime, setCurrentTime] = useState('');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const [autoPrint, setAutoPrint] = useState(() => localStorage.getItem('kasir_autoPrint') !== 'false');
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('kasir_darkMode') === 'true');

    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        localStorage.setItem('kasir_autoPrint', autoPrint.toString());
        localStorage.setItem('kasir_darkMode', darkMode.toString());

        setTimeout(() => {
            setIsSaving(false);
            setToastMessage('Pengaturan berhasil disimpan!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
            <Head title="Pengaturan Kasir - ChasierApp" />

            <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/kasir/dashboard" className="h-8 w-8 rounded-sm bg-slate-100 dark:bg-slate-900 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <span className="text-md font-bold tracking-tight text-foreground block mb-1">ChasierApp</span>
                        <span className="text-[10px] text-muted-foreground block -mt-1 font-medium">Point of Sale • UMKM Mode</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative">
                    <div className="hidden sm:flex flex-col text-right select-none">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 justify-end">
                            <User className="h-3.5 w-3.5 text-primary" /> {auth.user?.name || 'Cashier'}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 justify-end">
                            <Clock className="h-3 w-3" /> {currentTime || '--:--:--'}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className="h-9 w-9 rounded-sm bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-primary uppercase shadow-inner hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer"
                    >
                        {auth.user?.name?.charAt(0) || 'C'}
                    </button>

                    {isProfileDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-45" onClick={() => setIsProfileDropdownOpen(false)} />
                            <div className="absolute right-0 top-11 w-48 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{auth.user?.name || 'Cashier'}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{auth.user?.email || ''}</p>
                                </div>
                                <Link href="/kasir/profile" className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer transition-colors">
                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Profil Saya</span>
                                </Link>
                                <Link href="/kasir/settings" className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer transition-colors">
                                    <Settings className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Pengaturan</span>
                                </Link>
                                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                <Link href="/auth/login" className="w-full text-left px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/5 flex items-center gap-2 cursor-pointer transition-colors">
                                    <LogOut className="h-3.5 w-3.5" />
                                    <span>Keluar (Log Out)</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {showToast && (
                <div className="fixed top-20 right-6 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-sm shadow-xl z-55 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold">{toastMessage}</span>
                </div>
            )}

            <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:py-10">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-medium">
                    <Link href="/kasir/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                    <span>/</span>
                    <span className="text-slate-700 dark:text-slate-300">Pengaturan</span>
                </div>

                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Pengaturan Kasir</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Atur preferensi tampilan dan cetak struk.</p>
                    </div>

                    <form onSubmit={handleSave} className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Printer className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Cetak Otomatis</p>
                                    <p className="text-xs text-muted-foreground">Cetak struk langsung setelah transaksi</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAutoPrint(!autoPrint)}
                                className={`relative h-7 w-12 rounded-full transition-colors cursor-pointer ${autoPrint ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${autoPrint ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Moon className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Mode Gelap</p>
                                    <p className="text-xs text-muted-foreground">Tampilan antarmuka dengan tema gelap</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDarkMode(!darkMode)}
                                className={`relative h-7 w-12 rounded-full transition-colors cursor-pointer ${darkMode ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${darkMode ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                            <Link href="/kasir/dashboard" className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-sm text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer">
                                Batal
                            </Link>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold rounded-sm text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-primary/10"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <span>Simpan Pengaturan</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
