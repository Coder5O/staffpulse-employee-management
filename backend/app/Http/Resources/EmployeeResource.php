<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'first_name'  => $this->first_name,
            'last_name'   => $this->last_name,
            'full_name'   => $this->full_name,
            'email'       => $this->email,
            'phone'       => $this->phone,
            'department'  => $this->department,
            'position'    => $this->position,
            'salary'      => (float) $this->salary,
            'salary_formatted' => '$' . number_format((float) $this->salary, 2),
            'hire_date'   => optional($this->hire_date)->format('Y-m-d') ?? (string) $this->hire_date,
            'status'      => $this->status,
            'created_at'  => optional($this->created_at)->toIso8601String(),
            'updated_at'  => optional($this->updated_at)->toIso8601String(),
        ];
    }
}
