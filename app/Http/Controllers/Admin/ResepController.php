<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Ingredient;
use App\Models\MenuIngredient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResepController extends Controller
{
    public function index()
    {
        $menus = Menu::withTrashed()
            ->with(['category', 'ingredients'])
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'category' => $m->category?->name,
                'price' => (float) $m->price,
                'is_active' => $m->is_active,
                'deleted_at' => $m->deleted_at,
                'ingredients_count' => $m->ingredients->count(),
            ]);

        return Inertia::render('admin/Resep', [
            'menus' => $menus,
            'ingredients' => Ingredient::all(['id', 'name', 'unit']),
        ]);
    }

    public function show(Menu $menu)
    {
        $menu->load('ingredients');

        return response()->json([
            'menu' => [
                'id' => $menu->id,
                'name' => $menu->name,
            ],
            'ingredients' => $menu->ingredients->map(fn ($i) => [
                'id' => $i->pivot->id,
                'ingredient_id' => $i->id,
                'name' => $i->name,
                'unit' => $i->unit,
                'quantity' => (float) $i->pivot->quantity,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:50',
        ]);

        $exists = MenuIngredient::where('menu_id', $validated['menu_id'])
            ->where('ingredient_id', $validated['ingredient_id'])
            ->exists();

        if ($exists) {
            return back()->with('error', 'Bahan sudah ada di resep menu ini.');
        }

        MenuIngredient::create($validated);

        return back()->with('success', 'Bahan berhasil ditambahkan ke resep.');
    }

    public function update(Request $request, MenuIngredient $menuIngredient)
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:50',
        ]);

        $menuIngredient->update($validated);

        return back()->with('success', 'Resep berhasil diperbarui.');
    }

    public function destroy(MenuIngredient $menuIngredient)
    {
        $menuIngredient->delete();

        return back()->with('success', 'Bahan berhasil dihapus dari resep.');
    }

    public function calculateStock(Menu $menu)
    {
        $menu->load('ingredients');

        $result = [];
        $canMake = null;

        foreach ($menu->ingredients as $ingredient) {
            $totalStock = $ingredient->warehouseIngredients()->sum('stock');
            $needed = $ingredient->pivot->quantity;
            $possible = $needed > 0 ? floor($totalStock / $needed) : 0;

            $result[] = [
                'name' => $ingredient->name,
                'unit' => $ingredient->unit,
                'total_stok' => (float) $totalStock,
                'needed_per_portion' => (float) $needed,
                'can_make' => (int) $possible,
            ];

            if ($canMake === null || $possible < $canMake) {
                $canMake = $possible;
            }
        }

        return response()->json([
            'menu_name' => $menu->name,
            'can_make' => max(0, (int) $canMake),
            'details' => $result,
        ]);
    }
}
