<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\House;
use App\Models\Payment;
use App\Models\Resident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard/summary
     * Summary cards: total rumah, penghuni, pemasukan bulan ini, pengeluaran bulan ini, saldo
     */
    public function summary(): JsonResponse
    {
        $bulanIni = now()->month;
        $tahunIni = now()->year;

        $totalRumah     = House::count();
        $rumahDihuni    = House::where('status_hunian', 'dihuni')->count();
        $totalPenghuni  = Resident::count();

        $pemasukanBulanIni = Payment::where('status', 'lunas')
            ->where('bulan', $bulanIni)
            ->where('tahun', $tahunIni)
            ->sum('jumlah');

        $pengeluaranBulanIni = Expense::forMonth($bulanIni, $tahunIni)->sum('jumlah');

        $saldo = $pemasukanBulanIni - $pengeluaranBulanIni;

        return response()->json([
            'success' => true,
            'data'    => [
                'total_rumah'          => $totalRumah,
                'rumah_dihuni'         => $rumahDihuni,
                'rumah_kosong'         => $totalRumah - $rumahDihuni,
                'total_penghuni'       => $totalPenghuni,
                'pemasukan_bulan_ini'  => (float) $pemasukanBulanIni,
                'pengeluaran_bulan_ini' => (float) $pengeluaranBulanIni,
                'saldo'                => (float) $saldo,
            ],
        ]);
    }

    /**
     * GET /api/dashboard/chart?tahun=2024
     * Grafik pemasukan & pengeluaran per bulan selama 1 tahun
     */
    public function chart(Request $request): JsonResponse
    {
        $tahun = $request->get('tahun', now()->year);

        $chartData = [];

        for ($bulan = 1; $bulan <= 12; $bulan++) {
            $pemasukan = Payment::where('status', 'lunas')
                ->where('bulan', $bulan)
                ->where('tahun', $tahun)
                ->sum('jumlah');

            $pengeluaran = Expense::forMonth($bulan, $tahun)->sum('jumlah');

            $chartData[] = [
                'bulan'       => $bulan,
                'nama_bulan'  => $this->getNamaBulan($bulan),
                'pemasukan'   => (float) $pemasukan,
                'pengeluaran' => (float) $pengeluaran,
                'saldo'       => (float) ($pemasukan - $pengeluaran),
            ];
        }

        return response()->json([
            'success' => true,
            'data'    => $chartData,
        ]);
    }

    /**
     * GET /api/reports/monthly/{tahun}/{bulan}
     * Detail report per bulan: pemasukan detail + pengeluaran detail
     */
    public function monthlyReport(int $tahun, int $bulan): JsonResponse
    {
        $payments = Payment::with(['resident', 'house'])
            ->where('bulan', $bulan)
            ->where('tahun', $tahun)
            ->get();

        $expenses = Expense::forMonth($bulan, $tahun)->get();

        $totalPemasukan   = $payments->where('status', 'lunas')->sum('jumlah');
        $totalPengeluaran = $expenses->sum('jumlah');

        return response()->json([
            'success' => true,
            'data'    => [
                'bulan'             => $bulan,
                'tahun'             => $tahun,
                'nama_bulan'        => $this->getNamaBulan($bulan),
                'payments'          => $payments,
                'expenses'          => $expenses,
                'total_pemasukan'   => (float) $totalPemasukan,
                'total_pengeluaran' => (float) $totalPengeluaran,
                'saldo'             => (float) ($totalPemasukan - $totalPengeluaran),
            ],
        ]);
    }

    private function getNamaBulan(int $bulan): string
    {
        $nama = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret',
            4 => 'April', 5 => 'Mei', 6 => 'Juni',
            7 => 'Juli', 8 => 'Agustus', 9 => 'September',
            10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        return $nama[$bulan] ?? '';
    }
}
