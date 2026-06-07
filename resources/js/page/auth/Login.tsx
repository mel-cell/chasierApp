import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Store, 
    Lock, 
    Mail, 
    Eye, 
    EyeOff, 
    Loader2, 
    CheckCircle2, 
    ArrowRight
} from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/auth/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden font-sans">
                
                {/* Left Side: Clean, Editorial Branding Panel (Hidden on Mobile) */}
                <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-primary text-white relative flex-col justify-between p-8 lg:p-12 overflow-hidden select-none">
                    {/* Subtle glow/gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary/90" />
                    <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[80px] pointer-events-none" />

                    {/* Logo */}
                    <div className="relative z-10 flex items-center gap-2.5">
                        <div className="h-10 w-10 flex items-center justify-center">
                            <Store className="h-5.5 w-5.5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            ChasierApp
                        </span>
                    </div>

                    {/* Content Area */}
                    <div className="relative z-10 my-auto py-10 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl lg:text-4xl font-extrabold leading-[1.2] tracking-tight text-white">
                                Beberapa klik lagi 
                                untuk mengelola toko Anda.
                            </h2>
                            <p className="text-white/80 text-sm lg:text-base font-light leading-relaxed">
                                Masuk ke akun Anda untuk memproses transaksi kasir, mengelola ketersediaan stok produk, dan memantau perkembangan bisnis UMKM Anda.
                            </p>
                        </div>

                        {/* Poin-Poin Keunggulan (Simple & Clean) */}
                        <div className="space-y-5 pt-6 border-t border-white/10">
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-white/90 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-base font-semibold text-white">Point of Sale Instan</h4>
                                    <p className="text-sm text-white/70 mt-1">Catat transaksi kasir digital & cetak struk dalam hitungan detik.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-white/90 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-base font-semibold text-white">Manajemen Stok Real-time</h4>
                                    <p className="text-sm text-white/70 mt-1">Pantau jumlah produk di gudang secara akurat tanpa takut kehabisan.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-white/90 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-base font-semibold text-white">Laporan Keuangan Otomatis</h4>
                                    <p className="text-sm text-white/70 mt-1">Dapatkan rekap omzet harian & bulanan untuk evaluasi bisnis Anda.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 text-[11px] text-white/60 font-light">
                        &copy; {new Date().getFullYear()} ChasierApp. Hak Cipta Dilindungi.
                    </div>
                </div>

                {/* Right Side: Clean, Modern Login Form */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-16 bg-slate-50/50 dark:bg-slate-950/20 relative">
                    {/* Small branding for mobile */}
                    <div className="absolute top-6 left-6 flex md:hidden items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Store className="h-4.5 w-4.5 text-white" />
                        </div>
                        <span className="text-md font-bold tracking-tight text-foreground">
                            ChasierApp
                        </span>
                    </div>

                    <div className="w-full max-w-[420px] space-y-8">
                        {/* Headers */}
                        <div className="space-y-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                Selamat Datang
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                Masuk menggunakan kredensial akun Anda untuk mengakses dashboard kasir.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Email
                                </Label>
                                <div className="relative rounded-lg group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        className="pl-11 h-12 bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-lg text-base"
                                        required
                                        autoComplete="username"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm font-medium text-destructive mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Password
                                    </Label>
                                    <a 
                                        href="#forgot" 
                                        className="text-sm text-primary hover:underline font-medium hover:text-primary/95 transition-colors"
                                    >
                                        Lupa password?
                                    </a>
                                </div>
                                <div className="relative rounded-lg group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-11 pr-12 h-12 bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-lg text-base"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm font-medium text-destructive mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember me & Options */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 dark:border-slate-800 text-primary focus:ring-primary/25 cursor-pointer accent-primary"
                                    />
                                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        Ingat perangkat ini
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base transition-all shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk ke Akun</span>
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover/button:translate-x-0.5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Extra Navigation Footer */}
                        <div className="pt-2 text-center">
                            <p className="text-sm text-muted-foreground font-light">
                                Mengalami kesulitan masuk?{' '}
                                <a href="#support" className="text-primary hover:underline font-semibold">
                                    Hubungi Bantuan
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

