<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Ingredient;
use App\Models\Warehouse;
use App\Models\WarehouseIngredient;
use App\Models\MenuIngredient;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\InventoryLog;
use App\Models\User;
use App\Models\PaymentMethod;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Seeding dummy data...');

        Storage::makeDirectory('public/menus');

        $categories = $this->seedCategories();
        $menus = $this->seedMenus($categories);
        $ingredients = $this->seedIngredients();
        $warehouses = $this->seedWarehouses();
        $this->seedWarehouseStock($warehouses, $ingredients);
        $this->seedMenuIngredients($menus, $ingredients);
        $this->seedTransactions($menus);

        $this->command->info('Dummy data seeded successfully!');
    }

    private function seedCategories(): array
    {
        $names = ['Makanan', 'Minuman', 'Kopi', 'Cemilan', 'Pastry'];
        $categories = [];
        foreach ($names as $name) {
            $categories[$name] = Category::create(['name' => $name]);
        }
        $this->command->info('5 categories created');
        return $categories;
    }

    private function seedMenus(array $categories): array
    {
        $menuData = [
            ['Nasi Goreng Spesial', 25000, 'Makanan'],
            ['Mie Ayam Bakso', 20000, 'Makanan'],
            ['Ayam Geprek Sambal Matah', 28000, 'Makanan'],
            ['Ikan Bakar Jimbaran', 35000, 'Makanan'],
            ['Sate Ayam Madura', 22000, 'Makanan'],
            ['Es Teh Manis', 5000, 'Minuman'],
            ['Jus Alpukat', 15000, 'Minuman'],
            ['Jus Mangga', 15000, 'Minuman'],
            ['Es Campur', 13000, 'Minuman'],
            ['Kopi Susu Gula Aren', 18000, 'Kopi'],
            ['Kopi Hitam', 12000, 'Kopi'],
            ['Cappuccino', 22000, 'Kopi'],
            ['Matcha Latte', 22000, 'Kopi'],
            ['Kentang Goreng', 15000, 'Cemilan'],
            ['Pisang Goreng Keju', 12000, 'Cemilan'],
            ['Roti Bakar Coklat', 14000, 'Cemilan'],
            ['Lumpia Udang', 18000, 'Cemilan'],
            ['Croissant', 15000, 'Pastry'],
            ['Banana Muffin', 12000, 'Pastry'],
            ['Choco Lava Cake', 25000, 'Pastry'],
        ];

        $menus = [];
        foreach ($menuData as [$name, $price, $cat]) {
            $slug = strtolower(str_replace(' ', '-', $name));
            $imagePath = $this->downloadImage($slug);

            $menu = Menu::create([
                'category_id' => $categories[$cat]->id,
                'name' => $name,
                'price' => $price,
                'image' => $imagePath,
                'is_active' => true,
            ]);
            $menus[$name] = $menu;
        }
        $this->command->info('20 menus created with images');
        return $menus;
    }

    private function downloadImage(string $slug): ?string
    {
        $filename = "menus/{$slug}.jpg";
        $path = "public/{$filename}";

        if (Storage::exists($path)) {
            return $filename;
        }

        $url = "https://picsum.photos/seed/{$slug}/400/400";
        try {
            $context = stream_context_create([
                'http' => ['timeout' => 5, 'user_agent' => 'ChasierApp/1.0'],
                'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
            ]);
            $imageData = @file_get_contents($url, false, $context);
            if ($imageData !== false) {
                Storage::put($path, $imageData);
                return $filename;
            }
        } catch (\Exception $e) {
            $this->command->warn("  Failed to download image for {$slug}");
        }
        return null;
    }

    private function seedIngredients(): array
    {
        $data = [
            ['Beras', 'gram', 5000],
            ['Telur', 'pcs', 20],
            ['Minyak Goreng', 'ml', 3000],
            ['Gula Pasir', 'gram', 2000],
            ['Kopi Bubuk', 'gram', 1000],
            ['Susu UHT', 'ml', 3000],
            ['Tepung Terigu', 'gram', 3000],
            ['Mentega', 'gram', 1000],
            ['Ayam Fillet', 'gram', 3000],
            ['Daging Sapi Giling', 'gram', 2000],
            ['Garam', 'gram', 1000],
            ['Bawang Merah', 'gram', 500],
            ['Bawang Putih', 'gram', 500],
            ['Cabe Merah', 'gram', 500],
            ['Kecap Manis', 'ml', 1000],
            ['Saos Sambal', 'ml', 1000],
            ['Keju Parut', 'gram', 500],
            ['Coklat Bubuk', 'gram', 500],
            ['Matcha Bubuk', 'gram', 300],
            ['Es Batu', 'pcs', 100],
        ];

        $ingredients = [];
        foreach ($data as [$name, $unit, $minStock]) {
            $ing = Ingredient::create([
                'name' => $name,
                'unit' => $unit,
                'min_stock' => $minStock,
            ]);
            $ingredients[$name] = $ing;
        }
        $this->command->info('20 ingredients created');
        return $ingredients;
    }

    private function seedWarehouses(): array
    {
        $inventoris = User::where('role', 'inventoris')->first();

        $warehouses = [];
        $data = [
            ['Gudang Dapur Utama', $inventoris->id],
            ['Gudang Dry Storage', $inventoris->id],
            ['Gudang Chiller', $inventoris->id],
        ];

        foreach ($data as [$name, $userId]) {
            $w = Warehouse::create(['name' => $name, 'user_id' => $userId]);
            $warehouses[$name] = $w;
        }
        $this->command->info('3 warehouses created');
        return $warehouses;
    }

    private function seedWarehouseStock(array $warehouses, array $ingredients): void
    {
        $stocks = [
            'Gudang Dapur Utama' => [
                'Beras' => 25000, 'Telur' => 60, 'Minyak Goreng' => 5000,
                'Gula Pasir' => 3000, 'Kopi Bubuk' => 2000, 'Susu UHT' => 5000,
                'Tepung Terigu' => 4000, 'Mentega' => 1500, 'Ayam Fillet' => 5000,
                'Daging Sapi Giling' => 3000, 'Garam' => 2000, 'Bawang Merah' => 1000,
                'Bawang Putih' => 800, 'Cabe Merah' => 600, 'Kecap Manis' => 2000,
                'Saos Sambal' => 1500, 'Keju Parut' => 500, 'Coklat Bubuk' => 800,
                'Matcha Bubuk' => 400, 'Es Batu' => 200,
            ],
            'Gudang Dry Storage' => [
                'Beras' => 50000, 'Gula Pasir' => 10000, 'Kopi Bubuk' => 5000,
                'Tepung Terigu' => 8000, 'Garam' => 5000, 'Kecap Manis' => 5000,
                'Saos Sambal' => 3000, 'Coklat Bubuk' => 2000, 'Matcha Bubuk' => 1000,
                'Minyak Goreng' => 10000, 'Mentega' => 3000,
            ],
            'Gudang Chiller' => [
                'Telur' => 120, 'Susu UHT' => 10000, 'Ayam Fillet' => 8000,
                'Daging Sapi Giling' => 5000, 'Keju Parut' => 1500, 'Mentega' => 2000,
            ],
        ];

        foreach ($stocks as $whName => $items) {
            $warehouse = $warehouses[$whName];
            foreach ($items as $ingName => $stock) {
                if (isset($ingredients[$ingName])) {
                    WarehouseIngredient::create([
                        'warehouse_id' => $warehouse->id,
                        'ingredient_id' => $ingredients[$ingName]->id,
                        'stock' => $stock,
                    ]);
                }
            }
        }
        $this->command->info('Warehouse stock seeded');
    }

    private function seedMenuIngredients(array $menus, array $ingredients): void
    {
        $resep = [
            'Nasi Goreng Spesial' => [
                ['Beras', 200, 'gram'], ['Telur', 1, 'pcs'], ['Minyak Goreng', 20, 'ml'],
                ['Garam', 2, 'gram'], ['Bawang Merah', 10, 'gram'], ['Bawang Putih', 5, 'gram'],
                ['Cabe Merah', 5, 'gram'], ['Kecap Manis', 10, 'ml'],
            ],
            'Mie Ayam Bakso' => [
                ['Tepung Terigu', 150, 'gram'], ['Telur', 1, 'pcs'], ['Ayam Fillet', 50, 'gram'],
                ['Bawang Merah', 5, 'gram'], ['Bawang Putih', 3, 'gram'], ['Kecap Manis', 10, 'ml'],
                ['Minyak Goreng', 15, 'ml'], ['Garam', 2, 'gram'],
            ],
            'Ayam Geprek Sambal Matah' => [
                ['Ayam Fillet', 150, 'gram'], ['Tepung Terigu', 50, 'gram'], ['Telur', 1, 'pcs'],
                ['Minyak Goreng', 30, 'ml'], ['Bawang Merah', 15, 'gram'], ['Cabe Merah', 10, 'gram'],
                ['Garam', 2, 'gram'],
            ],
            'Ikan Bakar Jimbaran' => [
                ['Minyak Goreng', 20, 'ml'], ['Bawang Merah', 10, 'gram'], ['Bawang Putih', 5, 'gram'],
                ['Cabe Merah', 5, 'gram'], ['Kecap Manis', 15, 'ml'], ['Garam', 3, 'gram'],
            ],
            'Sate Ayam Madura' => [
                ['Ayam Fillet', 100, 'gram'], ['Kecap Manis', 20, 'ml'], ['Bawang Merah', 10, 'gram'],
                ['Bawang Putih', 5, 'gram'], ['Minyak Goreng', 10, 'ml'], ['Garam', 2, 'gram'],
            ],
            'Es Teh Manis' => [
                ['Gula Pasir', 20, 'gram'], ['Es Batu', 5, 'pcs'],
            ],
            'Jus Alpukat' => [
                ['Susu UHT', 100, 'ml'], ['Gula Pasir', 15, 'gram'], ['Es Batu', 5, 'pcs'],
            ],
            'Jus Mangga' => [
                ['Susu UHT', 100, 'ml'], ['Gula Pasir', 15, 'gram'], ['Es Batu', 5, 'pcs'],
            ],
            'Es Campur' => [
                ['Gula Pasir', 20, 'gram'], ['Susu UHT', 50, 'ml'], ['Es Batu', 8, 'pcs'],
            ],
            'Kopi Susu Gula Aren' => [
                ['Kopi Bubuk', 15, 'gram'], ['Susu UHT', 100, 'ml'], ['Gula Pasir', 15, 'gram'],
                ['Es Batu', 5, 'pcs'],
            ],
            'Kopi Hitam' => [
                ['Kopi Bubuk', 12, 'gram'], ['Gula Pasir', 10, 'gram'],
            ],
            'Cappuccino' => [
                ['Kopi Bubuk', 12, 'gram'], ['Susu UHT', 120, 'ml'], ['Gula Pasir', 10, 'gram'],
                ['Coklat Bubuk', 5, 'gram'],
            ],
            'Matcha Latte' => [
                ['Matcha Bubuk', 10, 'gram'], ['Susu UHT', 150, 'ml'], ['Gula Pasir', 10, 'gram'],
            ],
            'Kentang Goreng' => [
                ['Minyak Goreng', 30, 'ml'], ['Garam', 2, 'gram'],
            ],
            'Pisang Goreng Keju' => [
                ['Tepung Terigu', 50, 'gram'], ['Minyak Goreng', 20, 'ml'], ['Keju Parut', 20, 'gram'],
                ['Gula Pasir', 10, 'gram'],
            ],
            'Roti Bakar Coklat' => [
                ['Mentega', 15, 'gram'], ['Coklat Bubuk', 10, 'gram'], ['Gula Pasir', 10, 'gram'],
                ['Keju Parut', 15, 'gram'],
            ],
            'Lumpia Udang' => [
                ['Tepung Terigu', 50, 'gram'], ['Minyak Goreng', 30, 'ml'], ['Bawang Putih', 3, 'gram'],
                ['Garam', 2, 'gram'],
            ],
            'Croissant' => [
                ['Tepung Terigu', 100, 'gram'], ['Mentega', 40, 'gram'], ['Telur', 1, 'pcs'],
                ['Gula Pasir', 10, 'gram'], ['Garam', 1, 'gram'],
            ],
            'Banana Muffin' => [
                ['Tepung Terigu', 80, 'gram'], ['Mentega', 30, 'gram'], ['Telur', 1, 'pcs'],
                ['Gula Pasir', 20, 'gram'], ['Coklat Bubuk', 5, 'gram'],
            ],
            'Choco Lava Cake' => [
                ['Tepung Terigu', 60, 'gram'], ['Mentega', 40, 'gram'], ['Telur', 1, 'pcs'],
                ['Gula Pasir', 30, 'gram'], ['Coklat Bubuk', 20, 'gram'],
            ],
        ];

        foreach ($resep as $menuName => $items) {
            if (!isset($menus[$menuName])) continue;
            $menu = $menus[$menuName];
            foreach ($items as [$ingName, $qty, $unit]) {
                if (isset($ingredients[$ingName])) {
                    MenuIngredient::create([
                        'menu_id' => $menu->id,
                        'ingredient_id' => $ingredients[$ingName]->id,
                        'quantity' => $qty,
                        'unit' => $unit,
                    ]);
                }
            }
        }
        $this->command->info('Menu ingredients (resep) seeded');
    }

    private function seedTransactions(array $menus): void
    {
        $users = User::where('role', 'kasir')->get();
        $paymentMethods = PaymentMethod::all()->keyBy('name');
        $methods = [$paymentMethods['Tunai'], $paymentMethods['Non Tunai']];

        $menuList = array_values($menus);
        $transCount = 0;

        for ($day = 29; $day >= 0; $day--) {
            $date = Carbon::today()->subDays($day);
            $isWeekend = $date->isWeekend();
            $numTransactions = $isWeekend ? rand(4, 8) : rand(2, 5);

            for ($t = 0; $t < $numTransactions; $t++) {
                $user = $users->random();
                $method = $methods[array_rand($methods)];

                $hour = rand(8, 21);
                $minute = rand(0, 59);
                $second = rand(0, 59);
                $txDate = $date->copy()->setTime($hour, $minute, $second);

                $numItems = rand(1, 4);
                $selectedKeys = array_rand($menuList, min($numItems, count($menuList)));
                if (!is_array($selectedKeys)) $selectedKeys = [$selectedKeys];

                $total = 0;
                $details = [];

                foreach ($selectedKeys as $key) {
                    $menu = $menuList[$key];
                    $qty = rand(1, 3);
                    $subtotal = $menu->price * $qty;
                    $total += $subtotal;
                    $details[] = ['menu' => $menu, 'qty' => $qty, 'price' => $menu->price];
                }

                $transaction = Transaction::create([
                    'user_id' => $user->id,
                    'payment_method_id' => $method->id,
                    'total_amount' => $total,
                    'created_at' => $txDate,
                    'updated_at' => $txDate,
                ]);

                foreach ($details as $d) {
                    DB::table('transaction_details')->insert([
                        'transaction_id' => $transaction->id,
                        'menu_id' => $d['menu']->id,
                        'quantity' => $d['qty'],
                        'price' => $d['price'],
                        'created_at' => $txDate,
                        'updated_at' => $txDate,
                    ]);
                }

                $transCount++;
            }
        }

        $this->command->info("{$transCount} dummy transactions created");
    }
}
