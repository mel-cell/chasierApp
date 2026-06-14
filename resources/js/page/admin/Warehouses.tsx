import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2, Pencil, Trash2, LogOut, Warehouse as WarehouseIcon, Plus, LayoutDashboard, Users, Store, ShoppingBag, ChefHat, Package, FileText, Settings } from 'lucide-react';

export default function Warehouses({ warehouses, users }: { warehouses: any[]; users: { id: number; name: string }[] }) {
    const { props } = usePage();
    const flash = (props as any).flash || {};
    const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);
    const [editing, setEditing] = useState<any | null>(null);
    const [form, setForm] = useState({ name: '', user_id: '' });
    const [processing, setProcessing] = useState(false);

    const openCreate = () => { setForm({ name: '', user_id: '' }); setShowModal('create'); };
    const openEdit = (w: any) => { setForm({ name: w.name, user_id: String(w.user?.id || '') }); setEditing(w); setShowModal('edit'); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const data = { name: form.name, user_id: form.user_id || null };
        if (showModal === 'create') {
            router.post('/admin/warehouses', data, {
                onSuccess: () => { setShowModal(null); setProcessing(false); },
                onError: () => setProcessing(false),
            });
        } else if (editing) {
            router.patch(`/admin/warehouses/${editing.id}`, data, {
                onSuccess: () => { setShowModal(null); setEditing(null); setProcessing(false); },
                onError: () => setProcessing(false),
            });
        }
    };

    const handleDelete = (w: any) => {
        if (!confirm(`Hapus gudang "${w.name}"?`)) return;
        router.delete(`/admin/warehouses/${w.id}`, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Gudang" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp Admin</h1>
                    <nav className="flex-1 space-y-2 text-sm">
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Dashboard</a>
                        <a href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">User</a>
                        <a href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Kategori</a>
                        <a href="/admin/menus" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Menu</a>
                        <a href="/admin/ingredients" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Bahan</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg font-semibold">Gudang</a>
                        <a href="/admin/stock" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Stok</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Laporan</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Settings</a>
                    </nav>
                    <button onClick={() => router.post('/logout')} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm mt-auto">Logout</button>
                </aside>

                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Gudang</h2>
                            <p className="text-sm text-slate-500 mt-1">Kelola gudang/ruangan penyimpanan bahan.</p>
                        </div>
                        <Button onClick={openCreate} className="cursor-pointer"><Plus className="h-4 w-4 mr-1" /> Tambah Gudang</Button>
                    </div>

                    {flash.success && <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{flash.success}</div>}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {warehouses.map((w) => (
                            <div key={w.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <WarehouseIcon className="h-5 w-5 text-primary" />
                                        <h3 className="font-bold">{w.name}</h3>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(w)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"><Pencil className="h-3.5 w-3.5" /></button>
                                        <button onClick={() => handleDelete(w)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">
                                    PIC: <span className="font-semibold text-slate-700">{w.user?.name || 'Belum ditentukan'}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{w.ingredients_count} bahan tersimpan</p>
                            </div>
                        ))}
                        {warehouses.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400 text-sm">Belum ada gudang.</div>
                        )}
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{showModal === 'create' ? 'Tambah Gudang' : 'Edit Gudang'}</h3>
                            <button onClick={() => { setShowModal(null); setEditing(null); }} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Nama Gudang</Label>
                                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
                            </div>
                            <div>
                                <Label>PIC (Penanggung Jawab)</Label>
                                <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="">Pilih user inventoris</option>
                                    {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
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
