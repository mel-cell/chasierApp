<?php

namespace App\Http\Controllers\Inventoris;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\InventoryLog;
use App\Models\WarehouseIngredient;
use App\Models\Warehouse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $stockInToday = InventoryLog::where('type', 'in')
            ->whereDate('created_at', $today)
            ->sum('quantity');

        $stockOutToday = InventoryLog::where('type', 'out')
            ->whereDate('created_at', $today)
            ->sum('quantity');

        $totalIngredients = Ingredient::count();

        $lowStockIngredients = Ingredient::whereHas('warehouseIngredients', function ($q) {
            $q->select(DB::raw('SUM(stock)'))
                ->havingRaw('COALESCE(SUM(stock), 0) <= ingredients.min_stock');
        })->orWhereDoesntHave('warehouseIngredients')
            ->count();

        $lowStockList = Ingredient::withSum('warehouseIngredients', 'stock')
            ->get()
            ->filter(fn ($i) => ($i->warehouse_ingredients_sum_stock ?? 0) <= $i->min_stock)
            ->take(10)
            ->values()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => $i->name,
                'unit' => $i->unit,
                'min_stock' => (float) $i->min_stock,
                'total_stock' => (float) ($i->warehouse_ingredients_sum_stock ?? 0),
            ]);

        $totalWarehouses = Warehouse::count();

        $logs = InventoryLog::with(['ingredient', 'user'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($l) => [
                'id' => $l->id,
                'type' => $l->type,
                'quantity' => (float) $l->quantity,
                'reason' => $l->reason,
                'ingredient' => $l->ingredient?->name ?? 'Dihapus',
                'user' => $l->user?->name ?? 'Sistem',
                'created_at' => $l->created_at->format('d/m/Y H:i'),
            ]);

        $chartData = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            $dayName = $date->format('D');
            $shortDay = match ($dayName) {
                'Mon' => 'Sen',
                'Tue' => 'Sel',
                'Wed' => 'Rab',
                'Thu' => 'Kam',
                'Fri' => 'Jum',
                'Sat' => 'Sab',
                'Sun' => 'Min',
                default => $dayName,
            };

            $in = (float) InventoryLog::where('type', 'in')
                ->whereDate('created_at', $date)
                ->sum('quantity');

            $out = (float) InventoryLog::where('type', 'out')
                ->whereDate('created_at', $date)
                ->sum('quantity');

            return [
                'date' => $shortDay,
                'in' => $in,
                'out' => $out,
            ];
        });

        return Inertia::render('inventoris/Dashboard', [
            'stats' => [
                'stockInToday' => $stockInToday,
                'stockOutToday' => $stockOutToday,
                'totalIngredients' => $totalIngredients,
                'lowStockCount' => $lowStockIngredients,
                'totalWarehouses' => $totalWarehouses,
            ],
            'lowStockList' => $lowStockList,
            'recentLogs' => $logs,
            'chartData' => $chartData,
        ]);
    }
}
