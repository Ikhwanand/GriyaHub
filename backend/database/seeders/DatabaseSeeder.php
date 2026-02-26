<?php

namespace Database\Seeders;

use App\Models\Expense;
use App\Models\House;
use App\Models\HouseResident;
use App\Models\Payment;
use App\Models\Resident;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =============================================
        // 1. Buat 20 Rumah
        // =============================================
        for ($i = 1; $i <= 20; $i++) {
            House::create([
                'nomor_rumah'   => 'A-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'alamat'        => 'Jl. Griya Indah Blok A No. ' . $i,
                'status_hunian' => $i <= 15 ? 'dihuni' : 'tidak_dihuni',
            ]);
        }

        // =============================================
        // 2. Buat 15 Penghuni Tetap + 3 Penghuni Kontrak
        // =============================================
        $namaList = [
            'Ahmad Fauzi', 'Budi Santoso', 'Citra Dewi', 'Dedi Kurniawan',
            'Eka Putri', 'Fajar Hidayat', 'Gita Pertiwi', 'Hendra Wijaya',
            'Indah Sari', 'Joko Susilo', 'Kartini Rahayu', 'Lukman Hakim',
            'Maya Anggraini', 'Nur Hidayah', 'Oscar Pratama',
            // Kontrak
            'Putu Darmawan', 'Rini Sumarni', 'Sartono Wibowo',
        ];

        $residents = [];
        foreach ($namaList as $idx => $nama) {
            $residents[] = Resident::create([
                'nama_lengkap'    => $nama,
                'status_penghuni' => $idx < 15 ? 'tetap' : 'kontrak',
                'nomor_telepon'   => '0812' . str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT),
                'sudah_menikah'   => $idx < 12, // 12 orang sudah menikah
            ]);
        }

        // =============================================
        // 3. Assign Penghuni ke Rumah (15 tetap + 3 kontrak)
        // =============================================
        foreach ($residents as $idx => $resident) {
            $houseId = $idx + 1; // Rumah 1-18
            if ($houseId <= 20) {
                HouseResident::create([
                    'house_id'      => $houseId,
                    'resident_id'   => $resident->id,
                    'tanggal_masuk' => $idx < 15 ? '2023-01-01' : '2024-06-01',
                    'is_active'     => true,
                ]);

                // Update status rumah 16-18 jadi dihuni (kontrak)
                if ($houseId > 15) {
                    House::find($houseId)->update(['status_hunian' => 'dihuni']);
                }
            }
        }

        // =============================================
        // 4. Sample Riwayat Penghuni (rumah 16 pernah ditempati orang lain)
        // =============================================
        HouseResident::create([
            'house_id'       => 16,
            'resident_id'    => 1, // Ahmad Fauzi pernah di rumah 16
            'tanggal_masuk'  => '2022-01-01',
            'tanggal_keluar' => '2023-12-31',
            'is_active'      => false,
        ]);

        // =============================================
        // 5. Sample Pembayaran Iuran (3 bulan terakhir)
        // =============================================
        $tahun = (int) date('Y');
        $bulanSekarang = (int) date('m');

        for ($bulan = max(1, $bulanSekarang - 2); $bulan <= $bulanSekarang; $bulan++) {
            // 15 penghuni tetap bayar satpam + kebersihan
            for ($i = 0; $i < 15; $i++) {
                $resident = $residents[$i];
                $houseId = $i + 1;

                // Iuran Satpam 100k
                Payment::create([
                    'resident_id'   => $resident->id,
                    'house_id'      => $houseId,
                    'jenis_iuran'   => 'satpam',
                    'jumlah'        => 100000,
                    'bulan'         => $bulan,
                    'tahun'         => $tahun,
                    'tanggal_bayar' => "$tahun-" . str_pad($bulan, 2, '0', STR_PAD_LEFT) . '-10',
                    'status'        => rand(0, 10) > 2 ? 'lunas' : 'belum_lunas', // 80% lunas
                    'periode'       => 'bulanan',
                ]);

                // Iuran Kebersihan 15k
                Payment::create([
                    'resident_id'   => $resident->id,
                    'house_id'      => $houseId,
                    'jenis_iuran'   => 'kebersihan',
                    'jumlah'        => 15000,
                    'bulan'         => $bulan,
                    'tahun'         => $tahun,
                    'tanggal_bayar' => "$tahun-" . str_pad($bulan, 2, '0', STR_PAD_LEFT) . '-10',
                    'status'        => rand(0, 10) > 1 ? 'lunas' : 'belum_lunas', // 90% lunas
                    'periode'       => 'bulanan',
                ]);
            }

            // 3 penghuni kontrak juga bayar
            for ($i = 15; $i < 18; $i++) {
                $resident = $residents[$i];
                $houseId = $i + 1;

                Payment::create([
                    'resident_id'   => $resident->id,
                    'house_id'      => $houseId,
                    'jenis_iuran'   => 'satpam',
                    'jumlah'        => 100000,
                    'bulan'         => $bulan,
                    'tahun'         => $tahun,
                    'tanggal_bayar' => "$tahun-" . str_pad($bulan, 2, '0', STR_PAD_LEFT) . '-15',
                    'status'        => 'lunas',
                    'periode'       => 'bulanan',
                ]);

                Payment::create([
                    'resident_id'   => $resident->id,
                    'house_id'      => $houseId,
                    'jenis_iuran'   => 'kebersihan',
                    'jumlah'        => 15000,
                    'bulan'         => $bulan,
                    'tahun'         => $tahun,
                    'tanggal_bayar' => "$tahun-" . str_pad($bulan, 2, '0', STR_PAD_LEFT) . '-15',
                    'status'        => 'lunas',
                    'periode'       => 'bulanan',
                ]);
            }
        }

        // =============================================
        // 6. Sample Pengeluaran
        // =============================================
        // Pengeluaran rutin bulanan
        for ($bulan = max(1, $bulanSekarang - 2); $bulan <= $bulanSekarang; $bulan++) {
            Expense::create([
                'kategori'     => 'gaji_satpam',
                'deskripsi'    => "Gaji satpam bulan $bulan",
                'jumlah'       => 2500000,
                'tanggal'      => "$tahun-" . str_pad($bulan, 2, '0', STR_PAD_LEFT) . '-01',
                'is_recurring' => true,
            ]);

            Expense::create([
                'kategori'     => 'token_listrik',
                'deskripsi'    => "Token listrik pos satpam bulan $bulan",
                'jumlah'       => 200000,
                'tanggal'      => "$tahun-" . str_pad($bulan, 2, '0', STR_PAD_LEFT) . '-05',
                'is_recurring' => true,
            ]);
        }

        // Pengeluaran tidak rutin
        Expense::create([
            'kategori'     => 'perbaikan_jalan',
            'deskripsi'    => 'Perbaikan jalan blok A depan rumah 5-8',
            'jumlah'       => 3500000,
            'tanggal'      => "$tahun-01-20",
            'is_recurring' => false,
        ]);

        Expense::create([
            'kategori'     => 'perbaikan_selokan',
            'deskripsi'    => 'Perbaikan selokan tersumbat blok A',
            'jumlah'       => 1500000,
            'tanggal'      => "$tahun-02-15",
            'is_recurring' => false,
        ]);
    }
}
