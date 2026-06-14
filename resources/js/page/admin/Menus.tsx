import React, { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Plus, X, Loader2, Pencil, Trash2, RotateCcw, 
    LogOut, Search, Image, ShoppingBag, ChefHat, LayoutDashboard, Users, Store, Warehouse, Package, FileText, Settings
} from 'lucide-react';

interface MenuData {
    id: number;
    name: string;
    price: number;
    image: string | null;
    is_active: boolean;
    deleted_at: string | null;
    category: { id: number; name: string } | null;
}

interface CategoryData {
    id: number;
    name: string;
}

const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

export default function Menus({ menus, categories }: { menus: MenuData[]; categories: CategoryData[] }) {
    const { props } = usePage();
    const flash = (props as any).flash || {};
    const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);
    const [editing, setEditing] = useState<MenuData | null>(null);
    const [processing, setProcessing] = useState(false);
    const [form, setForm] = useState({ name: '', price: '', category_id: '', image: null as File | null });
    const [preview, setPreview] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) return menus;
        const q = search.toLowerCase();
        return menus.filter(m => m.name.toLowerCase().includes(q) || m.category?.name.toLowerCase().includes(q));
    }, [menus, search]);

    const openCreate = () => {
        setForm({ name: '', price: '', category_id: '', image: null });
        setPreview(null);
        setShowModal('create');
    };

    const openEdit = (m: MenuData) => {
        setEditing(m);
        setForm({ name: m.name, price: String(m.price), category_id: String(m.category?.id || ''), image: null });
        setPreview(m.image ? `/storage/${m.image}` : null);
        setShowModal('edit');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('price', form.price);
        if (form.category_id) fd.append('category_id', form.category_id);
        if (form.image) fd.append('image', form.image);

        if (showModal === 'create') {
            router.post('/admin/menus', fd, {
                onSuccess: () => { setShowModal(null); setProcessing(false); },
                onError: () => setProcessing(false),
            });
        } else if (editing) {
            fd.append('_method', 'PATCH');
            router.post(`/admin/menus/${editing.id}`, fd, {
                onSuccess: () => { setShowModal(null); setEditing(null); setProcessing(false); },
                onError: () => setProcessing(false),
            });
        }
    };

    const handleDelete = (m: MenuData) => {
        if (!confirm(`Nonaktifkan menu "${m.name}"?`)) return;
        router.delete(`/admin/menus/${m.id}`, { preserveScroll: true });
    };

    const handleRestore = (id: number) => {
        router.post(`/admin/menus/${id}/restore`, undefined, { preserveScroll: true });
    };

    const sidebarLinks = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'User', icon: Users },
        { href: '/admin/categories', label: 'Kategori', icon: Store },
        { href: '/admin/menus', label: 'Menu', icon: ShoppingBag },
        { href: '/admin/resep', label: 'Resep', icon: ChefHat },
        { href: '/admin/ingredients', label: 'Bahan', icon: Package },
        { href: '/admin/warehouses', label: 'Gudang', icon: Warehouse },
        { href: '/admin/stock', label: 'Stok', icon: Package },
        { href: '/admin/laporan', label: 'Laporan', icon: FileText },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            <Head title="Menu" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp</h1>
                    <nav className="flex-1 space-y-1">
                        {sidebarLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${
                                    link.href === '/admin/menus' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <link.icon className="h-4 w-4" /> {link.label}
                            </a>
                        ))}
                    </nav>
                    <button onClick={() => router.post('/logout')} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold mt-auto cursor-pointer">
                        <LogOut className="h-4 w-4" /> Logout
                    </button>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Menu</h2>
                            <p className="text-sm text-slate-500 mt-1">{menus.length} menu terdaftar</p>
                        </div>
                        <Button onClick={openCreate} className="cursor-pointer"><Plus className="h-4 w-4 mr-1" /> Tambah Menu</Button>
                    </div>

                    {flash.success && <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg mb-4 text-sm font-semibold">{flash.success}</div>}

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari menu atau kategori..."
                            className="pl-9 h-10 bg-white border-slate-200 rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(m => (
                            <div
                                key={m.id}
                                className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                                    m.deleted_at ? 'border-red-200 opacity-60' : 'border-slate-200'
                                }`}
                            >
                                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                    {m.image ? (
                                        <img src={`/storage/${m.image}`} alt={m.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Image className="h-12 w-12 text-slate-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                                            m.deleted_at ? 'bg-red-100 text-red-700' : m.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {m.deleted_at ? 'Nonaktif' : m.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-bold text-slate-900 truncate">{m.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{m.category?.name || 'Tanpa kategori'}</p>
                                    <p className="text-sm font-extrabold text-primary mt-2">{formatIDR(m.price)}</p>
                                    <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-slate-100">
                                        {m.deleted_at ? (
                                            <button onClick={() => handleRestore(m.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors" title="Pulihkan">
                                                <RotateCcw className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={() => openEdit(m)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(m)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors" title="Nonaktifkan">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
                                <ShoppingBag className="h-12 w-12 mb-3" />
                                <p className="text-sm font-medium">Tidak ada menu ditemukan</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{showModal === 'create' ? 'Tambah Menu' : 'Edit Menu'}</h3>
                            <button onClick={() => { setShowModal(null); setEditing(null); setPreview(null); }} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Nama Menu</Label>
                                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
                            </div>
                            <div>
                                <Label>Kategori</Label>
                                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="">Pilih kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label>Harga (Rp)</Label>
                                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="mt-1" />
                            </div>
                            <div>
                                <Label>Gambar</Label>
                                <Input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="mt-1" />
                                {preview && <img src={preview} alt="preview" className="h-20 w-20 object-cover rounded-lg mt-2" />}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => { setShowModal(null); setEditing(null); setPreview(null); }} className="flex-1 cursor-pointer">Batal</Button>
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
