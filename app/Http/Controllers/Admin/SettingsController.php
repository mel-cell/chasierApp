<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/Settings', [
            'settings' => [
                'inventoris_active' => Setting::getValue('inventoris_active', 'true'),
                'resep_active' => Setting::getValue('resep_active', 'false'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'inventoris_active' => 'required|in:true,false',
            'resep_active' => 'required|in:true,false',
        ]);

        Setting::setValue('inventoris_active', $validated['inventoris_active']);
        Setting::setValue('resep_active', $validated['resep_active']);

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
