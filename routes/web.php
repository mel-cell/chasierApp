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
