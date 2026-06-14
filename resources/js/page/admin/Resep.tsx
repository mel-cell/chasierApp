import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    X, Loader2, LogOut, Plus, Trash2, Pencil, 
    AlertTriangle, CheckCircle2, ChefHat, Package,
    LayoutDashboard, Users, Store, Warehouse as WarehouseIcon, Settings, FileText
} from 'lucide-react';

export default function Resep({ menus, ingredients }: { menus: any[]; ingredients: { id: number; name: string; unit: string }[] }) {
    const { props } = usePage();
    const flash = (props as any).flash || {};
    const [selectedMenu, setSelectedMenu] = useState<any>(null);
    const [menuIngredients, setMenuIngredients] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ingredient_id: '', quantity: '', unit: 'gram' });
    const [editId, setEditId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);
    const [stockInfo, setStockInfo] = useState<any>(null);
    const [loadingStock, setLoadingStock] = useState(false);

    const loadMenuIngredients = (menu: any) => {
        setSelectedMenu(menu);
        fetch(`/admin/resep/${menu.id}`)
            .then(r => r.json())
            .then(data => {
                setMenuIngredients(data.ingredients);
                setStockInfo(null);
            });
    };

    const checkStock = (menuId: number) => {
        setLoadingStock(true);
        fetch(`/admin/resep/${menuId}/stock`)
            .then(r => r.json())
            .then(data => {
                setStockInfo(data);
                setLoadingStock(false);
            });
    };

    const openAdd = () => {
        setForm({ ingredient_id: '', quantity: '', unit: 'gram' });
        setEditId(null);
        setShowModal(true);
    };

    const openEdit = (item: any) => {
        setForm({ ingredient_id: String(item.ingredient_id), quantity: String(item.quantity), unit: item.unit });
        setEditId(item.id);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const data = {
            menu_id: selectedMenu.id,
            ingredient_id: form.ingredient_id,
            quantity: form.quantity,
            unit: form.unit,
        };

        if (editId) {
            router.patch(`/admin/resep/${editId}`, { quantity: form.quantity, unit: form.unit }, {
                onSuccess: () => {
                    setShowModal(false);
                    setProcessing(false);
                    loadMenuIngredients(selectedMenu);
                },
                onError: () => setProcessing(false),
            });
        } else {
            router.post('/admin/resep', data, {
                onSuccess: () => {
                    setShowModal(false);
                    setProcessing(false);
                    loadMenuIngredients(selectedMenu);
                },
                onError: () => setProcessing(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Hapus bahan dari resep ini?')) return;
        router.delete(`/admin/resep/${id}`, {
            preserveScroll: true,
            onSuccess: () => loadMenuIngredients(selectedMenu),
        });
    };

    const units = ['gram', 'kg', 'ml', 'liter', 'pcs', 'box', 'pack', 'sdt', 'sdm', 'gelas', 'cangkir'];

    return (
        <>
            <Head title="Resep" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp Admin</h1>
                    <nav className="flex-1 space-y-2 text-sm">
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Dashboard</a>
                        <a href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">User</a>
                        <a href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Kategori</a>
                        <a href="/admin/menus" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Menu</a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg font-semibold">Resep</a>
                        <a href="/admin/ingredients" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Bahan</a>
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
                            <h2 className="text-2xl font-bold">Resep Menu</h2>
                            <p className="text-sm text-slate-500 mt-1">Atur bahan baku yang dibutuhkan untuk setiap menu.</p>
                        </div>
                    </div>

                    {flash.success && <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{flash.success}</div>}
                    {flash.error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{flash.error}</div>}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Menu List */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="p-4 border-b border-slate-200 font-bold text-sm">Daftar Menu</div>
                                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                                    {menus.filter(m => !m.deleted_at && m.is_active).map((menu) => (
                                        <button
                                            key={menu.id}
                                            onClick={() => loadMenuIngredients(menu)}
                                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition cursor-pointer ${selectedMenu?.id === menu.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                                        >
                                            <div className="font-semibold text-sm">{menu.name}</div>
                                            <div className="text-xs text-slate-500">{menu.ingredients_count} bahan • Rp {Number(menu.price).toLocaleString('id-ID')}</div>
                                        </button>
                                    ))}
                                    {menus.filter(m => !m.deleted_at && m.is_active).length === 0 && (
                                        <div className="p-4 text-sm text-slate-400 text-center">Tidak ada menu aktif.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Recipe Detail */}
                        <div className="lg:col-span-2">
                            {selectedMenu ? (
                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-lg">{selectedMenu.name}</h3>
                                                <p className="text-xs text-slate-500">{menuIngredients.length} bahan dalam resep</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={() => checkStock(selectedMenu.id)} variant="outline" size="sm" disabled={loadingStock} className="cursor-pointer text-xs">
                                                    {loadingStock ? '...' : 'Cek Stok'}
                                                </Button>
                                                <Button onClick={openAdd} size="sm" className="cursor-pointer"><Plus className="h-4 w-4 mr-1" />Tambah Bahan</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {stockInfo && (
                                        <div className={`rounded-xl border p-4 shadow-sm ${stockInfo.can_make > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                {stockInfo.can_make > 0 ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
                                                <span className="font-bold text-sm">Stok tersedia untuk: {stockInfo.can_make} porsi</span>
                                            </div>
                                            <div className="text-xs text-slate-600 space-y-1">
                                                {stockInfo.details?.map((d: any, i: number) => (
                                                    <div key={i} className="flex justify-between">
                                                        <span>{d.name}</span>
                                                        <span className={d.can_make <= 0 ? 'text-red-600 font-semibold' : ''}>
                                                            Stok: {d.total_stok} {d.unit} → {d.can_make} porsi
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                    <th className="px-4 py-3">Bahan</th>
                                                    <th className="px-4 py-3">Takaran</th>
                                                    <th className="px-4 py-3">Satuan</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {menuIngredients.map((item: any) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-3 font-semibold text-sm">{item.name}</td>
                                                        <td className="px-4 py-3 text-sm">{item.quantity}</td>
                                                        <td className="px-4 py-3 text-sm text-slate-600">{item.unit}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"><Pencil className="h-4 w-4" /></button>
                                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {menuIngredients.length === 0 && (
                                                    <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">Belum ada bahan. Klik "Tambah Bahan" untuk menambahkan.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                                    <ChefHat className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm text-slate-400">Pilih menu dari daftar di samping untuk mulai mengatur resep.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && selectedMenu && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{editId ? 'Edit Takaran' : 'Tambah Bahan'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!editId && (
                                <div>
                                    <Label>Bahan</Label>
                                    <select value={form.ingredient_id} onChange={(e) => {
                                        const ing = ingredients.find(i => i.id === Number(e.target.value));
                                        setForm({ ...form, ingredient_id: e.target.value, unit: ing?.unit || 'gram' });
                                    }} required className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                        <option value="">Pilih bahan</option>
                                        {ingredients.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                                    </select>
                                </div>
                            )}
                            <div>
                                <Label>Takaran per Porsi</Label>
                                <Input type="number" step="0.01" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="mt-1" />
                            </div>
                            <div>
                                <Label>Satuan</Label>
                                <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    {units.map((u) => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 cursor-pointer">Batal</Button>
                                <Button type="submit" disabled={processing} className="flex-1 cursor-pointer">
                                    {processing && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                                    {editId ? 'Perbarui' : 'Tambah'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
