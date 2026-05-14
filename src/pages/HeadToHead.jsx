import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { matchups, getMatchup, raiders, defenders } from '../data/matchups';

function useCountUp(target, active, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

/* ── Half-arc probability meter ─────────────────── */
function ProbArc({ probability, active }) {
  const size = 160;
  const r = 62;
  const cx = size / 2;
  const cy = size / 2 + 20;
  // half-arc from 180° to 0°
  const arcLength = Math.PI * r;
  const filled = (probability / 100) * arcLength;
  const color = probability >= 60 ? '#2A7D4F' : probability >= 45 ? '#F5A623' : '#DC2626';
  const count = useCountUp(probability, active);

  // SVG path for half arc
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size / 2 + 30}>
        {/* Track */}
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none" stroke="#EEECE8" strokeWidth={12} strokeLinecap="round"
        />
        {/* Fill */}
        <motion.path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={arcLength}
          initial={{ strokeDashoffset: arcLength }}
          animate={active ? { strokeDashoffset: arcLength - filled } : {}}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize="22" fontWeight="800" fontFamily="'Syne', sans-serif" fill={color}>
          {active ? count : '—'}%
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="'DM Sans', sans-serif">
          RAID SUCCESS
        </text>
      </svg>
    </div>
  );
}

export default function HeadToHead() {
  const [raider, setRaider] = useState('');
  const [defender, setDefender] = useState('');
  const [matchup, setMatchup] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!raider || !defender) return;
    const found = getMatchup(raider, defender);
    setMatchup(found || null);
    setActive(false);
    if (found) setTimeout(() => setActive(true), 100);
  }, [raider, defender]);

  const wins = useCountUp(matchup?.record.wins ?? 0, active);
  const losses = useCountUp(matchup?.record.losses ?? 0, active);
  const total = useCountUp(matchup?.record.total ?? 0, active);

  const verdictBg = matchup
    ? (matchup.verdict === 'SEND' ? '#F0FFF4' : '#FFF5F5')
    : 'var(--card)';

  const lineColor = matchup
    ? (matchup.history[matchup.history.length - 1].successRate > matchup.history[0].successRate
      ? '#E8612C' : '#F5A623')
    : '#E8612C';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '80vh', padding: '3rem 1rem 6rem' }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '0.5rem' }}>
            Head to <span style={{ color: 'var(--primary)' }}>Head</span>
          </h1>
          <p style={{ color: 'var(--muted)' }}>Find out if your raider wins this matchup</p>
        </div>

        {/* Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '3rem' }}>
          <select id="h2h-raider" className="select-base" value={raider} onChange={e => setRaider(e.target.value)}>
            <option value="">Select Your Raider</option>
            {raiders.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)', textAlign: 'center', padding: '0 0.5rem' }}
          >
            VS
          </motion.div>
          <select id="h2h-defender" className="select-base" value={defender} onChange={e => setDefender(e.target.value)}>
            <option value="">Select Their Defender</option>
            {defenders.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Empty state */}
        {(!raider || !defender) && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚔️</div>
            <p>Select a raider and defender to see the matchup analysis</p>
          </div>
        )}

        {raider && defender && !matchup && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <p>No historical matchup data for this combination yet.</p>
          </div>
        )}

        <AnimatePresence>
          {matchup && active && (
            <motion.div
              key={`${matchup.raider}-${matchup.defender}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Verdict Card */}
              <div className="card" style={{ background: verdictBg, borderLeft: '4px solid var(--primary)', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
                  {/* Raider side */}
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem' }}>{matchup.raider}</h3>
                    <span className="pill pill-orange" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>Raider</span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {matchup.raiderStrengths.map(s => (
                        <span key={s} className="pill pill-orange" style={{ fontSize: '0.7rem' }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Center Arc */}
                  <div style={{ textAlign: 'center' }}>
                    <ProbArc probability={matchup.successProbability} active={active} />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: 'spring' }}
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1.4rem',
                        color: matchup.verdict === 'SEND' ? '#2A7D4F' : '#DC2626',
                        marginTop: '0.5rem',
                      }}
                    >
                      {matchup.verdict === 'SEND' ? '✅ SEND' : '❌ AVOID'}
                    </motion.div>
                  </div>

                  {/* Defender side */}
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem' }}>{matchup.defender}</h3>
                    <span className="pill pill-green" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>Defender</span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                      {matchup.defenderStrengths.map(s => (
                        <span key={s} className="pill pill-green" style={{ fontSize: '0.7rem' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="card" style={{ borderLeft: '4px solid var(--primary)', marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Why?</h3>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{matchup.verdictReason}</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>💡 {matchup.keyInsight}</p>
              </div>

              {/* Historical Record */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>All Time Record</h3>
                <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Total Raids', val: total, color: 'var(--primary)' },
                    { label: 'Successful', val: wins, color: '#2A7D4F' },
                    { label: 'Failed', val: losses, color: '#DC2626' },
                  ].map(s => (
                    <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: s.color }}>{s.val}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '0.75rem' }}>LAST 5 MATCHUPS</p>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {matchup.last5.map((r, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.12 + 0.3, type: 'spring' }}
                        className={`wl-circle ${r === 'W' ? 'wl-win' : 'wl-loss'}`}
                      >
                        {r}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Season Trend */}
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                  Success Rate Over Seasons
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={matchup.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="season" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#6B6B6B' }} />
                    <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#6B6B6B' }} />
                    <Tooltip
                      formatter={(v) => [`${v}%`, 'Success Rate']}
                      contentStyle={{ borderRadius: 10, fontFamily: 'DM Sans', fontSize: 12, border: '1px solid #EEECE8' }}
                    />
                    <Line type="monotone" dataKey="successRate" stroke={lineColor} strokeWidth={3} dot={{ r: 5, fill: lineColor, strokeWidth: 0 }} isAnimationActive />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
