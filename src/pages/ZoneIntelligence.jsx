import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playerZones, teamZones, getPlayerZone, getTeamZone } from '../data/zones';

/* ── Zone strength color ────────────────────────── */
function zoneStrengthColor(strength) {
  if (strength >= 80) return { bg: 'rgba(232,97,44,0.18)', text: '#C0440B', label: 'Dominant' };
  if (strength >= 60) return { bg: 'rgba(245,166,35,0.15)', text: '#B45309', label: 'Strong' };
  if (strength >= 40) return { bg: 'rgba(254,243,199,0.8)', text: '#92400E', label: 'Moderate' };
  return { bg: '#F9FAFB', text: '#6B7280', label: 'Weak' };
}

/* ── Defense zone color (inverted perspective) ─── */
function defenseZoneColor(tackle) {
  if (tackle >= 70) return { bg: 'rgba(42,125,79,0.15)', text: '#166534', label: 'Fortress — Avoid' };
  if (tackle >= 50) return { bg: 'rgba(245,166,35,0.12)', text: '#B45309', label: 'Contested' };
  return { bg: 'rgba(232,97,44,0.15)', text: '#C0440B', label: 'Exploit This' };
}

/* ── Court heatmap cell ─────────────────────────── */
function CourtCell({ zone, strength, raids, successRate, tackles, delay, active, mode }) {
  const [hovered, setHovered] = useState(false);
  const c = mode === 'team' ? defenseZoneColor(strength) : zoneStrengthColor(strength);
  const tooltip = mode === 'team'
    ? `${tackles ?? raids ?? 0} tackles, ${successRate}% success`
    : `${raids ?? 0} raids, ${successRate}% success`;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={active ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.35, delay }}
      whileHover={{ scale: 1.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: c.bg,
        border: `2px solid ${hovered ? c.text : 'rgba(0,0,0,0.06)'}`,
        borderRadius: 12,
        padding: '0.85rem 0.4rem',
        textAlign: 'center',
        cursor: 'default',
        position: 'relative',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? `0 4px 16px ${c.text}25` : 'none',
      }}
    >
      <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 2 }}>{zone}</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: c.text }}>{strength}</div>
      <div style={{ fontSize: '0.62rem', color: c.text, fontWeight: 600 }}>{c.label}</div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              position: 'absolute', bottom: '105%', left: '50%', transform: 'translateX(-50%)',
              background: '#1A1A1A', color: 'white', padding: '5px 9px',
              borderRadius: 7, fontSize: '0.68rem', whiteSpace: 'nowrap', zIndex: 10,
            }}
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Animated mode switcher ─────────────────────── */
function ModeSwitcher({ mode, setMode }) {
  return (
    <div style={{ display: 'flex', background: '#EEECE8', borderRadius: 'var(--radius-pill)', padding: 4, width: 'fit-content', margin: '0 auto 2rem', position: 'relative' }}>
      {['player', 'team'].map(m => (
        <button
          key={m}
          id={`mode-${m}`}
          onClick={() => setMode(m)}
          style={{
            position: 'relative',
            padding: '8px 28px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: mode === m ? 'var(--primary)' : 'var(--muted)',
            transition: 'color 0.2s',
            zIndex: 1,
          }}
        >
          {m === 'player' ? '👤 Player Zones' : '🏟️ Team Zones'}
          {mode === m && (
            <motion.div
              layoutId="mode-indicator"
              style={{
                position: 'absolute', inset: 0,
                background: 'white',
                borderRadius: 'var(--radius-pill)',
                zIndex: -1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default function ZoneIntelligence() {
  const [mode, setMode] = useState('player');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [active, setActive] = useState(false);

  const handlePlayerSearch = (q) => {
    setQuery(q);
    if (q.length < 1) { setSuggestions([]); return; }
    setSuggestions(playerZones.filter(p => p.name.toLowerCase().includes(q.toLowerCase())));
  };

  const selectPlayer = (p) => {
    setQuery(p.name);
    setSuggestions([]);
    setPlayerData(p);
    setActive(false);
    setTimeout(() => setActive(true), 80);
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    const found = getTeamZone(team);
    setTeamData(found || null);
    setActive(false);
    if (found) setTimeout(() => setActive(true), 80);
  };

  // sort zones by strength descending for bars
  const sortedZones = (playerData || teamData)
    ? (mode === 'player' && playerData
      ? [...playerData.attackZones].sort((a, b) => b.strength - a.strength)
      : teamData
        ? [...teamData.defensiveZones].sort((a, b) => b.tackleSuccess - a.tackleSuccess)
        : [])
    : [];

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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '0.5rem' }}>
            Zone <span style={{ color: 'var(--primary)' }}>Intelligence</span>
          </h1>
          <p style={{ color: 'var(--muted)' }}>Explore where every player attacks and every team defends</p>
        </div>

        {/* Mode switcher */}
        <ModeSwitcher mode={mode} setMode={(m) => { setMode(m); setActive(false); setQuery(''); setSuggestions([]); setPlayerData(null); setTeamData(null); }} />

        {/* Search / select */}
        <div style={{ maxWidth: 480, margin: '0 auto 2.5rem', position: 'relative' }}>
          {mode === 'player' ? (
            <>
              <input
                id="zone-player-search"
                className="input-base"
                value={query}
                onChange={e => handlePlayerSearch(e.target.value)}
                placeholder="Search player — Naveen Kumar, Fazel Atrachali..."
                autoComplete="off"
              />
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="suggestion-list"
                  >
                    {suggestions.map(p => (
                      <div key={p.name} className="suggestion-item" onClick={() => selectPlayer(p)}>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                        <span className={`pill pill-${p.position === 'Raider' ? 'orange' : 'green'}`}>{p.position}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <select id="zone-team-select" className="select-base" value={selectedTeam} onChange={e => handleTeamSelect(e.target.value)}>
              <option value="">Select Team</option>
              {teamZones.map(t => <option key={t.team} value={t.team}>{t.team}</option>)}
            </select>
          )}
        </div>

        {/* Empty */}
        {((mode === 'player' && !playerData) || (mode === 'team' && !teamData)) && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
            <p>Select a {mode === 'player' ? 'player' : 'team'} to view the zone map</p>
          </div>
        )}

        {/* Player mode content */}
        <AnimatePresence mode="wait">
          {mode === 'player' && playerData && active && (
            <motion.div key="player" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {/* Player header */}
              <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>{playerData.name}</h2>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{playerData.team}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="pill pill-orange">🎯 Dominant: {playerData.dominantZone}</span>
                    <span className="pill pill-green">✊ Style: {playerData.preferredStyle}</span>
                    <span className="pill pill-red">⚠️ Weak: {playerData.weakZone}</span>
                  </div>
                </div>
              </div>

              {/* Court heatmap */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>Attack Zone Map</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>Court view — higher score = more attacks in this zone</p>
                {/* Court outline with baulk line */}
                <div style={{ position: 'relative', maxWidth: 540, margin: '0 auto' }}>
                  <div style={{
                    border: '2px solid #EEECE8',
                    borderRadius: 8,
                    padding: '1rem',
                    position: 'relative',
                  }}>
                    {/* Baulk line */}
                    <div style={{ position: 'absolute', left: '50%', top: '1rem', bottom: '1rem', width: 2, background: 'rgba(232,97,44,0.3)', transform: 'translateX(-50%)' }} />
                    <div className="court" style={{ position: 'relative', zIndex: 1 }}>
                      {playerData.attackZones.map((z, i) => (
                        <CourtCell key={z.zone} {...z} delay={i * 0.08} active={active} mode="player" />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { color: '#C0440B', bg: 'rgba(232,97,44,0.18)', label: 'Dominant (80+)' },
                    { color: '#B45309', bg: 'rgba(245,166,35,0.15)', label: 'Strong (60–79)' },
                    { color: '#92400E', bg: 'rgba(254,243,199,0.8)', label: 'Moderate (40–59)' },
                    { color: '#6B7280', bg: '#F9FAFB', label: 'Weak (<40)' },
                  ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: l.bg, border: `2px solid ${l.color}` }} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone bar breakdown */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>Zone Strength Breakdown</h3>
                {sortedZones.map((z, i) => {
                  const c = zoneStrengthColor(z.strength);
                  return (
                    <motion.div key={z.zone}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.7rem' }}
                    >
                      <span style={{ width: 100, fontSize: '0.8rem', color: 'var(--muted)', flexShrink: 0 }}>{z.zone}</span>
                      <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${z.strength}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.08 + 0.2 }}
                          style={{ height: '100%', background: c.text, borderRadius: 999 }}
                        />
                      </div>
                      <span style={{ width: 32, fontSize: '0.8rem', fontWeight: 700, color: c.text }}>{z.strength}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Raid stats */}
              <div className="grid-3">
                {[
                  { label: 'Total Raids', val: playerData.attackZones.reduce((s, z) => s + (z.raids || 0), 0), color: 'var(--primary)' },
                  { label: `${playerData.dominantZone} Success`, val: `${playerData.attackZones.find(z => z.zone === playerData.dominantZone)?.successRate ?? 0}%`, color: '#2A7D4F' },
                  { label: `${playerData.weakZone} Success`, val: `${playerData.attackZones.find(z => z.zone === playerData.weakZone)?.successRate ?? 0}%`, color: '#DC2626' },
                ].map(s => (
                  <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.8rem', color: s.color }}>{s.val}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Team mode content */}
          {mode === 'team' && teamData && active && (
            <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {/* Team header */}
              <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #2A7D4F' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>{teamData.team}</h2>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Defensive Zone Analysis</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(() => {
                      const weak = [...teamData.defensiveZones].sort((a, b) => a.tackleSuccess - b.tackleSuccess)[0];
                      const strong = [...teamData.defensiveZones].sort((a, b) => b.tackleSuccess - a.tackleSuccess)[0];
                      return <>
                        <span className="pill pill-orange">🎯 Exploit: {weak.zone}</span>
                        <span className="pill pill-red">🚫 Avoid: {strong.zone}</span>
                      </>;
                    })()}
                  </div>
                </div>
              </div>

              {/* Defensive court heatmap */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>
                  Defensive Zone Map — From Your Raider's Perspective
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>Green = fortress (avoid) | Orange = exploit this zone</p>
                <div style={{ position: 'relative', maxWidth: 540, margin: '0 auto' }}>
                  <div style={{ border: '2px solid #EEECE8', borderRadius: 8, padding: '1rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '50%', top: '1rem', bottom: '1rem', width: 2, background: 'rgba(42,125,79,0.3)', transform: 'translateX(-50%)' }} />
                    <div className="court" style={{ position: 'relative', zIndex: 1 }}>
                      {teamData.defensiveZones.map((z, i) => (
                        <CourtCell
                          key={z.zone}
                          zone={z.zone}
                          strength={z.tackleSuccess}
                          tackles={0}
                          successRate={z.tackleSuccess}
                          delay={i * 0.08}
                          active={active}
                          mode="team"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Zone bar breakdown */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem' }}>Defensive Strength by Zone</h3>
                {sortedZones.map((z, i) => {
                  const c = defenseZoneColor(z.tackleSuccess);
                  return (
                    <motion.div key={z.zone}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.7rem' }}
                    >
                      <span style={{ width: 120, fontSize: '0.8rem', color: 'var(--muted)', flexShrink: 0 }}>{z.zone}</span>
                      <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${z.tackleSuccess}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.08 + 0.2 }}
                          style={{ height: '100%', background: c.text, borderRadius: 999 }}
                        />
                      </div>
                      <span style={{ width: 32, fontSize: '0.8rem', fontWeight: 700, color: c.text }}>{z.tackleSuccess}</span>
                      <span className={`pill pill-${z.tackleSuccess >= 70 ? 'green' : z.tackleSuccess >= 50 ? 'amber' : 'orange'}`} style={{ fontSize: '0.65rem' }}>
                        {z.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Zone recommendation strip */}
              <div className="grid-3">
                {(() => {
                  const sorted = [...teamData.defensiveZones].sort((a, b) => a.tackleSuccess - b.tackleSuccess);
                  const best = sorted[0];
                  const avoid = sorted[sorted.length - 1];
                  return [
                    { icon: '🎯', title: 'Best Zone to Attack', text: `${best.zone} — only ${best.tackleSuccess}% tackle success` },
                    { icon: '🚫', title: 'Zones to Avoid', text: `${avoid.zone} — ${avoid.tackleSuccess}% tackle success (fortress)` },
                    { icon: '⚡', title: 'Optimal Raid Style', text: 'Target the low-tackle zones with ankle-level raids for maximum impact' },
                  ].map(c => (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderTop: '3px solid var(--primary)',
                        borderRadius: 'var(--radius-card)',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{c.icon}</div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>{c.title}</h4>
                      <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.55 }}>{c.text}</p>
                    </motion.div>
                  ));
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
