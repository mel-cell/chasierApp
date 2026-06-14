import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Package, LogOut, FileText, ClipboardList, AlertTriangle, Warehouse, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
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

interface LowStockItem {
    id: number;
    name: string;
    unit: string;
    min_stock: number;
    total_stock: number;
}

interface LogItem {
    id: number;
    type: 'in' | 'out';
    quantity: number;
    reason: string | null;
    ingredient: string;
    user: string;
    created_at: string;
}

interface ChartDay {
    date: string;
    in: number;
    out: number;
}

interface Stats {
    stockInToday: number;
    stockOutToday: number;
    totalIngredients: number;
    lowStockCount: number;
    totalWarehouses: number;
}

interface PageProps {
    stats: Stats;
    lowStockList: LowStockItem[];
    recentLogs: LogItem[];
    chartData: ChartDay[];
}

export default function Dashboard(props: PageProps) {
    const { stats, lowStockList, recentLogs, chartData } = props;

    const handleLogout = () => {
        router.post('/logout');
    };

    const chartConfig = {
        data: {
            labels: chartData.map(d => d.date),
            datasets: [
                {
                    label: 'Masuk',
                    data: chartData.map(d => d.in),
                    backgroundColor: '#10b981',
                    borderRadius: 4,
                },
                {
                    label: 'Keluar',
                    data: chartData.map(d => d.out),
                    backgroundColor: '#f59e0b',
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

    return (
        <>
            <Head title="Inventoris Dashboard" />
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
                    <h1 className="text-xl font-bold mb-8">ChasierApp</h1>
                    <nav className="flex-1 space-y-2">
                        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                            <BarChart3 className="h-5 w-5" /> Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <ClipboardList className="h-5 w-5" /> Kelola Stok
                        </a>
                        <a href="/inventoris/laporan" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold">
                            <FileText className="h-5 w-5" /> Laporan
                        </a>
                    </nav>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold mt-auto">
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Dashboard Inventoris</h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bahan Masuk</p>
                            <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.stockInToday}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Hari ini</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <TrendingDown className="h-5 w-5 text-amber-600" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bahan Keluar</p>
                            <p className="text-2xl font-bold mt-1 text-amber-600">{stats.stockOutToday}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Hari ini</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Stok Menipis</p>
                            <p className="text-2xl font-bold mt-1 text-red-500">{stats.lowStockCount}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Dari {stats.totalIngredients} bahan</p>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Bahan</p>
                            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.totalIngredients}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{stats.totalWarehouses} gudang</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-primary" />
                                Pergerakan Stok (7 Hari Terakhir)
                            </h3>
                            <div className="h-64">
                                <Bar data={chartConfig.data} options={chartConfig.options} />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                Stok Menipis
                            </h3>
                            {lowStockList.length > 0 ? (
                                <div className="space-y-3">
                                    {lowStockList.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg border border-red-100">
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{item.name}</p>
                                                <p className="text-[10px] text-slate-500">{item.unit}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-red-600">{item.total_stock}</p>
                                                <p className="text-[10px] text-slate-500">Min: {item.min_stock}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                                    <Package className="h-10 w-10 mb-2" />
                                    <p className="text-xs font-medium">Semua stok aman</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-primary" />
                                Aktivitas Terbaru
                            </h3>
                        </div>
                        {recentLogs.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recentLogs.map(log => (
                                    <div key={log.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${log.type === 'in' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                                {log.type === 'in' ? (
                                                    <TrendingUp className={`h-4 w-4 ${log.type === 'in' ? 'text-emerald-600' : 'text-amber-600'}`} />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4 text-amber-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-800">
                                                    {log.type === 'in' ? 'Bahan Masuk' : 'Bahan Keluar'} — {log.ingredient}
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    {log.reason ?? '-'} oleh {log.user}
                                                </p>
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
                                <p className="text-xs font-medium">Belum ada aktivitas</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
