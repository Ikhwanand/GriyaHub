<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_lengkap',
        'foto_ktp',
        'status_penghuni',
        'nomor_telepon',
        'sudah_menikah',
    ];

    protected $casts = [
        'sudah_menikah' => 'boolean',
    ];

    // Relasi: penghuni bisa punya banyak riwayat rumah
    public function houseResidents(): HasMany
    {
        return $this->hasMany(HouseResident::class);
    }

    // Relasi: rumah yang ditinggali (many-to-many via pivot)
    public function houses(): BelongsToMany
    {
        return $this->belongsToMany(House::class, 'house_residents')
            ->withPivot(['tanggal_masuk', 'tanggal_keluar', 'is_active'])
            ->withTimestamps();
    }

    // Rumah yang aktif ditinggali sekarang
    public function activeHouse()
    {
        return $this->houses()->wherePivot('is_active', true)->first();
    }

    // Riwayat pembayaran
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
