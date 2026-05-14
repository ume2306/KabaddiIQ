export default function ErrorMessage({ message }) {
  return (
    <div style={{
      padding: '1.25rem 1.5rem',
      borderRadius: 'var(--radius-card)',
      border: '1px solid #FECACA',
      background: '#FFF5F5',
      color: '#DC2626',
      fontSize: '0.9rem',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.05)'
    }}>
      <span style={{ fontSize: '1.2rem' }}>⚠️</span>
      {message || 'Something went wrong. Please check your connection or try again.'}
    </div>
  );
}
