<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_lengkap'    => ['sometimes', 'string', 'max:255'],
            'foto_ktp'        => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'status_penghuni' => ['sometimes', 'in:kontrak,tetap'],
            'nomor_telepon'   => ['sometimes', 'string', 'max:20'],
            'sudah_menikah'   => ['sometimes', 'boolean'],
        ];
    }
}
