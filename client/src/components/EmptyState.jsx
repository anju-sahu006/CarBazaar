import React from 'react';
import { CarFront } from 'lucide-react';

export default function EmptyState({ icon: Icon = CarFront, title, description, action }) {
  return (
    <div
      className="card"
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'var(--secondary-light)',
          color: 'var(--secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{title}</h3>
      {description && (
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.92rem' }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '6px' }}>{action}</div>}
    </div>
  );
}
