<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseIngredient extends Model
{
    protected $fillable = ['warehouse_id', 'ingredient_id', 'stock'];

    protected $casts = ['stock' => 'decimal:2'];
}
