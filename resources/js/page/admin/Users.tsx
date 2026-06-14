import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Plus, Users, LogOut, LayoutDashboard, Store, Package, 
    Warehouse, Settings, FileText, Pencil, Trash2, 
    RotateCcw, ToggleLeft, ToggleRight, KeyRound, 
    Search, X, Loader2, ArrowLeft, Mail, Shield, UserCircle
} from 'lucide-react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    deleted_at: string | null;
}

interface Props {
    users: UserData[];
    warehouses: { id: number; name: string }[];
}

export default function UsersIndex({ users, warehouses }: Props) {
    const { props } = usePage();
    const flash = (props as any).flash || {};
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);
    const [showPinModal, setShowPinModal] = useState<number | null>(null);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [newPin, setNewPin] = useState('');
    const [processing, setProcessing] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', pin: '', role: 'kasir' });

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => setForm({ name: '', email: '', pin: '', role: 'kasir' });

    const openCreate = () => { resetForm(); setShowModal('create'); };
    const openEdit = (u: UserData) => {
        setEditingUser(u);
        setForm({ name: u.name, email: u.email, pin: '', role: u.role });
        setShowModal('edit');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (showModal === 'create') {
            router.post('/admin/users', form, {
                onSuccess: () => { setShowModal(null); setProcessing(false); resetForm(); },
                onError: () => setProcessing(false),
            });
        } else if (showModal === 'edit' && editingUser) {
            router.patch(`/admin/users/${editingUser.id}`, form, {
                onSuccess: () => { setShowModal(null); setProcessing(false); setEditingUser(null); resetForm(); },
                onError: () => setProcessing(false),
            });
        }
    };

    const toggleActive = (u: UserData) => {
        router.post(`/admin/users/${u.id}/toggle-active`, undefined, {
            preserveScroll: true,
        });
    };

    const handleDelete = (u: UserData) => {
        if (!confirm(`Nonaktifkan user "${u.name}"?`)) return;
        router.delete(`/admin/users/${u.id}`, { preserveScroll: true });
    };

    const handleRestore = (id: number) => {
        router.post(`/admin/users/${id}/restore`, undefined, { preserveScroll: true });
    };

    const handleResetPin = (id: number) => {
        if (!newPin || newPin.length !== 6) return;
        setProcessing(true);
        router.post(`/admin/users/${id}/reset-pin`, { pin: newPin }, {
            onSuccess: () => { setShowPinModal(null); setNewPin(''); setProcessing(false); },
            onError: () => setProcessing(false),
        });
    };

    const roleBadge = (role: string) => {
        const colors: Record<string, string> = {
            owner: 'bg-purple-100 text-purple-700',
            kasir: 'bg-blue-100 text-blue-700',
            inventoris: 'bg-emerald-100 text-emerald-700',
        };
        return colors[role] || 'bg-slate-100 text-slate-700';
    };

    return (
        <>
            <Head title="Management User" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp Admin</h1>
                    <nav className="flex-1 space-y-2">
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </a>
                        <a href="/admin/users" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                            <Users className="h-5 w-5" /> Management User
                        </a>
                        <a href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Store className="h-5 w-5" /> Kategori
                        </a>
                        <a href="/admin/menus" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Store className="h-5 w-5" /> Management Menu
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Package className="h-5 w-5" /> Bahan
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Warehouse className="h-5 w-5" /> Gudang
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <FileText className="h-5 w-5" /> Laporan
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Settings className="h-5 w-5" /> Settings
                        </a>
                    </nav>
                    <button onClick={() => router.post('/logout')} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold mt-auto">
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </aside>

                <main className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Management User</h2>
                            <p className="text-sm text-slate-500 mt-1">Kelola semua user yang memiliki akses ke sistem.</p>
                        </div>
                        <Button onClick={openCreate} className="flex items-center gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" /> Tambah User
                        </Button>
                    </div>

                    {flash.success && (
                        <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg mb-4 text-sm">{flash.success}</div>
                    )}
                    {flash.error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{flash.error}</div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                            <div className="relative max-w-xs">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Cari user..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-9 text-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="px-4 py-3">Nama</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className={`hover:bg-slate-50 ${u.deleted_at ? 'opacity-50' : ''}`}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <UserCircle className="h-8 w-8 text-slate-400" />
                                                    <span className="font-semibold text-sm">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${roleBadge(u.role)}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${u.is_active && !u.deleted_at ? 'bg-emerald-500' : 'bg-red-400'}`} />
                                                    <span className="text-xs font-medium">
                                                        {u.deleted_at ? 'Dinonaktifkan' : u.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {u.deleted_at ? (
                                                        <button onClick={() => handleRestore(u.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer" title="Aktifkan kembali">
                                                            <RotateCcw className="h-4 w-4" />
                                                        </button>
                                                    ) : (
                                                        <>
                                                            {u.role !== 'owner' && (
                                                                <button onClick={() => toggleActive(u)} className={`p-1.5 ${u.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'} rounded-lg cursor-pointer`} title={u.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                                                                    {u.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                                                </button>
                                                            )}
                                                            <button onClick={() => { setShowPinModal(u.id); setNewPin(''); }} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer" title="Reset PIN">
                                                                <KeyRound className="h-4 w-4" />
                                                            </button>
                                                            <button onClick={() => openEdit(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer" title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </button>
                                                            {u.role !== 'owner' && (
                                                                <button onClick={() => handleDelete(u)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer" title="Nonaktifkan">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">Tidak ada user ditemukan.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Create / Edit Modal */}
            {(showModal === 'create' || showModal === 'edit') && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{showModal === 'create' ? 'Tambah User' : 'Edit User'}</h3>
                            <button onClick={() => { setShowModal(null); setEditingUser(null); }} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama</Label>
                                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="pin">{showModal === 'create' ? 'PIN (6 digit)' : 'PIN Baru (kosongi jika tidak diubah)'}</Label>
                                <Input id="pin" type="password" maxLength={6} value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, '') })} required={showModal === 'create'} className="mt-1 tracking-[0.3em] text-center font-mono" />
                            </div>
                            <div>
                                <Label htmlFor="role">Role</Label>
                                <select id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option value="kasir">Kasir</option>
                                    <option value="inventoris">Inventoris</option>
                                    <option value="owner">Owner</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => { setShowModal(null); setEditingUser(null); }} className="flex-1 cursor-pointer">Batal</Button>
                                <Button type="submit" disabled={processing} className="flex-1 cursor-pointer">
                                    {processing && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                                    {showModal === 'create' ? 'Simpan' : 'Perbarui'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset PIN Modal */}
            {showPinModal && (
                <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                        <div className="text-center mb-4">
                            <KeyRound className="h-10 w-10 text-primary mx-auto mb-2" />
                            <h3 className="text-lg font-bold">Reset PIN</h3>
                            <p className="text-sm text-slate-500">Masukkan PIN baru 6 digit.</p>
                        </div>
                        <Input
                            type="password"
                            maxLength={6}
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="******"
                            className="text-center tracking-[0.3em] font-mono text-lg mb-4"
                        />
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" onClick={() => setShowPinModal(null)} className="flex-1 cursor-pointer">Batal</Button>
                            <Button onClick={() => handleResetPin(showPinModal)} disabled={newPin.length !== 6 || processing} className="flex-1 cursor-pointer">
                                {processing && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                                Simpan PIN
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
