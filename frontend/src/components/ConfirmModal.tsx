'use client';

import React from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isConfirming,
}) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(20,16,12,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: 20,
      }}
      onClick={onCancel}
    >
      <div
        style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 8, padding: 32, maxWidth: 400, width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ fontSize: 20, marginBottom: 12 }}>{title}</h3>
        <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.5, marginBottom: 28 }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={onCancel} disabled={isConfirming}>{cancelLabel}</button>
          <button className="btn btn-clay btn-sm" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
