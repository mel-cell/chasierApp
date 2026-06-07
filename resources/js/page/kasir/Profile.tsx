import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    User, 
    Mail, 
    Phone, 
    Shield, 
    Calendar, 
    Clock, 
    ArrowLeft, 
    Camera, 
    Check, 
    Loader2, 
    Lock, 
    Eye, 
    EyeOff,
    Settings,
    LogOut
} from 'lucide-react';

export default function Profile() {
    const [currentTime, setCurrentTime] = useState('');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    // Form States
    const [name, setName] = useState('Cashier Mel');
    const [email, setEmail] = useState('mel@chasierapp.com');
    const [phone, setPhone] = useState('081234567890');
    const [pin, setPin] = useState('123456');
    const [showPin, setShowPin] = useState(false);
    const [activeShift, setActiveShift] = useState('Shift Pagi (08:00 - 16:00)');
    
    // Status states
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

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

    // Handle Form Submit
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setToastMessage('Profil berhasil diperbarui!');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 1200);
    };

    // Simulate avatar upload
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setTimeout(() => {
                    setAvatarPreview(reader.result as string);
                    setIsUploading(false);
                    setToastMessage('Foto profil berhasil diunggah!');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                }, 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
            <Head title="Profil Kasir - ChasierApp" />

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
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover rounded-sm" />
                        ) : (
                            'CM'
                        )}
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
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{name}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{email}</p>
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
            <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:py-10">
                
                {/* Heading Navigation Path */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-medium">
                    <Link href="/kasir/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                    <span>/</span>
                    <span className="text-slate-700 dark:text-slate-300">Profil Kasir</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Column: Avatar & Shift Info Card */}
                    <div className="md:col-span-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden shadow-sm">
                        <div className="p-6 flex flex-col items-center text-center">
                            
                            {/* Avatar Display with Hover Overlay */}
                            <div className="relative group h-28 w-28 rounded-sm overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center font-bold text-3xl text-primary mb-4">
                                {isUploading ? (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                ) : avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    'CM'
                                )}
                                
                                <label className="absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="h-6 w-6 text-white" />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleAvatarChange} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>

                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{name}</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">{email}</p>

                            <div className="w-full border-t border-slate-100 dark:border-slate-800 my-5" />

                            {/* Status Attributes */}
                            <div className="w-full space-y-3.5 text-left">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5 text-slate-400" /> Peran
                                    </span>
                                    <span className="font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px]">
                                        KASIR UTAMA
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" /> Shift Saat Ini
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        Pagi
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> Bergabung
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        01 Juni 2026
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Editable Profile Info Form */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Informasi Personal</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Perbarui nama pengguna, email, shift, dan pengaturan keamanan PIN.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            
                            {/* Full Name Input */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Lengkap
                                </Label>
                                <div className="relative rounded-sm group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9 h-10 bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-sm text-xs font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Email Address Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Alamat Email
                                    </Label>
                                    <div className="relative rounded-sm group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9 h-10 bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-sm text-xs font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone Number Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        No. Handphone
                                    </Label>
                                    <div className="relative rounded-sm group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="pl-9 h-10 bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-sm text-xs font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shift Selector */}
                            <div className="space-y-2">
                                <Label htmlFor="shift" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Pengaturan Shift Tugas
                                </Label>
                                <select
                                    id="shift"
                                    value={activeShift}
                                    onChange={(e) => setActiveShift(e.target.value)}
                                    className="w-full px-3 h-10 bg-background border border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary focus:outline-none transition-all rounded-sm text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
                                >
                                    <option value="Shift Pagi (08:00 - 16:00)">Shift Pagi (08:00 - 16:00)</option>
                                    <option value="Shift Sore (16:00 - 24:00)">Shift Sore (16:00 - 24:00)</option>
                                    <option value="Shift Malam (24:00 - 08:00)">Shift Malam (24:00 - 08:00)</option>
                                </select>
                            </div>

                            {/* Pin Keamanan */}
                            <div className="space-y-2">
                                <Label htmlFor="pin" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    PIN Otorisasi Transaksi (6 Digit)
                                </Label>
                                <div className="relative rounded-sm group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="pin"
                                        type={showPin ? 'text' : 'password'}
                                        maxLength={6}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                        className="pl-9 pr-10 h-10 bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-sm text-xs font-medium tracking-widest"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPin(!showPin)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    >
                                        {showPin ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-[10px] text-muted-foreground">PIN digunakan saat melakukan pembatalan transaksi (void) atau memberikan diskon khusus manual.</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <Link 
                                    href="/kasir/dashboard" 
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-sm text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
                                >
                                    Batal
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
                                        <span>Simpan Profil</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
