<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::withTrashed()
            ->with('category')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'price' => (float) $m->price,
                'image' => $m->image,
                'is_active' => $m->is_active,
                'deleted_at' => $m->deleted_at,
                'category' => $m->category ? ['id' => $m->category->id, 'name' => $m->category->name] : null,
            ]);

        return Inertia::render('admin/Menus', [
            'menus' => $menus,
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('menus', 'public');
        }

        $validated['is_active'] = $request->boolean('is_active', true);

        Menu::create($validated);

        return redirect()->route('admin.menus.index')
            ->with('success', 'Menu berhasil ditambahkan.');
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($menu->image) {
                Storage::disk('public')->delete($menu->image);
            }
            $validated['image'] = $request->file('image')->store('menus', 'public');
        }

        $menu->update($validated);

        return redirect()->route('admin.menus.index')
            ->with('success', 'Menu berhasil diperbarui.');
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();

        return redirect()->route('admin.menus.index')
            ->with('success', 'Menu berhasil dinonaktifkan.');
    }

    public function restore($id)
    {
        $menu = Menu::withTrashed()->findOrFail($id);
        $menu->restore();

        return redirect()->route('admin.menus.index')
            ->with('success', 'Menu berhasil diaktifkan kembali.');
    }
}
