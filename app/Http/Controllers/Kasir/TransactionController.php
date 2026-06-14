<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\PaymentMethod;
use App\Models\Setting;
use App\Models\WarehouseIngredient;
use App\Models\InventoryLog;
use App\Models\MenuIngredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $menus = Menu::with('category')
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'price' => (float) $m->price,
                'image' => $m->image ? '/storage/' . $m->image : null,
                'category' => $m->category?->name ?? 'Umum',
                'category_id' => $m->category_id,
            ]);

        $categories = $menus->pluck('category')->unique()->values();

        $paymentMethods = PaymentMethod::all(['id', 'name']);

        $resepActive = Setting::getValue('resep_active') === 'true';

        $todayTransactions = Transaction::whereDate('created_at', today())
            ->where('user_id', Auth::id())
            ->count();

        return Inertia::render('kasir/dashboard', [
            'menus' => $menus,
            'categories' => $categories,
            'paymentMethods' => $paymentMethods,
            'resepActive' => $resepActive,
            'todayCount' => $todayTransactions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.harga' => 'required|numeric|min:0',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'bayar' => 'required|numeric|min:0',
        ]);

        $total = collect($validated['items'])->sum(fn ($item) => $item['harga'] * $item['qty']);
        $kembalian = $validated['bayar'] - $total;

        if ($kembalian < 0) {
            return back()->withErrors(['bayar' => 'Uang tidak mencukupi.']);
        }

        $resepActive = Setting::getValue('resep_active') === 'true';

        DB::beginTransaction();
        try {
            $transaction = Transaction::create([
                'user_id' => Auth::id(),
                'payment_method_id' => $validated['payment_method_id'],
                'total_amount' => $total,
            ]);

            foreach ($validated['items'] as $item) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'menu_id' => $item['menu_id'],
                    'quantity' => $item['qty'],
                    'price' => $item['harga'],
                ]);

                if ($resepActive) {
                    $this->deductStockForMenu($item['menu_id'], $item['qty']);
                }
            }

            DB::commit();

            return redirect()->route('kasir.dashboard')
                ->with('success', [
                    'message' => 'Transaksi berhasil!',
                    'transaction' => [
                        'id' => $transaction->id,
                        'total' => $total,
                        'bayar' => (float) $validated['bayar'],
                        'kembalian' => $kembalian,
                        'items' => $validated['items'],
                        'created_at' => $transaction->created_at->format('d/m/Y H:i:s'),
                    ],
                ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memproses transaksi: ' . $e->getMessage()]);
        }
    }

    private function deductStockForMenu(int $menuId, int $qty): void
    {
        $resep = MenuIngredient::where('menu_id', $menuId)->get();

        foreach ($resep as $r) {
            $totalNeeded = $r->quantity * $qty;

            $warehouseStocks = WarehouseIngredient::where('ingredient_id', $r->ingredient_id)
                ->where('stock', '>', 0)
                ->orderBy('stock', 'desc')
                ->get();

            $remaining = $totalNeeded;

            foreach ($warehouseStocks as $ws) {
                if ($remaining <= 0) break;

                $deduct = min($ws->stock, $remaining);
                $ws->decrement('stock', $deduct);
                $remaining -= $deduct;

                InventoryLog::create([
                    'ingredient_id' => $r->ingredient_id,
                    'warehouse_id' => $ws->warehouse_id,
                    'user_id' => Auth::id(),
                    'type' => 'out',
                    'quantity' => $deduct,
                    'reason' => "Penjualan menu #{$menuId} x{$qty}",
                ]);
            }
        }
    }
}
