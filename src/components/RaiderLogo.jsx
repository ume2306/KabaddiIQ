import { motion } from 'framer-motion';

export default function RaiderLogo() {
  return (
    <div style={{ position: 'relative', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        {/* Abstract Raider Body */}
        <motion.path
          d="M 20 80 Q 30 60 50 55 L 70 45 Q 85 40 90 20"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        {/* Head */}
        <motion.circle
          cx="92" cy="18" r="6"
          fill="var(--primary)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
        {/* Lunging Leg */}
        <motion.path
          d="M 50 55 L 45 85 L 30 90"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        {/* Reaching Hand */}
        <motion.path
          d="M 70 45 L 85 60"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </svg>
      {/* Pulse Aura */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--primary)',
          borderRadius: '50%',
          zIndex: -1,
          opacity: 0.1
        }}
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}
