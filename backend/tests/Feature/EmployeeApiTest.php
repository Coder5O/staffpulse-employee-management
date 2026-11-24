<?php

namespace Tests\Feature;

use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_employees(): void
    {
        Employee::factory()->count(5)->create();

        $response = $this->getJson('/api/employees');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'first_name', 'last_name', 'email', 'department', 'position', 'salary', 'status']
                     ],
                     'links',
                     'meta',
                 ]);
    }

    public function test_can_get_stats(): void
    {
        Employee::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@test.com',
            'department' => 'Engineering',
            'position' => 'Developer',
            'salary' => 80000,
            'hire_date' => '2023-01-01',
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/stats');

        $response->assertStatus(200)
                 ->assertJson([
                     'total' => 1,
                     'active' => 1,
                     'average_salary' => 80000.0,
                 ]);
    }

    public function test_can_create_employee_with_valid_data(): void
    {
        $payload = [
            'first_name' => 'Sarah',
            'last_name' => 'Connor',
            'email' => 'sarah.connor@example.com',
            'phone' => '+1 (555) 000-1111',
            'department' => 'Engineering',
            'position' => 'Security Engineer',
            'salary' => 110000,
            'hire_date' => '2023-05-10',
            'status' => 'active',
        ];

        $response = $this->postJson('/api/employees', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('data.first_name', 'Sarah')
                 ->assertJsonPath('data.email', 'sarah.connor@example.com');

        $this->assertDatabaseHas('employees', [
            'email' => 'sarah.connor@example.com',
        ]);
    }

    public function test_validation_fails_when_required_fields_missing(): void
    {
        $response = $this->postJson('/api/employees', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'department', 'position', 'salary', 'hire_date', 'status']);
    }

    public function test_validation_fails_on_duplicate_email(): void
    {
        Employee::create([
            'first_name' => 'Existing',
            'last_name' => 'User',
            'email' => 'unique@example.com',
            'department' => 'HR',
            'position' => 'Generalist',
            'salary' => 60000,
            'hire_date' => '2022-01-01',
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/employees', [
            'first_name' => 'Another',
            'last_name' => 'User',
            'email' => 'unique@example.com',
            'department' => 'Sales',
            'position' => 'Rep',
            'salary' => 50000,
            'hire_date' => '2022-02-01',
            'status' => 'active',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_can_update_employee(): void
    {
        $employee = Employee::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane.smith@example.com',
            'department' => 'Marketing',
            'position' => 'Coordinator',
            'salary' => 65000,
            'hire_date' => '2022-05-01',
            'status' => 'active',
        ]);

        $response = $this->putJson("/api/employees/{$employee->id}", [
            'position' => 'Marketing Lead',
            'salary' => 85000,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.position', 'Marketing Lead')
                 ->assertJsonPath('data.salary', 85000);

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'position' => 'Marketing Lead',
        ]);
    }

    public function test_can_delete_employee(): void
    {
        $employee = Employee::create([
            'first_name' => 'To',
            'last_name' => 'Delete',
            'email' => 'delete.me@example.com',
            'department' => 'Finance',
            'position' => 'Clerk',
            'salary' => 45000,
            'hire_date' => '2023-01-01',
            'status' => 'active',
        ]);

        $response = $this->deleteJson("/api/employees/{$employee->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('employees', [
            'id' => $employee->id,
        ]);
    }
}
