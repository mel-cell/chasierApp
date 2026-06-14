<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WarehouseIngredient extends Model
{
    protected $fillable = ['warehouse_id', 'ingredient_id', 'stock'];

    protected $casts = ['stock' => 'decimal:2'];

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }
}
