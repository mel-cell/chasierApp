import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Plus, LayoutDashboard, Users, Store, Package, 
    Warehouse, Settings, FileText, LogOut, X, 
    Loader2, Pencil, Trash2, RotateCcw, ShoppingBag, ChefHat
} from 'lucide-react';

interface CategoryData {
    id: number;
    name: string;
    deleted_at: string | null;
    menus_count: number;
}

export default function Categories({ categories }: { categories: CategoryData[] }) {
    const { props } = usePage();
    const flash = (props as any).flash || {};
    const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);
    const [editing, setEditing] = useState<CategoryData | null>(null);
    const [name, setName] = useState('');
    const [processing, setProcessing] = useState(false);

    const openCreate = () => { setName(''); setShowModal('create'); };
    const openEdit = (c: CategoryData) => { setName(c.name); setEditing(c); setShowModal('edit'); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (showModal === 'create') {
            router.post('/admin/categories', { name }, {
                onSuccess: () => { setShowModal(null); setName(''); setProcessing(false); },
                onError: () => setProcessing(false),
            });
        } else if (editing) {
            router.patch(`/admin/categories/${editing.id}`, { name }, {
                onSuccess: () => { setShowModal(null); setEditing(null); setName(''); setProcessing(false); },
                onError: () => setProcessing(false),
            });
        }
    };

    const handleDelete = (c: CategoryData) => {
        if (!confirm(`Nonaktifkan kategori "${c.name}"?`)) return;
        router.delete(`/admin/categories/${c.id}`, { preserveScroll: true });
    };

    const handleRestore = (id: number) => {
        router.post(`/admin/categories/${id}/restore`, undefined, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Kategori" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp</h1>
                    <nav className="flex-1 space-y-1">
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"><LayoutDashboard className="h-4 w-4" /> Dashboard</a>
                        <a href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"><Users className="h-4 w-4" /> User</a>
                        <a href="/admin/categories" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-primary/10 text-primary"><Store className="h-4 w-4" /> Kategori</a>
                        <a href="/admin/menus" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"><ShoppingBag className="h-4 w-4" /> Menu</a>
                        <a href="/admin/resep" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"><ChefHat className="h-4 w-4" /> Resep</a>
                        <a href="/admin/ingredients" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"><Package className="h-4 w-4" /> Bahan</a>
                        <a href="/admin/warehouses" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"><Warehouse className="h-4 w-4" /> Gudang</a>
                        <a href="/admin/stock" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"><Package className="h-4 w-4" /> Stok</a>
                        <a href="/admin/laporan" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"><FileText className="h-4 w-4" /> Laporan</a>
                        <a href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"><Settings className="h-4 w-4" /> Settings</a>
                    </nav>
                    <button onClick={() => router.post('/logout')} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold mt-auto cursor-pointer"><LogOut className="h-4 w-4" /> Logout</button>
                </aside>

                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Kategori</h2>
                            <p className="text-sm text-slate-500 mt-1">Kelola kategori menu (Makanan, Minuman, Snack, dll).</p>
                        </div>
                        <Button onClick={openCreate} className="cursor-pointer"><Plus className="h-4 w-4 mr-1" /> Tambah Kategori</Button>
                    </div>

                    {flash.success && <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{flash.success}</div>}

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Jumlah Menu</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.map((c) => (
                                    <tr key={c.id} className={c.deleted_at ? 'opacity-50' : ''}>
                                        <td className="px-4 py-3 font-semibold text-sm">{c.name}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{c.menus_count}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${c.deleted_at ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                {c.deleted_at ? 'Nonaktif' : 'Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {c.deleted_at ? (
                                                <button onClick={() => handleRestore(c.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer" title="Aktifkan">
                                                    <RotateCcw className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <>
                                                    <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer" title="Edit">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(c)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer" title="Nonaktifkan">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">Belum ada kategori.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{showModal === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}</h3>
                            <button onClick={() => { setShowModal(null); setEditing(null); }} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama Kategori</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
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
