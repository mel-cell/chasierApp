import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2, LogOut, Plus, Minus, AlertTriangle, Warehouse as WarehouseIcon } from 'lucide-react';

export default function Stock({ warehouses, ingredients }: { warehouses: any[]; ingredients: { id: number; name: string; unit: string }[] }) {
    const { props } = usePage();
    const flash = (props as any).flash || {};
    const [showModal, setShowModal] = useState<'add' | 'remove' | 'adjust' | null>(null);
    const [form, setForm] = useState({ warehouse_id: '', ingredient_id: '', quantity: '', stock: '', reason: '' });
    const [processing, setProcessing] = useState(false);

    const openModal = (type: 'add' | 'remove' | 'adjust') => {
        setForm({ warehouse_id: '', ingredient_id: '', quantity: '', stock: '', reason: '' });
        setShowModal(type);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        let url = '';
        let data: any = {};

        if (showModal === 'add') {
            url = '/admin/stock/add';
            data = { warehouse_id: form.warehouse_id, ingredient_id: form.ingredient_id, quantity: form.quantity, reason: form.reason || 'Stok masuk' };
        } else if (showModal === 'remove') {
            url = '/admin/stock/remove';
            data = { warehouse_id: form.warehouse_id, ingredient_id: form.ingredient_id, quantity: form.quantity, reason: form.reason || 'Stok keluar' };
        } else if (showModal === 'adjust') {
            url = '/admin/stock/adjust';
            data = { warehouse_id: form.warehouse_id, ingredient_id: form.ingredient_id, stock: form.stock, reason: form.reason || 'Penyesuaian stok' };
        }

        router.post(url, data, {
            onSuccess: () => { setShowModal(null); setProcessing(false); },
            onError: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Stok" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp Admin</h1>
                    <nav className="flex-1 space-y-2 text-sm">
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Dashboard</a>
                        <a href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">User</a>
                        <a href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Kategori</a>
                        <a href="/admin/menus" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Menu</a>
                        <a href="/admin/ingredients" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Bahan</a>
                        <a href="/admin/warehouses" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Gudang</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg font-semibold">Stok</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Laporan</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Settings</a>
                    </nav>
                    <button onClick={() => router.post('/logout')} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm mt-auto">Logout</button>
                </aside>

                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Manajemen Stok</h2>
                            <p className="text-sm text-slate-500 mt-1">Kelola stok bahan di setiap gudang.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => openModal('add')} className="cursor-pointer"><Plus className="h-4 w-4 mr-1" /> Stok Masuk</Button>
                            <Button onClick={() => openModal('remove')} variant="outline" className="cursor-pointer"><Minus className="h-4 w-4 mr-1" /> Stok Keluar</Button>
                            <Button onClick={() => openModal('adjust')} variant="secondary" className="cursor-pointer">Adjust</Button>
                        </div>
                    </div>

                    {flash.success && <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{flash.success}</div>}
                    {flash.error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{flash.error}</div>}

                    {warehouses.map((w: any) => (
                        <div key={w.id} className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <WarehouseIcon className="h-5 w-5 text-primary" />
                                <h3 className="font-bold text-lg">{w.name}</h3>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            <th className="px-4 py-3">Bahan</th>
                                            <th className="px-4 py-3">Satuan</th>
                                            <th className="px-4 py-3">Stok</th>
                                            <th className="px-4 py-3">Min. Stok</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {w.stocks.length > 0 ? w.stocks.map((s: any) => (
                                            <tr key={s.id}>
                                                <td className="px-4 py-3 font-semibold text-sm">{s.ingredient_name}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{s.unit}</td>
                                                <td className="px-4 py-3 text-sm">{s.stock} {s.unit}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{s.min_stock} {s.unit}</td>
                                                <td className="px-4 py-3">
                                                    {s.is_low ? (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 w-fit">
                                                            <AlertTriangle className="h-3 w-3" /> Menipis
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">Aman</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-400">Belum ada stok di gudang ini.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                    {warehouses.length === 0 && (
                        <div className="text-center py-12 text-slate-400 text-sm">Belum ada gudang. Buat gudang terlebih dahulu.</div>
                    )}
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">
                                {showModal === 'add' ? 'Stok Masuk' : showModal === 'remove' ? 'Stok Keluar' : 'Adjust Stok'}
                            </h3>
                            <button onClick={() => setShowModal(null)} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Gudang</Label>
                                <select value={form.warehouse_id} onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })} required className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="">Pilih gudang</option>
                                    {warehouses.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Bahan</Label>
                                <select value={form.ingredient_id} onChange={(e) => setForm({ ...form, ingredient_id: e.target.value })} required className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="">Pilih bahan</option>
                                    {ingredients.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                                </select>
                            </div>
                            {showModal === 'adjust' ? (
                                <div>
                                    <Label>Stok Baru</Label>
                                    <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="mt-1" />
                                </div>
                            ) : (
                                <div>
                                    <Label>Jumlah</Label>
                                    <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="mt-1" />
                                </div>
                            )}
                            <div>
                                <Label>Keterangan</Label>
                                <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="mt-1" placeholder="Opsional" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowModal(null)} className="flex-1 cursor-pointer">Batal</Button>
                                <Button type="submit" disabled={processing} className="flex-1 cursor-pointer">
                                    {processing && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                                    {showModal === 'add' ? 'Tambah' : showModal === 'remove' ? 'Kurangi' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
