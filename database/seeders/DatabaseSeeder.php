<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PaymentMethod;
use App\Models\Warehouse;
use App\Models\Ingredient;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedUsers();
        $this->seedPaymentMethods();
        $this->seedDefaults();

        $this->call(DummyDataSeeder::class);
    }

    private function seedUsers(): void
    {
        $jsonPath = database_path('seeders/data/users.json');
        if (!File::exists($jsonPath)) {
            $jsonPath = base_path('user.json');
        }

        if (!File::exists($jsonPath)) {
            $this->command->error('user.json not found!');
            return;
        }

        $users = json_decode(File::get($jsonPath), true);

        foreach ($users as $data) {
            User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'pin' => $data['pin'],
                'role' => $data['role'],
                'is_active' => $data['is_active'],
            ]);
        }

        $this->command->info(count($users) . ' users created from user.json');
    }

    private function seedPaymentMethods(): void
    {
        PaymentMethod::insert([
            ['name' => 'Tunai'],
            ['name' => 'Non Tunai'],
        ]);
    }

    private function seedDefaults(): void
    {
        Setting::create(['key' => 'inventoris_active', 'value' => 'true']);
        Setting::create(['key' => 'resep_active', 'value' => 'false']);
    }
}
