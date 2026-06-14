import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, LogOut, LayoutDashboard, Users, Store, Package, Warehouse, FileText, ChefHat, ToggleLeft, ToggleRight, Save } from 'lucide-react';

interface PageProps {
    settings: {
        inventoris_active: string;
        resep_active: string;
    };
    flash: { success: string | null; error: string | null };
}

export default function Settings(props: PageProps) {
    const { settings, flash } = props;

    const [inventorisActive, setInventorisActive] = useState(settings.inventoris_active === 'true');
    const [resepActive, setResepActive] = useState(settings.resep_active === 'true');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        router.post('/admin/settings', {
            inventoris_active: inventorisActive ? 'true' : 'false',
            resep_active: resepActive ? 'true' : 'false',
        }, {
            onFinish: () => setSaving(false),
        });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Pengaturan" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp</h1>
                    <nav className="flex-1 space-y-2">
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </a>
                        <a href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Users className="h-5 w-5" /> User
                        </a>
                        <a href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Store className="h-5 w-5" /> Kategori
                        </a>
                        <a href="/admin/menus" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Store className="h-5 w-5" /> Menu
                        </a>
                        <a href="/admin/resep" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <ChefHat className="h-5 w-5" /> Resep
                        </a>
                        <a href="/admin/ingredients" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Package className="h-5 w-5" /> Bahan
                        </a>
                        <a href="/admin/warehouses" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Warehouse className="h-5 w-5" /> Gudang
                        </a>
                        <a href="/admin/stock" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Package className="h-5 w-5" /> Stok
                        </a>
                        <a href="/admin/laporan" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <FileText className="h-5 w-5" /> Laporan
                        </a>
                        <a href="/admin/settings" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                            <SettingsIcon className="h-5 w-5" /> Settings
                        </a>
                    </nav>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold mt-auto">
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Pengaturan</h2>
                    </div>

                    {flash?.success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-xs font-semibold mb-6">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="px-6 py-5 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800">Fitur Modules</h3>
                            <p className="text-xs text-slate-500 mt-1">Aktifkan atau nonaktifkan modul sistem</p>
                        </div>

                        <div className="px-6 py-5 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Module Inventoris</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Mengelola stok bahan baku, gudang, dan log stok
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Ketika dinonaktifkan, menu inventoris disembunyikan dari sidebar
                                    </p>
                                </div>
                                <button
                                    onClick={() => setInventorisActive(!inventorisActive)}
                                    className={`relative h-7 w-12 rounded-full transition-colors cursor-pointer ${inventorisActive ? 'bg-primary' : 'bg-slate-300'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${inventorisActive ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            <div className="border-t border-slate-100" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Module Resep</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Menghubungkan menu dengan bahan baku untuk stok otomatis
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Ketika aktif, stok bahan akan berkurang otomatis saat transaksi
                                    </p>
                                </div>
                                <button
                                    onClick={() => setResepActive(!resepActive)}
                                    className={`relative h-7 w-12 rounded-full transition-colors cursor-pointer ${resepActive ? 'bg-primary' : 'bg-slate-300'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${resepActive ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="h-9 text-xs cursor-pointer"
                            >
                                <Save className="h-3.5 w-3.5 mr-1" />
                                {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
