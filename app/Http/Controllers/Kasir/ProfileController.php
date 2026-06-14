<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('kasir/Profile', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'joined' => $user->created_at->format('d F Y'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'pin' => 'nullable|string|digits:6',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['pin'])) {
            $user->pin = $validated['pin'];
        }

        $user->save();

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function settings()
    {
        return Inertia::render('kasir/Settings', [
            'taxRate' => Setting::getValue('tax_rate', '11'),
        ]);
    }

    public function updateSettings(Request $request)
    {
        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
