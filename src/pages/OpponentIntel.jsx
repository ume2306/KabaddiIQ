import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea,
} from 'recharts';
import { opponents, getOpponent, teamNames } from '../data/opponents';

/* ── Strength metric card ──────────────────────── */
function MetricCard({ label, score, delay, active }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="card"
      style={{ textAlign: 'center' }}
    >
      <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 800,
        fontSize: '2rem',
        color: 'var(--primary)',
        marginBottom: '0.75rem',
      }}>{score}</div>
      <div style={{ background: '#EEECE8', borderRadius: 999, height: 8, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={active ? { width: `${score}%` } : {}}
          transition={{ duration: 1.1, ease: 'easeOut', delay: delay + 0.2 }}
          style={{ height: '100%', background: 'var(--primary)', borderRadius: 999 }}
        />
      </div>
    </motion.div>
  );
}

/* ── Zone vulnerability color ──────────────────── */
function zoneColor(v) {
  if (v >= 75) return { bg: 'rgba(232,97,44,0.15)', text: '#C0440B', border: '#E8612C' };
  if (v >= 55) return { bg: 'rgba(245,166,35,0.12)', text: '#B45309', border: '#F5A623' };
  return { bg: 'rgba(42,125,79,0.1)', text: '#2A7D4F', border: '#2A7D4F' };
}

