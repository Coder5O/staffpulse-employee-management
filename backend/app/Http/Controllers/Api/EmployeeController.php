<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the employees with search, filter, and pagination.
     */
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        $query = Employee::query()
            ->search($request->query('search'))
            ->department($request->query('department'))
            ->status($request->query('status'));

        // Sorting
        $allowedSorts = ['id', 'first_name', 'last_name', 'email', 'department', 'position', 'salary', 'hire_date', 'status', 'created_at'];
        $sortBy = in_array($request->query('sort_by'), $allowedSorts, true) ? $request->query('sort_by') : 'id';
        $sortDirection = strtolower($request->query('sort_direction', 'desc')) === 'asc' ? 'asc' : 'desc';

        $query->orderBy($sortBy, $sortDirection);

        // Optional non-paginated fetch for exports/selects
        if ($request->boolean('all')) {
            return EmployeeResource::collection($query->get());
        }

        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);
        $employees = $query->paginate($perPage)->withQueryString();

        return EmployeeResource::collection($employees);
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $employee = Employee::create($request->validated());

        return (new EmployeeResource($employee))
            ->additional([
                'message' => 'Employee created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee): EmployeeResource
    {
        return new EmployeeResource($employee);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee): JsonResponse
    {
        $employee->update($request->validated());

        return (new EmployeeResource($employee))
            ->additional([
                'message' => 'Employee updated successfully.',
            ])
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Remove the specified employee from storage.
     */
    public function destroy(Employee $employee): JsonResponse
    {
        $employeeName = $employee->full_name;
        $employee->delete();

        return response()->json([
            'message' => "Employee '{$employeeName}' was successfully deleted.",
            'id' => $employee->id,
        ], 200);
    }

    /**
     * Get aggregate statistics for dashboard summary.
     */
    public function stats(): JsonResponse
    {
        $total = Employee::count();
        $active = Employee::where('status', 'active')->count();
        $onLeave = Employee::where('status', 'on_leave')->count();
        $terminated = Employee::where('status', 'terminated')->count();
        $avgSalary = (float) (Employee::avg('salary') ?? 0);

        $departmentBreakdown = Employee::selectRaw('department, count(*) as count')
            ->groupBy('department')
            ->pluck('count', 'department');

        return response()->json([
            'total' => $total,
            'active' => $active,
            'on_leave' => $onLeave,
            'terminated' => $terminated,
            'average_salary' => round($avgSalary, 2),
            'average_salary_formatted' => '$' . number_format($avgSalary, 2),
            'department_counts' => $departmentBreakdown,
        ]);
    }
}
