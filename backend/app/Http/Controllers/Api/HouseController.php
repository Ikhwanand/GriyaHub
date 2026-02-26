<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHouseRequest;
use App\Models\House;
use App\Models\HouseResident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HouseController extends Controller
{
    /**
     * GET /api/houses
     * List semua rumah
     */
    public function index(): JsonResponse
    {
        $houses = House::with(['houseResidents' => function ($q) {
            $q->where('is_active', true)->with('resident');
        }])->get();

        return response()->json([
            'success' => true,
            'data'    => $houses,
        ]);
    }

    /**
     * POST /api/houses
     * Tambah rumah baru
     */
    public function store(StoreHouseRequest $request): JsonResponse
    {
        $house = House::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Rumah berhasil ditambahkan.',
            'data'    => $house,
        ], 201);
    }

    /**
     * GET /api/houses/{id}
     * Detail rumah + riwayat penghuni + riwayat pembayaran
     */
    public function show(House $house): JsonResponse
    {
        $house->load([
            'houseResidents.resident',   // Semua riwayat penghuni
            'payments.resident',         // Riwayat pembayaran
        ]);

        return response()->json([
            'success' => true,
            'data'    => $house,
        ]);
    }

    /**
     * PUT /api/houses/{id}
     * Update data rumah
     */
    public function update(Request $request, House $house): JsonResponse
    {
        $data = $request->validate([
            'nomor_rumah'   => ['sometimes', 'string', 'max:50', 'unique:houses,nomor_rumah,' . $house->id],
            'alamat'        => ['nullable', 'string', 'max:500'],
            'status_hunian' => ['sometimes', 'in:dihuni,tidak_dihuni'],
        ]);

        $house->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Data rumah berhasil diperbarui.',
            'data'    => $house->fresh(),
        ]);
    }

    /**
     * POST /api/houses/{house}/assign
     * Assign penghuni ke rumah
     */
    public function assignResident(Request $request, House $house): JsonResponse
    {
        $data = $request->validate([
            'resident_id'   => ['required', 'exists:residents,id'],
            'tanggal_masuk' => ['required', 'date'],
        ]);

        // Cek apakah penghuni sudah aktif di rumah lain
        $existingActive = HouseResident::where('resident_id', $data['resident_id'])
            ->where('is_active', true)
            ->first();

        if ($existingActive) {
            return response()->json([
                'success' => false,
                'message' => 'Penghuni masih aktif di rumah lain. Keluarkan dulu dari rumah sebelumnya.',
            ], 422);
        }

        // Buat record baru
        HouseResident::create([
            'house_id'      => $house->id,
            'resident_id'   => $data['resident_id'],
            'tanggal_masuk' => $data['tanggal_masuk'],
            'is_active'     => true,
        ]);

        // Update status rumah
        $house->update(['status_hunian' => 'dihuni']);

        return response()->json([
            'success' => true,
            'message' => 'Penghuni berhasil ditambahkan ke rumah.',
        ]);
    }

    /**
     * PUT /api/houses/{house}/unassign
     * Keluarkan penghuni dari rumah
     */
    public function unassignResident(Request $request, House $house): JsonResponse
    {
        $data = $request->validate([
            'resident_id'    => ['required', 'exists:residents,id'],
            'tanggal_keluar' => ['required', 'date'],
        ]);

        $houseResident = HouseResident::where('house_id', $house->id)
            ->where('resident_id', $data['resident_id'])
            ->where('is_active', true)
            ->first();

        if (!$houseResident) {
            return response()->json([
                'success' => false,
                'message' => 'Penghuni tidak ditemukan di rumah ini.',
            ], 404);
        }

        $houseResident->update([
            'tanggal_keluar' => $data['tanggal_keluar'],
            'is_active'      => false,
        ]);

        // Cek apakah masih ada penghuni aktif
        $activeCount = HouseResident::where('house_id', $house->id)
            ->where('is_active', true)
            ->count();

        if ($activeCount === 0) {
            $house->update(['status_hunian' => 'tidak_dihuni']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Penghuni berhasil dikeluarkan dari rumah.',
        ]);
    }
}
