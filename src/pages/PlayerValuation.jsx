import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { players, getPlayer } from '../data/players';

/* ── Helpers ──────────────────────────────────── */
function useCountUp(target, active, duration = 1200) {
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

function tierColor(tier) {
  if (tier === 'Elite') return '#E8612C';
  if (tier === 'Strong') return '#F5A623';
  return '#9CA3AF';
}

function formPill(form) {
  if (form === 'rising') return <span className="pill pill-green">↑ Rising</span>;
  if (form === 'falling') return <span className="pill pill-red">↓ Falling</span>;
  return <span className="pill pill-amber">→ Stable</span>;
}

/* ── Animated SVG Score Ring ──────────────────── */
function ScoreRing({ score, size = 100, color = '#E8612C', active = false }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const count = useCountUp(score, active);
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEECE8" strokeWidth={10} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={active ? { strokeDashoffset: circ - dash } : {}}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 - 5} textAnchor="middle" fontSize={size === 100 ? 20 : 14} fontWeight="800" fontFamily="'Syne', sans-serif" fill={color}>
        {active ? count : '—'}
      </text>
      <text x={size / 2} y={size / 2 + 12} textAnchor="middle" fontSize={9} fill="#9CA3AF" fontFamily="'DM Sans', sans-serif">SCORE</text>
    </svg>
  );
}

/* ── SHAP Bar ─────────────────────────────────── */
function ShapBar({ feature, value, color, maxVal = 35, delay = 0, active }) {
  const isNeg = value < 0;
  const absVal = Math.abs(value);
  const pct = (absVal / maxVal) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}
    >
      <span style={{ width: 140, fontSize: '0.8rem', color: 'var(--muted)', flexShrink: 0, textAlign: 'right' }}>{feature}</span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
        {isNeg ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ background: '#FEE2E2', borderRadius: 999, height: 10, width: `${pct}%`, position: 'relative', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={active ? { width: '100%' } : {}}
                transition={{ duration: 0.8, delay, ease: 'easeOut' }}
                style={{ height: '100%', background: '#EF4444', borderRadius: 999 }}
              />
            </div>
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <div style={{ background: '#F3F4F6', borderRadius: 999, height: 10, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={active ? { width: `${pct}%` } : {}}
                transition={{ duration: 0.8, delay, ease: 'easeOut' }}
                style={{ height: '100%', background: color, borderRadius: 999 }}
              />
            </div>
          </div>
        )}
      </div>
      <span style={{ width: 54, fontSize: '0.8rem', fontWeight: 600, color: isNeg ? '#DC2626' : 'var(--text)', flexShrink: 0 }}>
        {isNeg ? '−' : '+'}{absVal} pts
      </span>
    </motion.div>
  );
}

