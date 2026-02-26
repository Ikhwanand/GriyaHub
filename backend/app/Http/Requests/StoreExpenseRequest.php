<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kategori'     => ['required', 'string', 'max:255'],
            'deskripsi'    => ['required', 'string', 'max:500'],
            'jumlah'       => ['required', 'numeric', 'min:0'],
            'tanggal'      => ['required', 'date'],
            'is_recurring' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'kategori.required'  => 'Kategori pengeluaran wajib diisi.',
            'deskripsi.required' => 'Deskripsi pengeluaran wajib diisi.',
            'jumlah.required'    => 'Jumlah pengeluaran wajib diisi.',
            'tanggal.required'   => 'Tanggal pengeluaran wajib diisi.',
        ];
    }
}
