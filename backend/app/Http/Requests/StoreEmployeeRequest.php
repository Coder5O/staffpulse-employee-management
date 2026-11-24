<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name'  => ['required', 'string', 'min:2', 'max:100'],
            'last_name'   => ['required', 'string', 'min:2', 'max:100'],
            'email'       => ['required', 'string', 'email', 'max:150', 'unique:employees,email'],
            'phone'       => ['nullable', 'string', 'max:50', 'regex:/^[+0-9\s\-().]{7,25}$/'],
            'department'  => ['required', 'string', 'min:2', 'max:100'],
            'position'    => ['required', 'string', 'min:2', 'max:100'],
            'salary'      => ['required', 'numeric', 'min:0', 'max:999999999.99'],
            'hire_date'   => ['required', 'date'],
            'status'      => ['required', 'string', 'in:active,on_leave,terminated'],
        ];
    }

    /**
     * Custom message for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'The first name is required.',
            'first_name.min'      => 'The first name must be at least 2 characters.',
            'last_name.required'  => 'The last name is required.',
            'last_name.min'       => 'The last name must be at least 2 characters.',
            'email.required'      => 'An email address is required.',
            'email.email'         => 'Please provide a valid email address.',
            'email.unique'        => 'An employee with this email already exists.',
            'phone.regex'         => 'The phone number format is invalid.',
            'department.required' => 'Please select or provide a department.',
            'position.required'   => 'The job position/title is required.',
            'salary.required'     => 'The salary is required.',
            'salary.numeric'      => 'The salary must be a valid number.',
            'salary.min'          => 'The salary cannot be negative.',
            'hire_date.required'  => 'The hire date is required.',
            'hire_date.date'      => 'Please provide a valid date format.',
            'status.in'           => 'Status must be active, on_leave, or terminated.',
        ];
    }
}
