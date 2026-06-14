<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'pin' => 'required|digits:6',
            'role' => ['required', Rule::in(['owner', 'kasir', 'inventoris'])],
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama user wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.unique' => 'Email sudah digunakan.',
            'pin.required' => 'PIN wajib diisi.',
            'pin.digits' => 'PIN harus 6 digit angka.',
            'role.required' => 'Role wajib dipilih.',
            'role.in' => 'Role tidak valid.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
        ]);
    }
}
