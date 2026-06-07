import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    User, 
    ArrowLeft, 
    Check, 
    Loader2, 
    Clock,
    Settings,
    LogOut,
    Volume2,
    Printer,
    Percent,
    Globe,
    Moon,
    ShieldAlert
} from 'lucide-react';

export default function CashierSettings() {
    const [currentTime, setCurrentTime] = useState('');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    // Settings States
    const [autoPrint, setAutoPrint] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);
    const [taxRate, setTaxRate] = useState('11');
    const [language, setLanguage] = useState('id');
    const [darkMode, setDarkMode] = useState(false);
    const [requireSupervisorVoid, setRequireSupervisorVoid] = useState(true);
    
    // Status states
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Update time dynamic
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Toggle dark mode class simulation
    const handleDarkModeToggle = (checked: boolean) => {
        setDarkMode(checked);
        if (checked) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Handle Form Submit
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setToastMessage('Pengaturan berhasil disimpan!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
            <Head title="Pengaturan Kasir - ChasierApp" />

            {/* Header */}
            <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/kasir/dashboard" className="h-8 w-8 rounded-sm bg-slate-100 dark:bg-slate-900 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <span className="text-md font-bold tracking-tight text-foreground block mb-1">
                            ChasierApp
                        </span>
                        <span className="text-[10px] text-muted-foreground block -mt-1 font-medium">
                            Point of Sale • UMKM Mode
                        </span>
                    </div>
                </div>

                {/* Cashier Info & Dropdown */}
                <div className="flex items-center gap-4 relative">
                    <div className="hidden sm:flex flex-col text-right select-none">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 justify-end">
                            <User className="h-3.5 w-3.5 text-primary" /> Cashier Mel
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 justify-end">
                            <Clock className="h-3 w-3" /> {currentTime || '--:--:--'}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className="h-9 w-9 rounded-sm bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-primary uppercase shadow-inner hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer"
                    >
                        CM
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-45"
                                onClick={() => setIsProfileDropdownOpen(false)}
                            />
                            <div className="absolute right-0 top-11 w-48 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800 dark:text-slate-200">
                                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">Cashier Mel</p>
                                    <p className="text-[10px] text-muted-foreground truncate">mel@chasierapp.com</p>
                                </div>
                                <Link 
                                    href="/kasir/profile"
                                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Profil Saya</span>
                                </Link>
                                <Link 
                                    href="/kasir/settings"
                                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                    <Settings className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Pengaturan</span>
                                </Link>
                                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                <Link 
                                    href="/auth/login"
                                    className="w-full text-left px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/5 flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    <span>Keluar (Log Out)</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-20 right-6 bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 dark:border-slate-600 px-4 py-3 rounded-sm shadow-xl z-55 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold">{toastMessage}</span>
                </div>
            )}

            {/* Page Main Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:py-10">
                
                {/* Heading Navigation Path */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-medium">
                    <Link href="/kasir/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                    <span>/</span>
                    <span className="text-slate-700 dark:text-slate-300">Pengaturan</span>
                </div>

                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Pengaturan POS & Perangkat</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Konfigurasi struk, sistem suara, perpajakan, dan tampilan sistem kasir.</p>
                    </div>

                    <form onSubmit={handleSave} className="p-6 space-y-6">
                        
                        {/* Section: Struk / Printer */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                <Printer className="h-4 w-4 text-primary" /> Struk Belanja & Printer
                            </h4>
                            
                            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-sm border border-slate-100 dark:border-slate-800">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Cetak Otomatis (Auto-Print)</Label>
                                    <p className="text-[10px] text-muted-foreground">Mencetak struk belanja thermal secara otomatis sesaat setelah pembayaran berhasil.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={autoPrint} 
                                        onChange={(e) => setAutoPrint(e.target.checked)} 
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>

                        {/* Section: General Configuration */}
                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                <Percent className="h-4 w-4 text-primary" /> Pajak & Tarif
                            </h4>

                            <div className="space-y-2">
                                <Label htmlFor="taxRate" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Persentase Pajak (%)
                                </Label>
                                <div className="relative rounded-sm group max-w-[150px]">
                                    <Input
                                        id="taxRate"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(e.target.value)}
                                        className="pr-8 h-10 bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-sm text-xs font-bold text-slate-800 dark:text-slate-200"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                                        %
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Besar tarif pajak pertambahan nilai (PPN) yang akan otomatis dihitung pada setiap struk transaksi.</p>
                            </div>
                        </div>

                        {/* Section: Security / Otorisasi */}
                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-primary" /> Otorisasi & Hak Akses
                            </h4>

                            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-sm border border-slate-100 dark:border-slate-800">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">Verifikasi Supervisor untuk Void</Label>
                                    <p className="text-[10px] text-muted-foreground">Memerlukan input PIN otorisasi supervisor sebelum menghapus atau void item belanja yang telah masuk list.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={requireSupervisorVoid} 
                                        onChange={(e) => setRequireSupervisorVoid(e.target.checked)} 
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>

                        {/* Section: Sound & Theme */}
                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                <Volume2 className="h-4 w-4 text-primary" /> Efek Suara & Tema
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-sm border border-slate-100 dark:border-slate-800">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <Volume2 className="h-3.5 w-3.5 text-slate-400" /> Bunyi Scanner
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground">{"Mainkan bunyi 'beep' saat produk berhasil ditambahkan."}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={soundEffects} 
                                            onChange={(e) => setSoundEffects(e.target.checked)} 
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-sm border border-slate-100 dark:border-slate-800">
                                    <div className="space-y-0.5">
                                        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <Moon className="h-3.5 w-3.5 text-slate-400" /> Mode Gelap (Dark)
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground">Aktifkan tema gelap untuk kenyamanan bekerja di malam hari.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={darkMode} 
                                            onChange={(e) => handleDarkModeToggle(e.target.checked)} 
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Section: Language */}
                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" /> Bahasa Aplikasi
                            </h4>

                            <div className="space-y-2">
                                <Label htmlFor="language" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Pilih Bahasa
                                </Label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full sm:max-w-[250px] px-3 h-10 bg-background border border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary focus:outline-none transition-all rounded-sm text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
                                >
                                    <option value="id">Bahasa Indonesia</option>
                                    <option value="en">English (US)</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                            <Link 
                                href="/kasir/dashboard" 
                                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-sm text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
                            >
                                Kembali
                            </Link>
                            <Button 
                                type="submit" 
                                disabled={isSaving}
                                className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold rounded-sm text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-primary/10"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
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
