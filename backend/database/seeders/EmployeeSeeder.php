<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'first_name' => 'Alexander',
                'last_name'  => 'Wright',
                'email'      => 'alexander.wright@company.com',
                'phone'      => '+1 (555) 234-5678',
                'department' => 'Engineering',
                'position'   => 'Principal Software Architect',
                'salary'     => 145000.00,
                'hire_date'  => '2021-03-15',
                'status'     => 'active',
            ],
            [
                'first_name' => 'Elena',
                'last_name'  => 'Rostova',
                'email'      => 'elena.rostova@company.com',
                'phone'      => '+1 (555) 345-6789',
                'department' => 'Product',
                'position'   => 'Senior Product Manager',
                'salary'     => 128000.00,
                'hire_date'  => '2022-01-10',
                'status'     => 'active',
            ],
            [
                'first_name' => 'Marcus',
                'last_name'  => 'Chen',
                'email'      => 'marcus.chen@company.com',
                'phone'      => '+1 (555) 456-7890',
                'department' => 'Engineering',
                'position'   => 'Full Stack Engineer',
                'salary'     => 105000.00,
                'hire_date'  => '2023-06-01',
                'status'     => 'active',
            ],
            [
                'first_name' => 'Sophia',
                'last_name'  => 'Patel',
                'email'      => 'sophia.patel@company.com',
                'phone'      => '+1 (555) 567-8901',
                'department' => 'Marketing',
                'position'   => 'Marketing Director',
                'salary'     => 118000.00,
                'hire_date'  => '2020-09-20',
                'status'     => 'active',
            ],
            [
                'first_name' => 'David',
                'last_name'  => 'Kim',
                'email'      => 'david.kim@company.com',
                'phone'      => '+1 (555) 678-9012',
                'department' => 'Human Resources',
                'position'   => 'People Operations Lead',
                'salary'     => 92000.00,
                'hire_date'  => '2022-08-15',
                'status'     => 'active',
            ],
            [
                'first_name' => 'Amara',
                'last_name'  => 'Okafor',
                'email'      => 'amara.okafor@company.com',
                'phone'      => '+1 (555) 789-0123',
                'department' => 'Finance',
                'position'   => 'Senior Financial Analyst',
                'salary'     => 98000.00,
                'hire_date'  => '2021-11-05',
                'status'     => 'active',
            ],
            [
                'first_name' => 'Lucas',
                'last_name'  => 'Silva',
                'email'      => 'lucas.silva@company.com',
                'phone'      => '+1 (555) 890-1234',
                'department' => 'Design',
                'position'   => 'Lead UI/UX Designer',
                'salary'     => 112000.00,
                'hire_date'  => '2023-02-14',
                'status'     => 'on_leave',
            ],
            [
                'first_name' => 'Rachel',
                'last_name'  => 'Green',
                'email'      => 'rachel.green@company.com',
                'phone'      => '+1 (555) 901-2345',
                'department' => 'Sales',
                'position'   => 'Enterprise Account Executive',
                'salary'     => 115000.00,
                'hire_date'  => '2022-04-18',
                'status'     => 'active',
            ],
            [
                'first_name' => 'Tariq',
                'last_name'  => 'Al-Mansoor',
                'email'      => 'tariq.mansoor@company.com',
                'phone'      => '+1 (555) 012-3456',
                'department' => 'Operations',
                'position'   => 'DevOps & Cloud Engineer',
                'salary'     => 122000.00,
                'hire_date'  => '2023-09-01',
                'status'     => 'active',
            ],
            [
                'first_name' => 'Hannah',
                'last_name'  => 'Schmidt',
                'email'      => 'hannah.schmidt@company.com',
                'phone'      => '+1 (555) 123-7890',
                'department' => 'Customer Success',
                'position'   => 'Customer Success Manager',
                'salary'     => 85000.00,
                'hire_date'  => '2024-01-15',
                'status'     => 'active',
            ],
        ];

        foreach ($employees as $data) {
            Employee::updateOrCreate(['email' => $data['email']], $data);
        }
    }
}
