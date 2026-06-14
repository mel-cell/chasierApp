import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, LogOut, LayoutDashboard, Users, Store, Package, Warehouse, Settings, ChefHat, Receipt, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionItem {
    menu: string;
    qty: number;
    price: number;
}

interface Transaction {
    id: number;
    total_amount: number;
    user: string;
    payment_method: string;
    items: TransactionItem[];
    created_at: string;
}

interface LogEntry {
    id: number;
    type: 'in' | 'out';
    quantity: number;
    reason: string;
    ingredient: string;
    warehouse: string;
    user: string;
    created_at: string;
}

interface Summary {
    total_transactions?: number;
    total_revenue?: number;
    total_items?: number;
    total_in?: number;
    total_out?: number;
    total_logs?: number;
}

interface ReportData {
    transactions?: Transaction[];
    logs?: LogEntry[];
    summary: Summary;
}

interface PageProps {
    startDate: string;
    endDate: string;
    reportType: string;
    data: ReportData;
    auth: { user: { name: string; role: string } | null };
}

const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(num);
};

export default function Laporan(props: PageProps) {
    const { startDate, endDate, reportType, data, auth } = props;
    const isOwner = auth?.user?.role === 'owner';

    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);
    const [localType, setLocalType] = useState(reportType);

    const handleFilter = () => {
        router.get(window.location.pathname, {
            start_date: localStartDate,
            end_date: localEndDate,
            type: localType,
        });
    };

    const handleExport = () => {
        const url = new URL(window.location.origin + (isOwner ? '/admin/laporan/export' : '/inventoris/laporan/export'));
        url.searchParams.set('start_date', localStartDate);
        url.searchParams.set('end_date', localEndDate);
        url.searchParams.set('type', localType);
        window.open(url.toString(), '_blank');
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const sidebarLinks = isOwner
        ? [
            { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/users', label: 'User', icon: Users },
            { href: '/admin/categories', label: 'Kategori', icon: Store },
            { href: '/admin/menus', label: 'Menu', icon: Store },
            { href: '/admin/resep', label: 'Resep', icon: ChefHat },
            { href: '/admin/ingredients', label: 'Bahan', icon: Package },
            { href: '/admin/warehouses', label: 'Gudang', icon: Warehouse },
            { href: '/admin/stock', label: 'Stok', icon: Package },
            { href: '/admin/laporan', label: 'Laporan', icon: FileText },
            { href: '#', label: 'Settings', icon: Settings },
        ]
        : [
            { href: '/inventoris/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/inventoris/laporan', label: 'Laporan', icon: FileText },
        ];

    return (
        <>
            <Head title="Laporan" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp</h1>
                    <nav className="flex-1 space-y-2">
                        {sidebarLinks.map(link => (
                            <a
                                key={link.href + link.label}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${
                                    link.label === 'Laporan'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <link.icon className="h-5 w-5" /> {link.label}
                            </a>
                        ))}
                    </nav>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold mt-auto">
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Laporan</h2>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
                        <div className="flex flex-wrap items-end gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Tipe Laporan</label>
                                <select
                                    value={localType}
                                    onChange={e => setLocalType(e.target.value)}
                                    className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium bg-white"
                                >
                                    <option value="transaksi">Transaksi</option>
                                    <option value="stok">Stok</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Dari Tanggal</label>
                                <Input
                                    type="date"
                                    value={localStartDate}
                                    onChange={e => setLocalStartDate(e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Sampai Tanggal</label>
                                <Input
                                    type="date"
                                    value={localEndDate}
                                    onChange={e => setLocalEndDate(e.target.value)}
                                    className="h-9 text-xs"
                                />
                            </div>
                            <Button onClick={handleFilter} className="h-9 text-xs cursor-pointer">
                                <FileText className="h-3.5 w-3.5 mr-1" /> Tampilkan
                            </Button>
                            <Button onClick={handleExport} variant="outline" className="h-9 text-xs cursor-pointer">
                                <Download className="h-3.5 w-3.5 mr-1" /> Export Excel
                            </Button>
                        </div>
                    </div>

                    {localType === 'transaksi' && data.transactions && (
                        <>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Transaksi</p>
                                    <p className="text-2xl font-bold mt-1 text-primary">{data.summary.total_transactions}</p>
                                </div>
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Pendapatan</p>
                                    <p className="text-2xl font-bold mt-1 text-emerald-600">{formatIDR(data.summary.total_revenue ?? 0)}</p>
                                </div>
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Item Terjual</p>
                                    <p className="text-2xl font-bold mt-1 text-blue-600">{data.summary.total_items}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Receipt className="h-4 w-4 text-primary" />
                                        Daftar Transaksi
                                    </h3>
                                </div>
                                {data.transactions.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {data.transactions.map(tx => (
                                            <div key={tx.id} className="px-6 py-3 hover:bg-slate-50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-800">#{tx.id}</span>
                                                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{tx.payment_method}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-slate-800">{formatIDR(tx.total_amount)}</p>
                                                        <p className="text-[10px] text-slate-400">{tx.created_at}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] text-slate-500">{tx.user}</p>
                                                    <p className="text-[10px] text-slate-500">{tx.items.length} item</p>
                                                </div>
                                                {tx.items.length > 0 && (
                                                    <details className="mt-2">
                                                        <summary className="text-[10px] text-primary cursor-pointer font-semibold">Detail Item</summary>
                                                        <div className="mt-1 space-y-1">
                                                            {tx.items.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between text-[10px] text-slate-600 pl-2">
                                                                    <span>{item.menu} x{item.qty}</span>
                                                                    <span>{formatIDR(item.price * item.qty)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </details>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-slate-400">
                                        <Receipt className="h-10 w-10 mx-auto mb-2" />
                                        <p className="text-xs font-medium">Tidak ada transaksi di rentang tanggal ini</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {localType === 'stok' && data.logs && (
                        <>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Log</p>
                                    <p className="text-2xl font-bold mt-1 text-primary">{data.summary.total_logs}</p>
                                </div>
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bahan Masuk</p>
                                    <p className="text-2xl font-bold mt-1 text-emerald-600">{data.summary.total_in}</p>
                                </div>
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bahan Keluar</p>
                                    <p className="text-2xl font-bold mt-1 text-amber-600">{data.summary.total_out}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Package className="h-4 w-4 text-primary" />
                                        Log Stok
                                    </h3>
                                </div>
                                {data.logs.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {data.logs.map(log => (
                                            <div key={log.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${log.type === 'in' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                                        {log.type === 'in' ? (
                                                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                                                        ) : (
                                                            <TrendingDown className="h-4 w-4 text-amber-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-800">{log.ingredient}</p>
                                                        <p className="text-[10px] text-slate-500">{log.warehouse} — {log.reason}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-xs font-bold ${log.type === 'in' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                        {log.type === 'in' ? '+' : '-'}{log.quantity}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">{log.created_at}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-slate-400">
                                        <Package className="h-10 w-10 mx-auto mb-2" />
                                        <p className="text-xs font-medium">Tidak ada log stok di rentang tanggal ini</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}
