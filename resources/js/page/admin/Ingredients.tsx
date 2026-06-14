import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2, Pencil, Trash2, LogOut, Package, Plus, AlertTriangle } from 'lucide-react';

export default function Ingredients({ ingredients }: { ingredients: any[] }) {
    const { props } = usePage();
    const flash = (props as any).flash || {};
    const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);
    const [editing, setEditing] = useState<any | null>(null);
    const [form, setForm] = useState({ name: '', unit: 'gram', min_stock: '' });
    const [processing, setProcessing] = useState(false);

    const openCreate = () => { setForm({ name: '', unit: 'gram', min_stock: '' }); setShowModal('create'); };
    const openEdit = (i: any) => { setForm({ name: i.name, unit: i.unit, min_stock: String(i.min_stock) }); setEditing(i); setShowModal('edit'); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const data = { name: form.name, unit: form.unit, min_stock: form.min_stock };
        if (showModal === 'create') {
            router.post('/admin/ingredients', data, {
                onSuccess: () => { setShowModal(null); setProcessing(false); },
                onError: () => setProcessing(false),
            });
        } else if (editing) {
            router.patch(`/admin/ingredients/${editing.id}`, data, {
                onSuccess: () => { setShowModal(null); setEditing(null); setProcessing(false); },
                onError: () => setProcessing(false),
            });
        }
    };

    const handleDelete = (i: any) => {
        if (!confirm(`Hapus bahan "${i.name}"?`)) return;
        router.delete(`/admin/ingredients/${i.id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Bahan" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp Admin</h1>
                    <nav className="flex-1 space-y-2 text-sm">
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Dashboard</a>
                        <a href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">User</a>
                        <a href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Kategori</a>
                        <a href="/admin/menus" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Menu</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg font-semibold">Bahan</a>
                        <a href="/admin/warehouses" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Gudang</a>
                        <a href="/admin/stock" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Stok</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Laporan</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Settings</a>
                    </nav>
                    <button onClick={() => router.post('/logout')} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm mt-auto">Logout</button>
                </aside>

                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Bahan</h2>
                            <p className="text-sm text-slate-500 mt-1">Daftar semua bahan baku yang digunakan.</p>
                        </div>
                        <Button onClick={openCreate} className="cursor-pointer"><Plus className="h-4 w-4 mr-1" /> Tambah Bahan</Button>
                    </div>

                    {flash.success && <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{flash.success}</div>}

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Satuan</th>
                                    <th className="px-4 py-3">Total Stok</th>
                                    <th className="px-4 py-3">Min. Stok</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {ingredients.map((i) => (
                                    <tr key={i.id}>
                                        <td className="px-4 py-3 font-semibold text-sm">{i.name}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{i.unit}</td>
                                        <td className="px-4 py-3 text-sm">{i.total_stok} {i.unit}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{i.min_stok} {i.unit}</td>
                                        <td className="px-4 py-3">
                                            {i.is_low ? (
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 w-fit">
                                                    <AlertTriangle className="h-3 w-3" /> Stok Menipis
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">Aman</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => openEdit(i)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"><Pencil className="h-4 w-4" /></button>
                                            <button onClick={() => handleDelete(i)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                                {ingredients.length === 0 && (
                                    <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">Belum ada bahan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{showModal === 'create' ? 'Tambah Bahan' : 'Edit Bahan'}</h3>
                            <button onClick={() => { setShowModal(null); setEditing(null); }} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Nama Bahan</Label>
                                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
                            </div>
                            <div>
                                <Label>Satuan</Label>
                                <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="gram">gram</option>
                                    <option value="kg">kg</option>
                                    <option value="ml">ml</option>
                                    <option value="liter">liter</option>
                                    <option value="pcs">pcs</option>
                                    <option value="box">box</option>
                                    <option value="pack">pack</option>
                                </select>
                            </div>
                            <div>
                                <Label>Stok Minimum</Label>
                                <Input type="number" value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: e.target.value })} required className="mt-1" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => { setShowModal(null); setEditing(null); }} className="flex-1 cursor-pointer">Batal</Button>
                                <Button type="submit" disabled={processing} className="flex-1 cursor-pointer">
                                    {processing && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                                    {showModal === 'create' ? 'Simpan' : 'Perbarui'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
