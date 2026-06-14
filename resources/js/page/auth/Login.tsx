import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Store, 
    Lock, 
    CheckCircle2, 
    ArrowRight,
    Loader2,
    KeyRound
} from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        pin: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/auth/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden font-sans">
                
                {/* Left Side: Branding Panel */}
                <div className="hidden md:flex md:w-[35%] lg:w-[30%] bg-primary text-white relative flex-col justify-between p-8 lg:p-12 overflow-hidden select-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary/90" />
                    <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-2.5">
                        <div className="h-10 w-10 flex items-center justify-center">
                            <Store className="h-5.5 w-5.5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            ChasierApp
                        </span>
                    </div>

                    <div className="relative z-10 my-auto py-10 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl lg:text-4xl font-extrabold leading-[1.2] tracking-tight text-white">
                                Beberapa klik lagi 
                                untuk mengelola toko Anda.
                            </h2>
                            <p className="text-white/80 text-sm lg:text-base font-light leading-relaxed">
                                Masukkan PIN untuk memproses transaksi kasir, mengelola stok, dan memantau perkembangan bisnis UMKM Anda.
                            </p>
                        </div>

                        <div className="space-y-5 pt-6 border-t border-white/10">
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-white/90 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-base font-semibold text-white">Point of Sale Instan</h4>
                                    <p className="text-sm text-white/70 mt-1">Catat transaksi kasir digital dalam hitungan detik.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-white/90 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-base font-semibold text-white">Manajemen Stok Real-time</h4>
                                    <p className="text-sm text-white/70 mt-1">Pantau jumlah bahan di gudang secara akurat.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-white/90 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-base font-semibold text-white">Laporan Keuangan Otomatis</h4>
                                    <p className="text-sm text-white/70 mt-1">Dapatkan rekap omzet harian & bulanan.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-[11px] text-white/60 font-light">
                        &copy; {new Date().getFullYear()} ChasierApp. Hak Cipta Dilindungi.
                    </div>
                </div>

                {/* Right Side: PIN Login Form */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 md:p-12 lg:p-16 bg-slate-50/50 dark:bg-slate-950/20 relative">
                    <div className="absolute top-6 left-6 flex md:hidden items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Store className="h-4.5 w-4.5 text-white" />
                        </div>
                        <span className="text-md font-bold tracking-tight text-foreground">
                            ChasierApp
                        </span>
                    </div>

                    <div className="w-full max-w-[420px] space-y-8">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                Selamat Datang
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                Masukkan PIN Anda untuk mengakses dashboard.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="pin" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    PIN
                                </Label>
                                <div className="relative rounded-lg group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <KeyRound className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="pin"
                                        type="password"
                                        value={data.pin}
                                        onChange={(e) => setData('pin', e.target.value)}
                                        placeholder="******"
                                        maxLength={6}
                                        className="pl-11 h-12 bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-lg text-base text-center tracking-[0.3em] font-mono text-lg"
                                        required
                                        autoComplete="off"
                                        inputMode="numeric"
                                    />
                                </div>
                                {errors.pin && (
                                    <p className="text-sm font-medium text-destructive mt-1">
                                        {errors.pin}
                                    </p>
                                )}
                            </div>

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
                                        <span>Masuk</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

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
