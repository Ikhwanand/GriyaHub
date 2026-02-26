<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'house_id',
        'jenis_iuran',
        'jumlah',
        'bulan',
        'tahun',
        'tanggal_bayar',
        'status',
        'periode',
    ];

    protected $casts = [
        'tanggal_bayar' => 'date',
        'jumlah' => 'decimal:2',
    ];

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function house(): BelongsTo
    {
        return $this->belongsTo(House::class);
    }

    // Scope: filter by status
    public function scopeLunas($query)
    {
        return $query->where('status', 'lunas');
    }

    public function scopeBelumLunas($query)
    {
        return $query->where('status', 'belum_lunas');
    }

    // Scope: filter by bulan & tahun
    public function scopeForPeriod($query, int $bulan, int $tahun)
    {
        return $query->where('bulan', $bulan)->where('tahun', $tahun);
    }
}
