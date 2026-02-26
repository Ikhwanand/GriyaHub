<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pivot table: catatan historical siapa penghuni tiap rumah
        Schema::create('house_residents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->cascadeOnDelete();
            $table->foreignId('resident_id')->constrained()->cascadeOnDelete();
            $table->date('tanggal_masuk');
            $table->date('tanggal_keluar')->nullable(); // null = masih tinggal
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['house_id', 'is_active']);
            $table->index(['resident_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('house_residents');
    }
};
