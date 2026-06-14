<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::withTrashed()->with('warehouses')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'deleted_at' => $user->deleted_at,
            ];
        });

        return Inertia::render('admin/Users', [
            'users' => $users,
            'warehouses' => Warehouse::all(['id', 'name']),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        User::create($request->validated());

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil ditambahkan.');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        if ($user->role === 'owner') {
            return back()->with('error', 'Tidak bisa menghapus user owner.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dinonaktifkan.');
    }

    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil diaktifkan kembali.');
    }

    public function toggleActive(User $user)
    {
        if ($user->role === 'owner') {
            return back()->with('error', 'Tidak bisa menonaktifkan user owner.');
        }

        $user->update(['is_active' => !$user->is_active]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Status user berhasil diubah.');
    }

    public function resetPin(Request $request, User $user)
    {
        $request->validate(['pin' => 'required|digits:6']);

        $user->update(['pin' => $request->pin]);

        return redirect()->route('admin.users.index')
            ->with('success', 'PIN user berhasil direset.');
    }
}
