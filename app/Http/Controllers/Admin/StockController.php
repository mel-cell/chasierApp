<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\Ingredient;
use App\Models\WarehouseIngredient;
use App\Models\InventoryLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index()
    {
        $warehouses = Warehouse::with(['ingredients.ingredient'])->get()->map(fn ($w) => [
            'id' => $w->id,
            'name' => $w->name,
            'stocks' => $w->ingredients->map(fn ($wi) => [
                'id' => $wi->id,
                'ingredient_id' => $wi->ingredient_id,
                'ingredient_name' => $wi->ingredient->name,
                'unit' => $wi->ingredient->unit,
                'min_stock' => (float) $wi->ingredient->min_stock,
                'stock' => (float) $wi->stock,
                'is_low' => $wi->stock <= $wi->ingredient->min_stock,
            ]),
        ]);

        return Inertia::render('admin/Stock', [
            'warehouses' => $warehouses,
            'ingredients' => Ingredient::all(['id', 'name', 'unit']),
        ]);
    }

    public function addStock(Request $request)
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric|min:0.01',
            'reason' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            $wi = WarehouseIngredient::firstOrCreate(
                [
                    'warehouse_id' => $validated['warehouse_id'],
                    'ingredient_id' => $validated['ingredient_id'],
                ],
                ['stock' => 0]
            );

            $wi->increment('stock', $validated['quantity']);

            InventoryLog::create([
                'ingredient_id' => $validated['ingredient_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'user_id' => Auth::id(),
                'type' => 'in',
                'quantity' => $validated['quantity'],
                'reason' => $validated['reason'] ?? 'Stok masuk',
            ]);
        });

        return redirect()->route('admin.stock.index')
            ->with('success', 'Stok berhasil ditambahkan.');
    }

    public function removeStock(Request $request)
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric|min:0.01',
            'reason' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            $wi = WarehouseIngredient::where([
                'warehouse_id' => $validated['warehouse_id'],
                'ingredient_id' => $validated['ingredient_id'],
            ])->firstOrFail();

            if ($wi->stock < $validated['quantity']) {
                abort(422, 'Stok tidak mencukupi.');
            }

            $wi->decrement('stock', $validated['quantity']);

            InventoryLog::create([
                'ingredient_id' => $validated['ingredient_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'user_id' => Auth::id(),
                'type' => 'out',
                'quantity' => $validated['quantity'],
                'reason' => $validated['reason'] ?? 'Stok keluar',
            ]);
        });

        return redirect()->route('admin.stock.index')
            ->with('success', 'Stok berhasil dikurangi.');
    }

    public function adjustStock(Request $request)
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'stock' => 'required|numeric|min:0',
            'reason' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            $wi = WarehouseIngredient::firstOrCreate(
                [
                    'warehouse_id' => $validated['warehouse_id'],
                    'ingredient_id' => $validated['ingredient_id'],
                ],
                ['stock' => 0]
            );

            $diff = $validated['stock'] - $wi->stock;
            $wi->update(['stock' => $validated['stock']]);

            if ($diff != 0) {
                InventoryLog::create([
                    'ingredient_id' => $validated['ingredient_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'user_id' => Auth::id(),
                    'type' => $diff > 0 ? 'in' : 'out',
                    'quantity' => abs($diff),
                    'reason' => $validated['reason'] ?? 'Penyesuaian stok',
                ]);
            }
        });

        return redirect()->route('admin.stock.index')
            ->with('success', 'Stok berhasil disesuaikan.');
    }
}
