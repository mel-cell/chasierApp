<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    protected $fillable = ['name', 'unit', 'min_stock'];

    public function logs(): HasMany
    {
        return $this->hasMany(InventoryLog::class);
    }

    public function warehouseIngredients(): HasMany
    {
        return $this->hasMany(WarehouseIngredient::class);
    }

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'menu_ingredients')
                    ->withPivot('quantity', 'unit')
                    ->withTimestamps();
    }
}
