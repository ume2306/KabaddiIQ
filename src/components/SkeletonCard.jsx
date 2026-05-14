import { motion } from 'framer-motion';

export default function SkeletonCard({ height = 120 }) {
  return (
    <motion.div
      style={{
        height,
        borderRadius: 'var(--radius-card)',
        background: 'linear-gradient(90deg, #f0ede8 25%, #faf8f5 50%, #f0ede8 75%)',
        backgroundSize: '200% 100%',
        border: '1px solid var(--border)'
      }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  );
}
