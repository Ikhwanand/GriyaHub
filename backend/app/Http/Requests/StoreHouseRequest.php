<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomor_rumah'   => ['required', 'string', 'max:50', 'unique:houses,nomor_rumah'],
            'alamat'        => ['nullable', 'string', 'max:500'],
            'status_hunian' => ['sometimes', 'in:dihuni,tidak_dihuni'],
        ];
    }

    public function messages(): array
    {
        return [
            'nomor_rumah.required' => 'Nomor rumah wajib diisi.',
            'nomor_rumah.unique'   => 'Nomor rumah sudah terdaftar.',
        ];
    }
}
