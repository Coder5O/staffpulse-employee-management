import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, employee, isDeleting }) {
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: '#f87171', display: 'flex', alignItems: 'center' }}>
              <AlertTriangle size={22} />
            </div>
            <h2 className="modal-title" style={{ fontSize: '1.125rem' }}>
              Confirm Deletion
            </h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: '#fff' }}>
              {employee.full_name || `${employee.first_name} ${employee.last_name}`}
            </strong>{' '}
            from <span className="dept-pill">{employee.department}</span>?
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
            This will permanently remove the employee record from the system. This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(employee.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} /> Delete Record
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
