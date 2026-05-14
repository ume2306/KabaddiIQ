export default function SkeletonLoader({ lines = 4, height = 120 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="skeleton" style={{ height: height, borderRadius: 'var(--radius-card)', width: '100%' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: 14,
            width: `${100 - i * 12}%`,
            borderRadius: 8,
          }}
        />
      ))}
    </div>
  );
}