export default function PlayerValuation() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [player, setPlayer] = useState(null);
  const [active, setActive] = useState(false);
  const [radarData, setRadarData] = useState([]);
  const inputRef = useRef(null);

  const handleSearch = (q) => {
    setQuery(q);
    if (q.length < 1) { setSuggestions([]); return; }
    setSuggestions(players.filter(p => p.name.toLowerCase().includes(q.toLowerCase())));
  };

  const selectPlayer = (p) => {
    setPlayer(p);
    setQuery(p.name);
    setSuggestions([]);
    setActive(false);
    setTimeout(() => setActive(true), 100);
    setRadarData([]);
    setTimeout(() => setRadarData([
      { stat: 'Raid%', val: p.stats.raidSuccessRate },
      { stat: 'Tackle', val: p.stats.tackleEfficiency },
      { stat: 'Consistency', val: p.stats.consistency },
      { stat: 'Opp.Adj', val: p.stats.opponentAdjusted },
      { stat: 'Zone', val: p.stats.zoneStrength },
    ]), 300);
  };

  const lineColor = player
    ? (player.form === 'rising' ? '#E8612C' : player.form === 'falling' ? '#F5A623' : '#6B6B6B')
    : '#E8612C';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '80vh', padding: '3rem 1rem 6rem' }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* ── Page heading */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '0.5rem' }}>
            Player <span style={{ color: 'var(--primary)' }}>Valuation</span>
          </h1>
          <p style={{ color: 'var(--muted)' }}>Enter any PKL player to get their AI-powered valuation score</p>
        </div>

        {/* ── Search */}
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto 3rem' }}>
          <input
            ref={inputRef}
            id="player-search"
            className="input-base"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search any PKL player — Naveen Kumar, Fazel Atrachali..."
            autoComplete="off"
            style={{ paddingRight: 48 }}
          />
          <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="suggestion-list"
              >
                {suggestions.map(p => (
                  <div key={p.id} className="suggestion-item" onClick={() => selectPlayer(p)}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                      <span style={{ color: 'var(--muted)', fontSize: '0.82rem', marginLeft: 8 }}>{p.team}</span>
                    </div>
                    <span className={`pill pill-${p.position === 'Raider' ? 'orange' : p.position === 'Defender' ? 'green' : 'blue'}`}>
                      {p.position}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Empty state */}
        {!player && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏟️</div>
            <p style={{ fontSize: '1.05rem' }}>Search a player to begin analysis</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Try: Naveen Kumar, Fazel Atrachali, Pardeep Narwal</p>
          </div>
        )}

        <AnimatePresence>
          {player && (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* ── Player Hero Card */}
              <div className="card" style={{ borderLeft: '4px solid var(--primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.9rem', marginBottom: '0.25rem' }}>{player.name}</h2>
                  <p style={{ color: 'var(--muted)', marginBottom: '0.6rem' }}>{player.team}</p>
                  <span className={`pill pill-${player.position === 'Raider' ? 'orange' : player.position === 'Defender' ? 'green' : 'blue'}`}>
                    {player.position}
                  </span>
                </div>
                <ScoreRing score={player.valuationScore} size={110} color={tierColor(player.tier)} active={active} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  {formPill(player.form)}
                  {player.clutchIndex > 85 && (
                    <span className="pill pill-purple">⚡ Clutch Performer</span>
                  )}
                  <span className={`pill pill-${player.tier === 'Elite' ? 'orange' : player.tier === 'Strong' ? 'amber' : 'blue'}`}>
                    {player.tier} Tier
                  </span>
                </div>
              </div>

              {/* ── SHAP Explanation */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.3rem' }}>Why this score?</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Each bar shows how much a feature contributed to this player's valuation
                </p>
                {player.shap.map((s, i) => (
                  <ShapBar key={s.feature} {...s} delay={i * 0.1} active={active} />
                ))}
                <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '1rem', textAlign: 'center' }}>
                  Powered by SHAP Explainable AI
                </p>
              </div>

              {/* ── Radar + Season Trend side by side */}
              <div className="grid-2" style={{ marginBottom: '2rem' }}>
                <div className="card">
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.2rem' }}>Performance Profile</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#EEECE8" />
                      <PolarAngleAxis dataKey="stat" tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#6B6B6B' }} />
                      <Radar dataKey="val" stroke={tierColor(player.tier)} fill={tierColor(player.tier)} fillOpacity={0.2} strokeWidth={2} isAnimationActive />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.2rem' }}>Career Trajectory</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={player.seasonTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="season" tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#6B6B6B' }} />
                      <YAxis domain={[50, 100]} tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#6B6B6B' }} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontFamily: 'DM Sans', fontSize: 12, border: '1px solid #EEECE8' }} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke={lineColor}
                        strokeWidth={3}
                        dot={{ r: 5, fill: lineColor, strokeWidth: 0 }}
                        isAnimationActive
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ── Peer Comparison */}
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.2rem' }}>Similar Players</h3>
                <div className="grid-3">
                  {player.peers.map((peer, i) => (
                    <motion.div
                      key={peer.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4, boxShadow: '0 4px 20px rgba(232,97,44,0.15)' }}
                      onClick={() => {
                        const found = players.find(p => p.name === peer.name);
                        if (found) selectPlayer(found);
                      }}
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-card)',
                        padding: '1rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <ScoreRing score={peer.score} size={64} color={tierColor(peer.tier)} active={active} />
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{peer.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{peer.team}</div>
                      <span className={`pill pill-${peer.tier === 'Elite' ? 'orange' : 'amber'}`}>{peer.tier}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
