<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function index()
    {
        $warehouses = Warehouse::with('user:id,name')->get()->map(fn ($w) => [
            'id' => $w->id,
            'name' => $w->name,
            'user' => $w->user ? ['id' => $w->user->id, 'name' => $w->user->name] : null,
            'ingredients_count' => $w->ingredients()->count(),
        ]);

        return Inertia::render('admin/Warehouses', [
            'warehouses' => $warehouses,
            'users' => User::where('role', 'inventoris')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        Warehouse::create($validated);

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Gudang berhasil ditambahkan.');
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $warehouse->update($validated);

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Gudang berhasil diperbarui.');
    }

    public function destroy(Warehouse $warehouse)
    {
        $warehouse->delete();

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Gudang berhasil dihapus.');
    }
}
