<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained()->cascadeOnDelete();
            $table->foreignId('house_id')->constrained()->cascadeOnDelete();
            $table->enum('jenis_iuran', ['satpam', 'kebersihan']);
            $table->decimal('jumlah', 12, 2);
            $table->unsignedTinyInteger('bulan'); // 1-12
            $table->unsignedSmallInteger('tahun');
            $table->date('tanggal_bayar')->nullable();
            $table->enum('status', ['lunas', 'belum_lunas'])->default('belum_lunas');
            $table->enum('periode', ['bulanan', 'tahunan'])->default('bulanan');
            $table->timestamps();

            $table->index(['resident_id', 'tahun', 'bulan']);
            $table->index(['house_id', 'tahun', 'bulan']);
            $table->index(['jenis_iuran', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
