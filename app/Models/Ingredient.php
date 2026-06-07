<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\InventoryLog;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Menu; 

class Ingredient extends Model
{
    protected $fillable = ['name', 'unit', 'min_stock'];

    public function logs(): HasMany
    {
        return $this->hasMany(InventoryLog::class);
    }

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'menu_indgredients')
                    ->withPivot('quantity', 'unit')
                    ->withTimestamps();
    }
}
