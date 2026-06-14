<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return $this->redirectByRole();
        }
        return Inertia::render('auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'pin' => 'required|string|digits:6',
        ]);

        $user = User::where('pin', $request->pin)->where('is_active', true)->first();

        if (!$user) {
            return back()->withErrors([
                'pin' => 'PIN salah atau akun tidak aktif.',
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return $this->redirectByRole();
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    private function redirectByRole()
    {
        $user = Auth::user();

        return match ($user->role) {
            'owner' => redirect()->route('admin.dashboard'),
            'kasir' => redirect()->route('kasir.dashboard'),
            'inventoris' => redirect()->route('inventoris.dashboard'),
            default => redirect()->route('login'),
        };
    }
}
