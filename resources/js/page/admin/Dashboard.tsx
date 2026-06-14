import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { LayoutDashboard, Users, Store, Package, Warehouse, Settings, LogOut, FileText, ChefHat, TrendingUp, TrendingDown, AlertTriangle, DollarSign, ShoppingCart, BarChart3, Receipt } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Stats {
    revenueToday: number;
    transactionsToday: number;
    lowStockCount: number;
    totalMenus: number;
    totalUsers: number;
}

interface ChartDay {
    date: string;
    revenue: number;
    transactions: number;
}

interface TopMenu {
    menu_id: number;
    name: string;
    total_qty: number;
    total_revenue: number;
}

interface RecentTransaction {
    id: number;
    total_amount: number;
    user: string;
    payment_method: string;
    item_count: number;
    created_at: string;
}

interface PageProps {
    stats: Stats;
    revenueChart: ChartDay[];
    topMenus: TopMenu[];
    recentTransactions: RecentTransaction[];
}

const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(num);
};

export default function Dashboard(props: PageProps) {
    const { stats, revenueChart, topMenus, recentTransactions } = props;

    const handleLogout = () => {
        router.post('/logout');
    };

    const chartConfig = {
        data: {
            labels: revenueChart.map(d => d.date),
            datasets: [
                {
                    label: 'Pendapatan',
                    data: revenueChart.map(d => d.revenue),
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                },
                {
                    label: 'Transaksi',
                    data: revenueChart.map(d => d.transactions),
                    backgroundColor: '#8b5cf6',
                    borderRadius: 4,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' as const, labels: { boxWidth: 12, padding: 12, font: { size: 11 } } },
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                x: { grid: { display: false } },
            },
        },
    };

    const navLinks = [
        { href: '/admin/users', label: 'User', icon: Users },
        { href: '/admin/categories', label: 'Kategori', icon: Store },
        { href: '/admin/menus', label: 'Menu', icon: Store },
        { href: '/admin/resep', label: 'Resep', icon: ChefHat },
        { href: '/admin/ingredients', label: 'Bahan', icon: Package },
        { href: '/admin/warehouses', label: 'Gudang', icon: Warehouse },
        { href: '/admin/stock', label: 'Stok', icon: Package },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp</h1>
                    <nav className="flex-1 space-y-2">
                        <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                            <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </a>
                        {navLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold"
                            >
                                <link.icon className="h-5 w-5" /> {link.label}
                            </a>
                        ))}
                        <a href="/admin/laporan" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <FileText className="h-5 w-5" /> Laporan
                        </a>
                        <a href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <Settings className="h-5 w-5" /> Settings
                        </a>
                    </nav>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold mt-auto">
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Dashboard Admin</h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pendapatan</p>
                            <p className="text-xl font-bold mt-1 text-blue-600">{formatIDR(stats.revenueToday)}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Hari ini</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Transaksi</p>
                            <p className="text-xl font-bold mt-1 text-purple-600">{stats.transactionsToday}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Hari ini</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Stok Menipis</p>
                            <p className="text-xl font-bold mt-1 text-red-500">{stats.lowStockCount}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Perlu restock</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <ChefHat className="h-5 w-5 text-emerald-600" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Menu Aktif</p>
                            <p className="text-xl font-bold mt-1 text-emerald-600">{stats.totalMenus}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Total menu</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pengguna</p>
                            <p className="text-xl font-bold mt-1 text-amber-600">{stats.totalUsers}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Terdaftar</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-primary" />
                                Pendapatan & Transaksi (7 Hari)
                            </h3>
                            <div className="h-64">
                                <Bar data={chartConfig.data} options={chartConfig.options} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Menu Terlaris (30 Hari)
                            </h3>
                            {topMenus.length > 0 ? (
                                <div className="space-y-3">
                                    {topMenus.map((item, idx) => (
                                        <div key={item.menu_id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                                                    <p className="text-[10px] text-slate-500">{item.total_qty} terjual</p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-primary">{formatIDR(item.total_revenue)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                                    <ShoppingCart className="h-10 w-10 mb-2" />
                                    <p className="text-xs font-medium">Belum ada transaksi</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-primary" />
                                Transaksi Terbaru
                            </h3>
                        </div>
                        {recentTransactions.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recentTransactions.map(tx => (
                                    <div key={tx.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Receipt className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-800">
                                                    #{tx.id} — {tx.user}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    {tx.item_count} item • {tx.payment_method}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-800">{formatIDR(tx.total_amount)}</p>
                                            <p className="text-[10px] text-slate-400">{tx.created_at}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center text-slate-400">
                                <p className="text-xs font-medium">Belum ada transaksi</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
