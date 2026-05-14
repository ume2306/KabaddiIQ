import { motion } from 'framer-motion';
import { players } from '../data/players';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

function tierColor(tier) {
  if (tier === 'Elite') return '#E8612C';
  if (tier === 'Strong') return '#F5A623';
  return '#9CA3AF';
}

function formIcon(form) {
  if (form === 'rising') return '↑';
  if (form === 'falling') return '↓';
  return '→';
}
function formClass(form) {
  if (form === 'rising') return 'pill-green';
  if (form === 'falling') return 'pill-red';
  return 'pill-amber';
}

/* ── Circular mini-ring ─────────────────────────── */
function MiniRing({ score, size = 54, color }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEECE8" strokeWidth={6} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="'Syne', sans-serif" fill={color}>
        {score}
      </text>
    </svg>
  );
}

export default function LeagueOverview() {
  const sorted = [...players].sort((a, b) => b.valuationScore - a.valuationScore);
  const elite = sorted.filter(p => p.tier === 'Elite');
  const hidden = sorted.filter(p => p.form === 'rising');
  const rising = sorted.filter(p => p.form === 'rising' || p.form === 'stable');

  const barData = sorted.map(p => ({ name: p.name.split(' ')[0], score: p.valuationScore, tier: p.tier }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '80vh', padding: '3rem 1rem 6rem' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '0.5rem' }}>
            League <span style={{ color: 'var(--primary)' }}>Overview</span>
          </h1>
          <p style={{ color: 'var(--muted)' }}>Most valuable players, hidden gems, and rising stars this season</p>
        </div>

        {/* Season scoreboard bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card"
          style={{ marginBottom: '2.5rem' }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.25rem' }}>
            Season 10 — Player Valuation Scoreboard
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, fontFamily: 'DM Sans', fontSize: 12, border: '1px solid #EEECE8' }}
                formatter={(v, _, p) => [v, p.payload.tier]}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} isAnimationActive>
                {barData.map((d, i) => (
                  <Cell key={i} fill={tierColor(d.tier)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', justifyContent: 'center' }}>
            {[{ label: 'Elite', color: '#E8612C' }, { label: 'Strong', color: '#F5A623' }, { label: 'Average', color: '#9CA3AF' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top section — Elite tier */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🏆</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.3rem' }}>Elite Tier</h2>
            <span className="pill pill-orange">Season 10</span>
          </div>
          <div className="grid-3">
            {sorted.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, boxShadow: '0 8px 28px rgba(232,97,44,0.13)' }}
                className="card"
                style={{
                  borderLeft: `4px solid ${tierColor(p.tier)}`,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Rank badge */}
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  fontFamily: 'var(--font-heading)', fontWeight: 800,
                  fontSize: '1.4rem', color: '#EEECE8',
                }}>
                  #{i + 1}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <MiniRing score={p.valuationScore} color={tierColor(p.tier)} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{p.team}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className={`pill pill-${p.position === 'Raider' ? 'orange' : 'green'}`} style={{ fontSize: '0.68rem' }}>
                    {p.position}
                  </span>
                  <span className={`pill ${formClass(p.form)}`} style={{ fontSize: '0.68rem' }}>
                    {formIcon(p.form)} {p.form.charAt(0).toUpperCase() + p.form.slice(1)}
                  </span>
                  {p.clutchIndex > 85 && (
                    <span className="pill pill-purple" style={{ fontSize: '0.68rem' }}>⚡ Clutch</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hidden Gems */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.4rem' }}>💎</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.3rem' }}>Hidden Gems</h2>
            <span className="pill pill-green">Rising Form</span>
          </div>
          <div className="grid-3">
            {hidden.map((p, i) => (
              <motion.div
                key={p.id + '-hidden'}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="card"
                style={{ borderTop: '3px solid #2A7D4F' }}
              >
                <div style={{ fontSize: '0.72rem', color: '#2A7D4F', fontWeight: 600, marginBottom: '0.4rem' }}>
                  ↑ RISING FORM
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{p.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{p.team} — {p.position}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--primary)' }}>
                    {p.valuationScore}
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>valuation score</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Season stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, rgba(232,97,44,0.08) 0%, rgba(245,166,35,0.06) 100%)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-card)',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          {[
            { val: players.length, label: 'Players Tracked', suffix: '' },
            { val: players.filter(p => p.tier === 'Elite').length, label: 'Elite Tier', suffix: '' },
            { val: Math.round(players.reduce((s, p) => s + p.valuationScore, 0) / players.length), label: 'Avg. Score', suffix: '' },
            { val: players.filter(p => p.clutchIndex > 85).length, label: 'Clutch Performers', suffix: '' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--primary)' }}>
                {s.val}{s.suffix}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
