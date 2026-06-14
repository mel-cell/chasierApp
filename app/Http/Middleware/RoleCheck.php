<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleCheck
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        if (!empty($roles) && !in_array(Auth::user()->role, $roles)) {
            abort(403, 'Akses ditolak.');
        }

        return $next($request);
    }
}
