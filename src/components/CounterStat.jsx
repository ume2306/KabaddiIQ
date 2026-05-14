import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function CounterStat({ value, suffix = '', label, duration = 1800 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const num = parseFloat(value);
    const step = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplay(Math.round(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center', padding: '1rem 3rem', flex: 1 }}
    >
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 800,
        fontSize: '3rem',
        color: 'var(--primary)',
        lineHeight: 1,
        marginBottom: '0.5rem',
      }}>
        {display}{suffix}
      </div>
      <div style={{ color: 'var(--muted)', fontSize: '0.95rem', fontWeight: 500 }}>{label}</div>
    </motion.div>
  );
}
