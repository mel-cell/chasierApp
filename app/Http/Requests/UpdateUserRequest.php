<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'pin' => 'sometimes|digits:6',
            'role' => ['sometimes', Rule::in(['owner', 'kasir', 'inventoris'])],
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Nama terlalu panjang.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'pin.digits' => 'PIN harus 6 digit angka.',
            'role.in' => 'Role tidak valid.',
        ];
    }
}
