<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Menu extends Model
{
    use SoftDeletes;

    protected $fillable = ['category_id', 'name', 'price', 'image', 'is_active'];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'menu_ingredients')
                    ->withPivot('quantity', 'unit')
                    ->withTimestamps();
    }

    public function getStockAttribute()
    {
        if ($this->ingredients->isEmpty()) {
            return 0;
        }

        $possiblePortions = [];

        foreach ($this->ingredients as $ingredient) {
            // ambil stock bahan ini di seluruh gudang
            $totalStock = WarehouseIngredient::Where('ingredient_id', $ingredient->id)
                            ->sum('stock');

            $needed = $ingredient->pivot->quantity;

            // mencegah pembagian 0 
            if ($needed > 0) {
                $possiblePortions[] = floor($totalStock / $needed);
            } else {
                $possiblePortions[] = 0;
            }
        }

        return min($possiblePortions);
    }
}
