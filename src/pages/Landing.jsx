import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CounterStat from '../components/CounterStat';
import FeatureCard from '../components/FeatureCard';

/* ── Floating Hero Card ──────────────────────── */
function FloatingCard({ children, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      style={{
        position: 'absolute',
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(238,236,232,0.9)',
        borderRadius: 16,
        padding: '1rem 1.3rem',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.09)',
        zIndex: 2,
        minWidth: 180,
        maxWidth: 230,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Circular SVG Score Ring ──────────────────── */
function ScoreRing({ score, size = 80, color = '#E8612C' }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEECE8" strokeWidth={8} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2} y={size / 2 + 5}
        textAnchor="middle"
        fontSize="16" fontWeight="700"
        fontFamily="'Syne', sans-serif"
        fill={color}
      >{score}</text>
    </svg>
  );
}

/* ── Animated Bar ─────────────────────────────── */
function AnimBar({ pct, label, color = '#E8612C' }) {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ fontSize: '0.72rem', color: '#6B6B6B', marginBottom: 3 }}>{label}</div>
      <div style={{ background: '#EEECE8', borderRadius: 999, height: 7, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.5 }}
          style={{ height: '100%', background: color, borderRadius: 999 }}
        />
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── HERO ──────────────────────────────── */}
      <section
        className="hero-gradient"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Blobs */}
        <div className="blob blob-1" style={{ width: 480, height: 480, top: '-10%', left: '-8%' }} />
        <div className="blob blob-2" style={{ width: 400, height: 400, bottom: '5%', right: '-5%' }} />
        <div className="blob blob-3" style={{ width: 320, height: 320, top: '40%', left: '50%' }} />

        {/* Floating stat cards */}
        <FloatingCard style={{ top: '14%', left: '4%' }} delay={0.4}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ScoreRing score={87} size={64} />
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem' }}>Player Valuation</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Naveen Kumar</div>
              <span className="pill pill-orange" style={{ fontSize: '0.65rem', marginTop: 4 }}>Elite Raider</span>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard style={{ bottom: '18%', left: '2%' }} delay={0.6}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Raid Success Rate
          </div>
          <AnimBar pct={73} label="vs Jaipur Pink Panthers" />
          <AnimBar pct={58} label="vs Bengaluru Bulls" color="#F5A623" />
        </FloatingCard>

        <FloatingCard style={{ top: '18%', right: '4%' }} delay={0.8}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.1rem' }}>💎</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem' }}>Hidden Gem Found ↑</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--primary)' }}>Arjun Deshwal</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>+12 pts this season</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#2A7D4F' }}
            />
            <span style={{ fontSize: '0.7rem', color: '#2A7D4F', fontWeight: 600 }}>Rising Form</span>
          </div>
        </FloatingCard>

        {/* Center content */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 3, padding: '2rem 1rem', maxWidth: 750 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="pill pill-orange" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              🏟️ PKL Analytics Platform
            </span>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              lineHeight: 1.05,
              marginBottom: '1.25rem',
              letterSpacing: '-1px',
            }}>
              WHERE <span style={{ color: 'var(--primary)' }}>DATA</span><br />
              MEETS THE MAT
            </h1>

            <p style={{
              color: 'var(--muted)',
              fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
              maxWidth: 520,
              margin: '0 auto 2rem',
              lineHeight: 1.7,
            }}>
              12 seasons. 500+ players. Every raid. Every tackle.<br />Explained by AI.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/player" className="btn-primary">Analyse a Player</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/opponent" className="btn-outline">Scout an Opponent</Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 60,
          background: 'linear-gradient(to bottom, transparent, var(--bg))',
        }} />
      </section>

      {/* ── COUNTERS ──────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="counter-row">
            <CounterStat value={12} label="Seasons of Data" />
            <div className="divider" />
            <CounterStat value={500} suffix="+" label="PKL Players Tracked" />
            <div className="divider" />
            <CounterStat value={2} label="AI Modules Powered" />
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────── */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '0.75rem' }}
          >
            Built for the game.{' '}
            <span style={{ color: 'var(--primary)' }}>Powered by AI.</span>
          </motion.h2>
          <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto' }}>
            Three intelligence modules, one unified platform.
          </p>
        </div>

        <div className="grid-3">
          <FeatureCard
            icon="🎯"
            title="Player Valuation"
            description="AI-powered scoring for every PKL player. SHAP explainability breaks down exactly what drives each valuation."
            link="Analyse players"
            delay={0}
          />
          <FeatureCard
            icon="🛡️"
            title="Opponent Intel"
            description="Pre-match tactical briefs. Zone vulnerabilities, optimal raid styles, and timing windows — all AI-generated."
            link="Scout opponents"
            delay={0.12}
          />
          <FeatureCard
            icon="🗺️"
            title="Zone Intelligence"
            description="Heatmaps for every zone. See where players attack and where teams are vulnerable across all 12 seasons."
            link="Explore zones"
            delay={0.24}
          />
        </div>
      </section>

      {/* ── LIVE PREVIEW ──────────────────────── */}
      <section style={{ background: '#FFF8F5', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <motion.span
              className="pill pill-orange"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ marginBottom: '1rem', display: 'inline-flex' }}
            >
              Live Demo
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', marginBottom: '1rem' }}
            >
              See it in action
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}
            >
              Enter any PKL player to get their complete AI valuation — score breakdown, SHAP explanations, radar chart, and peer comparison.
            </motion.p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/player" className="btn-primary">Try it yourself →</Link>
            </motion.div>
          </div>

          {/* Mock player card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card"
            style={{ borderLeft: '4px solid var(--primary)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem' }}>Naveen Kumar</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Dabang Delhi KC</p>
                <span className="pill pill-orange" style={{ marginTop: 6 }}>Raider</span>
              </div>
              <ScoreRing score={87} size={76} />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--muted)' }}>TOP CONTRIBUTIONS</p>
              {[
                { label: 'Raid Success Rate', val: 28, color: '#E8612C' },
                { label: 'Consistency', val: 22, color: '#F5A623' },
                { label: 'Clutch Index', val: 18, color: '#2A7D4F' },
              ].map(b => (
                <AnimBar key={b.label} pct={(b.val / 30) * 100} label={`${b.label}  +${b.val} pts`} color={b.color} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="pill pill-orange">Elite Tier</span>
              <span className="pill pill-green">↑ Rising Form</span>
              <span className="pill pill-purple">⚡ Clutch Performer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────── */}
      <section className="section">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', marginBottom: '0.75rem' }}
          >
            All your intelligence, <span style={{ color: 'var(--primary)' }}>one platform</span>
          </motion.h2>
        </div>
        <div className="grid-3" style={{ gap: '1rem' }}>
          {[
            { emoji: '🔍', title: 'Player Valuation', desc: 'Score any PKL player with AI and see the SHAP breakdown behind every point.', to: '/player' },
            { emoji: '⚔️', title: 'Head to Head', desc: 'Find out if your raider wins the matchup before the match even starts.', to: '/h2h' },
            { emoji: '📊', title: 'League Overview', desc: 'Discover hidden gems, rising stars and the most valuable players this season.', to: '/league' },
            { emoji: '🗺️', title: 'Zone Intelligence', desc: 'Every zone. Every heatmap. For any player or team across all PKL seasons.', to: '/zone' },
            { emoji: '🛡️', title: 'Opponent Intel', desc: 'Complete pre-match tactical brief — zone vulnerabilities and optimal raid windows.', to: '/opponent' },
            { emoji: '💬', title: 'KabaddiIQ Chat', desc: 'Ask anything about PKL stats, players, or tactics — AI answers instantly.', to: '/chat' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <Link to={item.to} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s', height: '100%' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{item.emoji}</div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--text)' }}>
                    {item.title}
                  </h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