/* ── Zone grid cell ────────────────────────────── */
function ZoneCell({ zone, vulnerability, label, delay, active }) {
  const [hovered, setHovered] = useState(false);
  const c = zoneColor(vulnerability);
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={active ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.35, delay }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: c.bg,
        border: `2px solid ${hovered ? c.border : 'transparent'}`,
        borderRadius: 12,
        padding: '0.9rem 0.5rem',
        textAlign: 'center',
        cursor: 'default',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? `0 4px 16px ${c.border}30` : 'none',
        position: 'relative',
      }}
    >
      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{zone}</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: c.text }}>{vulnerability}</div>
      <div style={{ fontSize: '0.65rem', color: c.text, fontWeight: 600, marginTop: '0.2rem' }}>{label}</div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            style={{
              position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
              background: '#1A1A1A', color: 'white', padding: '6px 10px',
              borderRadius: 8, fontSize: '0.7rem', whiteSpace: 'nowrap', zIndex: 10,
            }}
          >
            {vulnerability >= 65 ? '🎯 Recommended: Attack here' : '🛡️ Avoid: Strong defense'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OpponentIntel() {
  const [selected, setSelected] = useState('');
  const [opponent, setOpponent] = useState(null);
  const [active, setActive] = useState(false);

  const handleSelect = (team) => {
    setSelected(team);
    const found = getOpponent(team);
    if (!found) { setOpponent(null); return; }
    setOpponent(found);
    setActive(false);
    setTimeout(() => setActive(true), 80);
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const sectionVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '80vh', padding: '3rem 1rem 6rem' }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* ── Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '0.5rem' }}>
            Opponent <span style={{ color: 'var(--primary)' }}>Intelligence</span>
          </h1>
          <p style={{ color: 'var(--muted)' }}>AI-powered pre-match tactical analysis</p>
        </div>

        {/* ── Team selector */}
        <div style={{ maxWidth: 480, margin: '0 auto 3rem' }}>
          <select
            id="team-select"
            className="select-base"
            value={selected}
            onChange={e => handleSelect(e.target.value)}
          >
            <option value="">Select Opponent Team</option>
            {teamNames.map(t => (
              <option key={t} value={t} disabled={!getOpponent(t)}>
                {t}{!getOpponent(t) ? ' (coming soon)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* ── Empty state */}
        {!opponent && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <p style={{ fontSize: '1.05rem' }}>Select a team to generate tactical brief</p>
          </div>
        )}

        <AnimatePresence>
          {opponent && active && (
            <motion.div key={opponent.id} variants={containerVariants} initial="hidden" animate="visible">

              {/* Section 2 — Strength Overview */}
              <motion.div variants={sectionVariant} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' }}>
                  Team Strength Overview
                </h2>
                <div className="grid-3">
                  <MetricCard label="Overall Strength" score={opponent.overallStrength} delay={0} active={active} />
                  <MetricCard label="Defensive Rating" score={opponent.defensiveRating} delay={0.1} active={active} />
                  <MetricCard label="Offensive Rating" score={opponent.offensiveRating} delay={0.2} active={active} />
                </div>
              </motion.div>

              {/* Section 3 — Zone Heatmap */}
              <motion.div variants={sectionVariant} className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>
                  Zone Vulnerability Map
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                  Higher score = easier to score in this zone
                </p>
                <div className="court">
                  {opponent.zones.map((z, i) => (
                    <ZoneCell key={z.zone} {...z} delay={i * 0.07} active={active} />
                  ))}
                </div>
                {/* Legend */}
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                  {[
                    { color: '#2A7D4F', bg: 'rgba(42,125,79,0.1)', label: 'Strong Defense' },
                    { color: '#B45309', bg: 'rgba(245,166,35,0.12)', label: 'Moderate' },
                    { color: '#C0440B', bg: 'rgba(232,97,44,0.15)', label: 'Exploit This' },
                  ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: l.bg, border: `2px solid ${l.color}` }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Section 4 — Raid Style Effectiveness */}
              <motion.div variants={sectionVariant} className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                  Which Raid Styles Work?
                </h3>
                {opponent.raidStyles.map((rs, i) => (
                  <motion.div
                    key={rs.style}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem' }}
                  >
                    <span style={{ width: 140, fontSize: '0.85rem', fontWeight: 500, flexShrink: 0 }}>{rs.style}</span>
                    <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${rs.successRate}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.1 + 0.2 }}
                        style={{ height: '100%', background: rs.recommended ? 'var(--primary)' : '#D1D5DB', borderRadius: 999 }}
                      />
                    </div>
                    <span style={{ width: 36, fontSize: '0.8rem', fontWeight: 700, color: rs.recommended ? 'var(--primary)' : 'var(--muted)' }}>
                      {rs.successRate}%
                    </span>
                    <span className={`pill pill-${rs.recommended ? 'green' : 'red'}`} style={{ fontSize: '0.68rem' }}>
                      {rs.recommended ? '✓ Use' : '✗ Avoid'}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Section 5 — Raider Recommendations */}
              <motion.div variants={sectionVariant} className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                  Send These Raiders
                </h3>
                {opponent.raiderRecommendations.map((r, i) => (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -2 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      borderRadius: 10,
                      marginBottom: '0.5rem',
                      background: i === 0 ? 'rgba(232,97,44,0.06)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      color: i === 0 ? 'var(--primary)' : '#D1D5DB',
                      width: 32,
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{r.reason}</div>
                    </div>
                    <div style={{ minWidth: 120 }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{r.successProb}%</span>
                      </div>
                      <div style={{ background: '#F3F4F6', borderRadius: 999, height: 7, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${r.successProb}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.1 + 0.2 }}
                          style={{ height: '100%', background: 'var(--primary)', borderRadius: 999 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Section 6 — Scoring Pattern */}
              <motion.div variants={sectionVariant} className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>
                  When Do They Score?
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                  Points per minute across a typical match — find their weak window
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={opponent.scoringPattern}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E8612C" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#E8612C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="minute" tickFormatter={v => `${v}'`} tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#6B6B6B' }} />
                    <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#6B6B6B' }} />
                    <Tooltip
                      formatter={(v) => [`${v} pts/min`, 'Scoring Rate']}
                      labelFormatter={(l) => `Minute ${l}`}
                      contentStyle={{ borderRadius: 10, fontFamily: 'DM Sans', fontSize: 12, border: '1px solid #EEECE8' }}
                    />
                    <ReferenceArea
                      x1={opponent.vulnerabilityWindow.start}
                      x2={opponent.vulnerabilityWindow.end}
                      fill="rgba(239,68,68,0.08)"
                      label={{ value: '⚡ Strike Here', position: 'top', fontSize: 11, fill: '#DC2626', fontFamily: 'DM Sans' }}
                    />
                    <Area type="monotone" dataKey="rate" stroke="#E8612C" strokeWidth={2.5} fill="url(#areaGrad)" isAnimationActive />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Section 7 — Key Insights */}
              <motion.div variants={sectionVariant}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' }}>
                  Tactical Summary
                </h3>
                <div className="grid-3">
                  {opponent.keyInsights.map((ins, i) => (
                    <motion.div
                      key={ins.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4, boxShadow: '0 6px 24px rgba(232,97,44,0.12)' }}
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderTop: '3px solid var(--primary)',
                        borderRadius: 'var(--radius-card)',
                        padding: '1.5rem',
                        transition: 'box-shadow 0.2s, transform 0.2s',
                      }}
                    >
                      <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{ins.icon}</div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{ins.title}</h4>
                      <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{ins.body}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
