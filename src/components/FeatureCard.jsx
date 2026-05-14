import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function FeatureCard({ icon, title, description, link, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      style={{
        position: 'relative',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: '2rem',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'background 0.25s, box-shadow 0.25s',
      }}
      className="feature-card"
    >
      {/* Left accent bar — appears on hover via CSS */}
      <style>{`
        .feature-card:hover { background: #FFF8F5 !important; box-shadow: 0 8px 32px rgba(232,97,44,0.12); }
        .feature-card-accent { position:absolute; left:0; top:0; bottom:0; width:4px; background:var(--primary); transform:scaleY(0); transform-origin:bottom; transition:transform 0.3s ease; border-radius:4px 0 0 4px; }
        .feature-card:hover .feature-card-accent { transform:scaleY(1); }
      `}</style>
      <div className="feature-card-accent" />

      <div style={{
        width: 52, height: 52,
        background: 'rgba(232,97,44,0.1)',
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.6rem',
        marginBottom: '1.25rem',
      }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1rem' }}>
        {description}
      </p>
      <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>{link} →</span>
    </motion.div>
  );
}
