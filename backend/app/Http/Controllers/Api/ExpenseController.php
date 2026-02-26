<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * GET /api/expenses
     * List pengeluaran, bisa filter by bulan & tahun
     */
    public function index(Request $request): JsonResponse
    {
        $query = Expense::query();

        if ($request->has('bulan') && $request->has('tahun')) {
            $query->forMonth($request->bulan, $request->tahun);
        } elseif ($request->has('tahun')) {
            $query->whereYear('tanggal', $request->tahun);
        }

        $expenses = $query->latest('tanggal')->get();

        return response()->json([
            'success' => true,
            'data'    => $expenses,
        ]);
    }

    /**
     * POST /api/expenses
     * Tambah pengeluaran
     */
    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = Expense::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran berhasil dicatat.',
            'data'    => $expense,
        ], 201);
    }

    /**
     * PUT /api/expenses/{id}
     * Update pengeluaran
     */
    public function update(Request $request, Expense $expense): JsonResponse
    {
        $data = $request->validate([
            'kategori'     => ['sometimes', 'string', 'max:255'],
            'deskripsi'    => ['sometimes', 'string', 'max:500'],
            'jumlah'       => ['sometimes', 'numeric', 'min:0'],
            'tanggal'      => ['sometimes', 'date'],
            'is_recurring' => ['sometimes', 'boolean'],
        ]);

        $expense->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran berhasil diperbarui.',
            'data'    => $expense->fresh(),
        ]);
    }

    /**
     * DELETE /api/expenses/{id}
     * Hapus pengeluaran
     */
    public function destroy(Expense $expense): JsonResponse
    {
        $expense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran berhasil dihapus.',
        ]);
    }
}
