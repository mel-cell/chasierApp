<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryLog extends Model
{
    protected $fillable = ['ingredient_id', 'warehouse_id', 'type', 'quantity', 'reason'];

    protected $casts = ['quantity' => 'decimal:2'];

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }
}
