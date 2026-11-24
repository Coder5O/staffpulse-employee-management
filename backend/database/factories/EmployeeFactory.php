<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Design', 'Operations'];

        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'department' => fake()->randomElement($departments),
            'position' => fake()->jobTitle(),
            'salary' => fake()->randomFloat(2, 45000, 160000),
            'hire_date' => fake()->dateTimeBetween('-4 years', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['active', 'active', 'active', 'on_leave', 'terminated']),
        ];
    }
}
