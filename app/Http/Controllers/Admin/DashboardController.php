<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $revenueToday = Transaction::whereDate('created_at', $today)
            ->sum('total_amount');

        $transactionsToday = Transaction::whereDate('created_at', $today)
            ->count();

        $lowStockCount = Ingredient::withSum('warehouseIngredients', 'stock')
            ->get()
            ->filter(fn ($i) => ($i->warehouse_ingredients_sum_stock ?? 0) <= $i->min_stock)
            ->count();

        $totalMenus = \App\Models\Menu::whereNull('deleted_at')->count();
        $totalUsers = \App\Models\User::count();

        $revenueChart = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            $dayName = $date->format('D');
            $shortDay = match ($dayName) {
                'Mon' => 'Sen', 'Tue' => 'Sel', 'Wed' => 'Rab',
                'Thu' => 'Kam', 'Fri' => 'Jum', 'Sat' => 'Sab',
                'Sun' => 'Min', default => $dayName,
            };

            $revenue = (float) Transaction::whereDate('created_at', $date)->sum('total_amount');
            $count = Transaction::whereDate('created_at', $date)->count();

            return [
                'date' => $shortDay,
                'revenue' => $revenue,
                'transactions' => $count,
            ];
        });

        $topMenuIds = TransactionDetail::select(
                'menu_id',
                DB::raw('SUM(quantity) as total_qty'),
                DB::raw('SUM(price * quantity) as total_revenue')
            )
            ->whereDate('created_at', '>=', Carbon::today()->subDays(30))
            ->groupBy('menu_id')
            ->orderByDesc('total_qty')
            ->take(5)
            ->get();

        $menuNames = \App\Models\Menu::whereIn('id', $topMenuIds->pluck('menu_id'))
            ->get()
            ->keyBy('id');

        $topMenus = $topMenuIds->map(fn ($d) => [
            'menu_id' => $d->menu_id,
            'name' => $menuNames->get($d->menu_id)?->name ?? 'Menu Dihapus',
            'total_qty' => (int) $d->total_qty,
            'total_revenue' => (float) $d->total_revenue,
        ]);

        $recentTransactions = Transaction::with(['user', 'paymentMethod'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'total_amount' => (float) $t->total_amount,
                'user' => $t->user?->name ?? 'Dihapus',
                'payment_method' => $t->paymentMethod?->name ?? '-',
                'item_count' => $t->details()->count(),
                'created_at' => $t->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'revenueToday' => $revenueToday,
                'transactionsToday' => $transactionsToday,
                'lowStockCount' => $lowStockCount,
                'totalMenus' => $totalMenus,
                'totalUsers' => $totalUsers,
            ],
            'revenueChart' => $revenueChart,
            'topMenus' => $topMenus,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
