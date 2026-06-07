<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\InventoryLog;

class Ingredient extends Model
{
    protected $fillable = ['name', 'unit', 'min_stock'];

    public function logs(): HasMany
    {
        return $this->hasMany(InventoryLog::class);
    }
}
