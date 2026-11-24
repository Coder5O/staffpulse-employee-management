import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="toast-container">
      <div className={`toast ${isSuccess ? 'success' : 'error'}`}>
        <div style={{ color: isSuccess ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center' }}>
          {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
        </div>
        <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>
          {toast.message}
        </div>
        <button className="toast-close" onClick={onClose} aria-label="Close notification">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
