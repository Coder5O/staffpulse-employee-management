import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { employeeService } from './services/api';
import StatsCards from './components/StatsCards';
import EmployeeModal from './components/EmployeeModal';
import EmployeeDetailsModal from './components/EmployeeDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';

export default function App() {
  // State
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Load stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await employeeService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load employees list
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        department: department !== 'all' ? department : undefined,
        status: status !== 'all' ? status : undefined,
        sort_by: sortBy,
        sort_direction: sortDirection,
        page: currentPage,
        per_page: 8,
      };

      const response = await employeeService.getEmployees(params);
      setEmployees(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      console.error('Failed to load employees:', err);
      showToast('Failed to connect to the backend API. Please make sure the server is running.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, department, status, sortBy, sortDirection, currentPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle sort column click
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Status badges
  const renderStatusBadge = (st) => {
    switch (st) {
      case 'active':
        return <span className="badge badge-active">● Active</span>;
      case 'on_leave':
        return <span className="badge badge-on_leave">● On Leave</span>;
      case 'terminated':
        return <span className="badge badge-terminated">● Terminated</span>;
      default:
        return <span className="badge">{st}</span>;
    }
  };

  // Create or Update submit
  const handleSaveEmployee = async (formData) => {
    try {
      setIsSubmitting(true);
      setServerErrors(null);

      if (editingEmployee) {
        const response = await employeeService.updateEmployee(editingEmployee.id, formData);
        showToast(response.message || 'Employee updated successfully.');
      } else {
        const response = await employeeService.createEmployee(formData);
        showToast(response.message || 'Employee created successfully.');
      }

      setIsFormModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
      fetchStats();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setServerErrors(err.response.data.errors || {});
        showToast(err.response.data.message || 'Validation failed. Please review the highlighted fields.', 'error');
      } else {
        showToast(err.response?.data?.message || 'An error occurred while saving employee.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete confirm submit
  const handleDeleteConfirm = async (id) => {
    try {
      setIsDeleting(true);
      const response = await employeeService.deleteEmployee(id);
      showToast(response.message || 'Employee record deleted.');
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete employee.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Toast alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">
            <Users size={26} />
          </div>
          <div>
            <h1 className="brand-title">StaffPulse</h1>
            <p className="brand-subtitle">Employee & People Management Portal</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              fetchEmployees();
              fetchStats();
            }}
            title="Refresh records"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingEmployee(null);
              setServerErrors(null);
              setIsFormModalOpen(true);
            }}
          >
            <UserPlus size={18} /> Add Employee
          </button>
        </div>
      </header>

      {/* Stats Summary Cards */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Main Table Card */}
      <div className="content-card">
        {/* Search & Filter Toolbar */}
        <div className="controls-bar">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, role, email, or department..."
              className="input-search"
            />
          </div>

          <div className="filter-group">
            {/* Department Filter */}
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="select-filter"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Design">Design</option>
              <option value="Operations">Operations</option>
              <option value="Customer Success">Customer Success</option>
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="select-filter"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th
                  className="sortable"
                  onClick={() => handleSort('first_name')}
                  style={{ width: '28%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Employee
                    {sortBy === 'first_name' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} style={{ opacity: 0.4 }} />
                    )}
                  </div>
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSort('department')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Department
                    {sortBy === 'department' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} style={{ opacity: 0.4 }} />
                    )}
                  </div>
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSort('position')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Position
                    {sortBy === 'position' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} style={{ opacity: 0.4 }} />
                    )}
                  </div>
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSort('salary')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Salary
                    {sortBy === 'salary' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} style={{ opacity: 0.4 }} />
                    )}
                  </div>
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSort('hire_date')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Hire Date
                    {sortBy === 'hire_date' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} style={{ opacity: 0.4 }} />
                    )}
                  </div>
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSort('status')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Status
                    {sortBy === 'status' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <ArrowUpDown size={14} style={{ opacity: 0.4 }} />
                    )}
                  </div>
                </th>
                <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="spinner" />
                      <span style={{ color: '#94a3b8' }}>Loading employees...</span>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon">
                        <FolderOpen size={28} />
                      </div>
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          No employees found
                        </h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                          {search || department !== 'all' || status !== 'all'
                            ? 'Try adjusting your search query or filters to find what you are looking for.'
                            : 'Get started by creating your first employee record.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          setSearch('');
                          setDepartment('all');
                          setStatus('all');
                          setIsFormModalOpen(true);
                        }}
                      >
                        <UserPlus size={16} /> Add Employee
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const initials = `${emp.first_name?.[0] || ''}${emp.last_name?.[0] || ''}`.toUpperCase();
                  return (
                    <tr key={emp.id}>
                      {/* Name & Avatar */}
                      <td>
                        <div className="employee-name-cell">
                          <div className="avatar-circle">{initials}</div>
                          <div>
                            <div className="employee-title">{emp.full_name}</div>
                            <div className="employee-email">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td>
                        <span className="dept-pill">{emp.department}</span>
                      </td>

                      {/* Position */}
                      <td style={{ color: '#e2e8f0', fontWeight: 500 }}>
                        {emp.position}
                      </td>

                      {/* Salary */}
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                        {emp.salary_formatted || `$${Number(emp.salary).toLocaleString()}`}
                      </td>

                      {/* Hire Date */}
                      <td style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                        {emp.hire_date}
                      </td>

                      {/* Status */}
                      <td>{renderStatusBadge(emp.status)}</td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setIsDetailsModalOpen(true);
                            }}
                            title="View employee profile"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon edit"
                            onClick={() => {
                              setEditingEmployee(emp);
                              setServerErrors(null);
                              setIsFormModalOpen(true);
                            }}
                            title="Edit employee"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon delete"
                            onClick={() => {
                              setEmployeeToDelete(emp);
                              setIsDeleteModalOpen(true);
                            }}
                            title="Delete employee"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {meta && meta.last_page > 1 && (
          <div className="pagination-bar">
            <div className="pagination-info">
              Showing <strong>{meta.from || 0}</strong> to <strong>{meta.to || 0}</strong> of{' '}
              <strong>{meta.total}</strong> employees
            </div>

            <div className="pagination-nav">
              <button
                type="button"
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </button>
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                className="page-btn"
                disabled={currentPage === meta.last_page}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, meta.last_page))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EmployeeModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEmployee(null);
          setServerErrors(null);
        }}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
        isSubmitting={isSubmitting}
        serverErrors={serverErrors}
      />

      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setServerErrors(null);
          setIsFormModalOpen(true);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        employee={employeeToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
