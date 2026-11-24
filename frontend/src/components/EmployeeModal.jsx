import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Design',
  'Operations',
  'Customer Success',
];

const INITIAL_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  department: 'Engineering',
  position: '',
  salary: '',
  hire_date: new Date().toISOString().split('T')[0],
  status: 'active',
};

export default function EmployeeModal({ isOpen, onClose, onSave, employee, isSubmitting, serverErrors }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [clientErrors, setClientErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || 'Engineering',
        position: employee.position || '',
        salary: employee.salary !== undefined ? employee.salary : '',
        hire_date: employee.hire_date || new Date().toISOString().split('T')[0],
        status: employee.status || 'active',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setClientErrors({});
    setTouched({});
  }, [employee, isOpen]);

  if (!isOpen) return null;

  // Validate single field or whole form
  const validateField = (name, value) => {
    let error = null;
    const trimmed = typeof value === 'string' ? value.trim() : value;

    switch (name) {
      case 'first_name':
        if (!trimmed) error = 'First name is required.';
        else if (trimmed.length < 2) error = 'First name must be at least 2 characters.';
        break;
      case 'last_name':
        if (!trimmed) error = 'Last name is required.';
        else if (trimmed.length < 2) error = 'Last name must be at least 2 characters.';
        break;
      case 'email':
        if (!trimmed) error = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) error = 'Please enter a valid email address.';
        break;
      case 'phone':
        if (trimmed && !/^[+0-9\s\-().]{7,25}$/.test(trimmed)) {
          error = 'Invalid phone number format.';
        }
        break;
      case 'department':
        if (!trimmed) error = 'Department is required.';
        break;
      case 'position':
        if (!trimmed) error = 'Position is required.';
        else if (trimmed.length < 2) error = 'Position must be at least 2 characters.';
        break;
      case 'salary':
        if (value === '' || value === null || value === undefined) error = 'Salary is required.';
        else if (isNaN(Number(value)) || Number(value) < 0) error = 'Salary must be a positive number.';
        break;
      case 'hire_date':
        if (!value) error = 'Hire date is required.';
        break;
      case 'status':
        if (!['active', 'on_leave', 'terminated'].includes(value)) error = 'Invalid status selected.';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name, value);
      setClientErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setClientErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setClientErrors(newErrors);
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      department: true,
      position: true,
      salary: true,
      hire_date: true,
      status: true,
    });

    if (Object.keys(newErrors).length === 0) {
      onSave({
        ...formData,
        salary: Number(formData.salary),
      });
    }
  };

  // Combine client and server errors
  const getFieldError = (fieldName) => {
    if (clientErrors[fieldName]) return clientErrors[fieldName];
    if (serverErrors && serverErrors[fieldName]) {
      return Array.isArray(serverErrors[fieldName]) ? serverErrors[fieldName][0] : serverErrors[fieldName];
    }
    return null;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              {/* First Name */}
              <div className="form-group">
                <label className="form-label">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Jane"
                  className={`form-input ${getFieldError('first_name') ? 'error' : ''}`}
                />
                {getFieldError('first_name') && (
                  <span className="error-text">{getFieldError('first_name')}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label className="form-label">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Doe"
                  className={`form-input ${getFieldError('last_name') ? 'error' : ''}`}
                />
                {getFieldError('last_name') && (
                  <span className="error-text">{getFieldError('last_name')}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group col-span-2">
                <label className="form-label">
                  Work Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="jane.doe@company.com"
                  className={`form-input ${getFieldError('email') ? 'error' : ''}`}
                />
                {getFieldError('email') && (
                  <span className="error-text">{getFieldError('email')}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+1 (555) 012-3456"
                  className={`form-input ${getFieldError('phone') ? 'error' : ''}`}
                />
                {getFieldError('phone') && (
                  <span className="error-text">{getFieldError('phone')}</span>
                )}
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">
                  Department <span className="required">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-select ${getFieldError('department') ? 'error' : ''}`}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {getFieldError('department') && (
                  <span className="error-text">{getFieldError('department')}</span>
                )}
              </div>

              {/* Position */}
              <div className="form-group">
                <label className="form-label">
                  Job Title / Position <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Senior Software Engineer"
                  className={`form-input ${getFieldError('position') ? 'error' : ''}`}
                />
                {getFieldError('position') && (
                  <span className="error-text">{getFieldError('position')}</span>
                )}
              </div>

              {/* Salary */}
              <div className="form-group">
                <label className="form-label">
                  Annual Salary ($ USD) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 95000"
                  className={`form-input ${getFieldError('salary') ? 'error' : ''}`}
                />
                {getFieldError('salary') && (
                  <span className="error-text">{getFieldError('salary')}</span>
                )}
              </div>

              {/* Hire Date */}
              <div className="form-group">
                <label className="form-label">
                  Hire Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${getFieldError('hire_date') ? 'error' : ''}`}
                />
                {getFieldError('hire_date') && (
                  <span className="error-text">{getFieldError('hire_date')}</span>
                )}
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">
                  Employment Status <span className="required">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-select ${getFieldError('status') ? 'error' : ''}`}
                >
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                </select>
                {getFieldError('status') && (
                  <span className="error-text">{getFieldError('status')}</span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {employee ? 'Update Employee' : 'Create Employee'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
