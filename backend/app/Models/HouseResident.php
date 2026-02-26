<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseResident extends Model
{
    use HasFactory;

    protected $fillable = [
        'house_id',
        'resident_id',
        'tanggal_masuk',
        'tanggal_keluar',
        'is_active',
    ];

    protected $casts = [
        'tanggal_masuk' => 'date',
        'tanggal_keluar' => 'date',
        'is_active' => 'boolean',
    ];

    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class);
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }
}
