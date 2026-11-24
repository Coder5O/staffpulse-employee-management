import React from 'react';
import { X, Mail, Phone, Briefcase, Calendar, DollarSign, Building2, Clock, Edit2 } from 'lucide-react';

export default function EmployeeDetailsModal({ isOpen, onClose, employee, onEdit }) {
  if (!isOpen || !employee) return null;

  const initials = `${employee.first_name?.[0] || ''}${employee.last_name?.[0] || ''}`.toUpperCase();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-active">● Active</span>;
      case 'on_leave':
        return <span className="badge badge-on_leave">● On Leave</span>;
      case 'terminated':
        return <span className="badge badge-terminated">● Terminated</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Employee Profile</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div
              className="avatar-circle"
              style={{ width: 64, height: 64, fontSize: '1.25rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  {employee.full_name || `${employee.first_name} ${employee.last_name}`}
                </h3>
                {getStatusBadge(employee.status)}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9375rem', fontWeight: 500 }}>
                {employee.position}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              background: '#0f172a',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid #334155',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                <Building2 size={14} /> Department
              </div>
              <span className="dept-pill" style={{ fontSize: '0.875rem' }}>
                {employee.department}
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                <DollarSign size={14} /> Compensation
              </div>
              <div style={{ color: '#34d399', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
                {employee.salary_formatted || `$${Number(employee.salary || 0).toLocaleString()}`}
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}> / year</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                <Mail size={14} /> Email Address
              </div>
              <a
                href={`mailto:${employee.email}`}
                style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.875rem', wordBreak: 'break-all' }}
              >
                {employee.email}
              </a>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                <Phone size={14} /> Phone Number
              </div>
              {employee.phone ? (
                <a
                  href={`tel:${employee.phone}`}
                  style={{ color: '#f8fafc', textDecoration: 'none', fontSize: '0.875rem' }}
                >
                  {employee.phone}
                </a>
              ) : (
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Not provided</span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                <Calendar size={14} /> Hire Date
              </div>
              <div style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>
                {formatDate(employee.hire_date)}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                <Clock size={14} /> System ID
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                EMP-{String(employee.id).padStart(4, '0')}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
          >
            <Edit2 size={16} /> Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
}
