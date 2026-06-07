<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('auth/login', function () {
    return Inertia::render('auth/Login');
});

Route::get('kasir/dashboard', function () {
    return Inertia::render('kasir/dashboard');
});

Route::get('kasir/profile', function () {
    return Inertia::render('kasir/Profile');
});

Route::get('kasir/settings', function () {
    return Inertia::render('kasir/Settings');
});
