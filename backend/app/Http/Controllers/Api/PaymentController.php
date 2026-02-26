<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * GET /api/payments
     * List pembayaran, bisa filter by tahun, bulan, status, jenis_iuran
     */
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with(['resident', 'house']);

        if ($request->has('tahun')) {
            $query->where('tahun', $request->tahun);
        }
        if ($request->has('bulan')) {
            $query->where('bulan', $request->bulan);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('jenis_iuran')) {
            $query->where('jenis_iuran', $request->jenis_iuran);
        }

        $payments = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $payments,
        ]);
    }

    /**
     * POST /api/payments
     * Tambah pembayaran iuran
     */
    public function store(StorePaymentRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Jika tahunan (biasanya satpam), set jumlah x 12
        if (isset($data['periode']) && $data['periode'] === 'tahunan') {
            // Buat 12 record untuk setiap bulan
            $payments = [];
            for ($i = 1; $i <= 12; $i++) {
                $payments[] = Payment::create(array_merge($data, [
                    'bulan'  => $i,
                    'status' => 'lunas',
                ]));
            }

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran tahunan berhasil dicatat untuk 12 bulan.',
                'data'    => $payments,
            ], 201);
        }

        $payment = Payment::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran iuran berhasil dicatat.',
            'data'    => $payment,
        ], 201);
    }

    /**
     * PUT /api/payments/{id}
     * Update status pembayaran (lunas / belum_lunas)
     */
    public function update(Request $request, Payment $payment): JsonResponse
    {
        $data = $request->validate([
            'status'        => ['sometimes', 'in:lunas,belum_lunas'],
            'tanggal_bayar' => ['nullable', 'date'],
            'jumlah'        => ['sometimes', 'numeric', 'min:0'],
        ]);

        $payment->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil diperbarui.',
            'data'    => $payment->fresh(),
        ]);
    }
}
