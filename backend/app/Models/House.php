<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class House extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_rumah',
        'alamat',
        'status_hunian',
    ];

    // Riwayat penghuni rumah ini
    public function houseResidents(): HasMany
    {
        return $this->hasMany(HouseResident::class);
    }

    // Semua penghuni (many-to-many via pivot)
    public function residents(): BelongsToMany
    {
        return $this->belongsToMany(Resident::class, 'house_residents')
            ->withPivot(['tanggal_masuk', 'tanggal_keluar', 'is_active'])
            ->withTimestamps();
    }

    // Penghuni yang aktif sekarang
    public function activeResidents()
    {
        return $this->residents()->wherePivot('is_active', true);
    }

    // Riwayat pembayaran untuk rumah ini
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
