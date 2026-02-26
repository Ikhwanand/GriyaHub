<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('kategori'); // gaji_satpam, token_listrik, perbaikan_jalan, dll
            $table->string('deskripsi');
            $table->decimal('jumlah', 12, 2);
            $table->date('tanggal');
            $table->boolean('is_recurring')->default(false); // pengeluaran rutin bulanan
            $table->timestamps();

            $table->index('tanggal');
            $table->index('kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
