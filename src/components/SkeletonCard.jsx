import { motion } from 'framer-motion';

export default function SkeletonCard({ height = 400 }) {
  return (
    <motion.div
      style={{
        height,
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
          transform: 'translateX(-100%)'
        }}
        animate={{ transform: 'translateX(100%)' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}
