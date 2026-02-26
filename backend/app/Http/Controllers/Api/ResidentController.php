<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;
use App\Models\Resident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResidentController extends Controller
{
    /**
     * GET /api/residents
     * List semua penghuni
     */
    public function index(): JsonResponse
    {
        $residents = Resident::with(['houseResidents' => function ($q) {
            $q->where('is_active', true)->with('house');
        }])->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $residents,
        ]);
    }

    /**
     * POST /api/residents
     * Tambah penghuni baru
     */
    public function store(StoreResidentRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Upload foto KTP jika ada
        if ($request->hasFile('foto_ktp')) {
            $data['foto_ktp'] = $request->file('foto_ktp')
                ->store('ktp', 'public');
        }

        $resident = Resident::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Penghuni berhasil ditambahkan.',
            'data'    => $resident,
        ], 201);
    }

    /**
     * GET /api/residents/{id}
     * Detail penghuni
     */
    public function show(Resident $resident): JsonResponse
    {
        $resident->load([
            'houseResidents.house',
            'payments',
        ]);

        return response()->json([
            'success' => true,
            'data'    => $resident,
        ]);
    }

    /**
     * PUT /api/residents/{id}
     * Update penghuni
     */
    public function update(UpdateResidentRequest $request, Resident $resident): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('foto_ktp')) {
            // Hapus foto lama
            if ($resident->foto_ktp) {
                Storage::disk('public')->delete($resident->foto_ktp);
            }
            $data['foto_ktp'] = $request->file('foto_ktp')
                ->store('ktp', 'public');
        }

        $resident->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Data penghuni berhasil diperbarui.',
            'data'    => $resident->fresh(),
        ]);
    }

    /**
     * DELETE /api/residents/{id}
     * Hapus penghuni
     */
    public function destroy(Resident $resident): JsonResponse
    {
        if ($resident->foto_ktp) {
            Storage::disk('public')->delete($resident->foto_ktp);
        }

        $resident->delete();

        return response()->json([
            'success' => true,
            'message' => 'Penghuni berhasil dihapus.',
        ]);
    }
}
