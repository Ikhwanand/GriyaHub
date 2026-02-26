<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id'   => ['required', 'exists:residents,id'],
            'house_id'      => ['required', 'exists:houses,id'],
            'jenis_iuran'   => ['required', 'in:satpam,kebersihan'],
            'jumlah'        => ['required', 'numeric', 'min:0'],
            'bulan'         => ['required', 'integer', 'min:1', 'max:12'],
            'tahun'         => ['required', 'integer', 'min:2020', 'max:2099'],
            'tanggal_bayar' => ['nullable', 'date'],
            'status'        => ['required', 'in:lunas,belum_lunas'],
            'periode'       => ['sometimes', 'in:bulanan,tahunan'],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Penghuni wajib dipilih.',
            'resident_id.exists'   => 'Penghuni tidak ditemukan.',
            'house_id.required'    => 'Rumah wajib dipilih.',
            'house_id.exists'      => 'Rumah tidak ditemukan.',
            'jenis_iuran.required' => 'Jenis iuran wajib dipilih.',
            'jumlah.required'      => 'Jumlah pembayaran wajib diisi.',
        ];
    }
}
