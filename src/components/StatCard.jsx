import { motion } from 'framer-motion';

export default function StatCard({ title, value, label, icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(238,236,232,0.9)',
        borderRadius: 'var(--radius-card)',
        padding: '1.1rem 1.4rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        minWidth: 180,
      }}
    >
      {icon && <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{icon}</div>}
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: '1.4rem',
        color: 'var(--primary)',
      }}>{value}</div>
      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', marginTop: '0.1rem' }}>{title}</div>
      {label && <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{label}</div>}
    </motion.div>
  );
}
