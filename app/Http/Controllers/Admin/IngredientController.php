<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IngredientController extends Controller
{
    public function index()
    {
        $ingredients = Ingredient::withSum('warehouseIngredients as total_stok', 'stock')
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => $i->name,
                'unit' => $i->unit,
                'min_stock' => (float) $i->min_stock,
                'total_stok' => (float) ($i->total_stok ?? 0),
                'is_low' => ($i->total_stok ?? 0) <= $i->min_stock,
            ]);

        return Inertia::render('admin/Ingredients', [
            'ingredients' => $ingredients,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'min_stock' => 'required|numeric|min:0',
        ]);

        Ingredient::create($validated);

        return redirect()->route('admin.ingredients.index')
            ->with('success', 'Bahan berhasil ditambahkan.');
    }

    public function update(Request $request, Ingredient $ingredient)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'unit' => 'sometimes|string|max:50',
            'min_stock' => 'sometimes|numeric|min:0',
        ]);

        $ingredient->update($validated);

        return redirect()->route('admin.ingredients.index')
            ->with('success', 'Bahan berhasil diperbarui.');
    }

    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();

        return redirect()->route('admin.ingredients.index')
            ->with('success', 'Bahan berhasil dihapus.');
    }
}
