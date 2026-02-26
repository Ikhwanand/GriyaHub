<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_lengkap'    => ['required', 'string', 'max:255'],
            'foto_ktp'        => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'status_penghuni' => ['required', 'in:kontrak,tetap'],
            'nomor_telepon'   => ['required', 'string', 'max:20'],
            'sudah_menikah'   => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_lengkap.required'    => 'Nama lengkap wajib diisi.',
            'foto_ktp.image'           => 'Foto KTP harus berupa gambar.',
            'foto_ktp.max'             => 'Ukuran foto KTP maksimal 2MB.',
            'status_penghuni.required' => 'Status penghuni wajib dipilih.',
            'status_penghuni.in'       => 'Status penghuni harus kontrak atau tetap.',
            'nomor_telepon.required'   => 'Nomor telepon wajib diisi.',
        ];
    }
}
