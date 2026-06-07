<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        \App\Models\User::Create([
            'name' => 'Lintang',
            'email' => 'owner@gmail.com',
            'password' => bcrypt('kontol'),
            'role' => 'owner',
            "email_verified_at" => Now(),
        ]);

        \App\Models\PaymentMethod::insert([
            ['name' => 'Tunai'],
            ['name' => 'Non Tunai'],
        ]);

        \App\Models\Warehouse::create([
            'name' => 'Gudang Dapur',
            'user_id' => null
        ]);

        \App\Models\Ingredient::create([
            'name' => 'Kopi Arabica',
            'unit' => 'gram',
            'min_stock' => 500
        ]);
    }
}
