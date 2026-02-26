<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'kategori',
        'deskripsi',
        'jumlah',
        'tanggal',
        'is_recurring',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah' => 'decimal:2',
        'is_recurring' => 'boolean',
    ];

    // Scope: filter by bulan & tahun
    public function scopeForMonth($query, int $bulan, int $tahun)
    {
        return $query->whereMonth('tanggal', $bulan)->whereYear('tanggal', $tahun);
    }
}
