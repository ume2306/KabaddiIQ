import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { leaderboard, hiddenGems, risingStars, teamStrengths } from '../data/league';

export default function LeagueOverview() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [timeframe, setTimeframe] = useState('This Season');

  const filteredLeaderboard = leaderboard.filter(p => 
    filter === 'All' || p.position === (filter === 'Raiders' ? 'Raider' : 'Defender')
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container"
      style={{ paddingTop: '4rem', paddingBottom: '8rem' }}
    >
      {/* ── Section 1: Header ─────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>League <span className="text-gradient">Overview</span></h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>
          Season 10 — AI-powered rankings, hidden gems, and rising stars
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          {/* Position Toggle */}
          <div style={{ background: '#EEECE8', padding: '4px', borderRadius: 'var(--radius-pill)', display: 'flex', position: 'relative' }}>
            {['All', 'Raiders', 'Defenders'].map(opt => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: filter === opt ? 'white' : 'transparent',
                  color: filter === opt ? 'var(--primary)' : 'var(--muted)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: filter === opt ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Timeframe Toggle */}
          <div style={{ background: '#EEECE8', padding: '4px', borderRadius: 'var(--radius-pill)', display: 'flex' }}>
            {['This Season', 'All Time'].map(opt => (
              <button
                key={opt}
                onClick={() => setTimeframe(opt)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: timeframe === opt ? 'var(--primary)' : 'transparent',
                  color: timeframe === opt ? 'white' : 'var(--muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 2: Leaderboard ────────────── */}
      <section style={{ marginBottom: '6rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Performance Rankings</h2>
        <div className="glass-card" style={{ padding: '1rem', overflow: 'hidden' }}>
          {filteredLeaderboard.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/player?search=${player.name}`)}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 1fr',
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                borderBottom: index === filteredLeaderboard.length - 1 ? 'none' : '1px solid var(--border)',
                cursor: 'pointer',
                background: player.rank === 1 ? '#FFF5F0' : (player.rank <= 3 ? '#FFFBF0' : 'transparent'),
                transition: 'all 0.2s ease',
                borderLeft: '4px solid transparent'
              }}
              whileHover={{ borderLeftColor: 'var(--primary)', background: '#F9F9F9' }}
            >
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: 800, 
                color: player.rank <= 3 ? 'var(--primary)' : 'var(--muted)',
                fontFamily: 'var(--font-heading)'
              }}>
                #{player.rank}
              </span>
              
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{player.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{player.team}</div>
              </div>

              <span className={`pill pill-${player.position === 'Raider' ? 'orange' : 'green'}`} style={{ width: 'fit-content' }}>
                {player.position}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{player.score}</div>
                <div style={{ width: '60px', height: '4px', background: '#EEECE8', borderRadius: '2px' }}>
                  <div style={{ width: `${player.score}%`, height: '100%', background: 'var(--primary)', borderRadius: '2px' }} />
                </div>
              </div>

              <span style={{ 
                color: player.tier === 'Elite' ? 'var(--primary)' : 'var(--text)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                {player.tier}
              </span>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ 
                  color: player.form === 'rising' ? '#10B981' : (player.form === 'falling' ? '#EF4444' : '#F5A623'),
                  fontSize: '1.2rem'
                }}>
                  {player.form === 'rising' ? '↑' : (player.form === 'falling' ? '↓' : '→')}
                </span>
                <span style={{ 
                  background: player.change.startsWith('+') ? '#E8F5E9' : (player.change.startsWith('-') ? '#FFEBEE' : '#F5F5F5'),
                  color: player.change.startsWith('+') ? '#2E7D32' : (player.change.startsWith('-') ? '#C62828' : '#616161'),
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {player.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Hidden Gems ───────────── */}
      <section style={{ marginBottom: '6rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            💎 Hidden Gems
          </h2>
          <p style={{ color: 'var(--muted)' }}>High performance, low recognition — fantasy gold</p>
        </div>
        
        <div className="grid-2" style={{ gap: '2rem' }}>
          {hiddenGems.map((gem, i) => (
            <motion.div
              key={gem.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
              style={{ padding: '2rem', borderLeft: '6px solid #10B981' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{gem.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{gem.team}</span>
                    <span className="pill pill-green" style={{ fontSize: '0.7rem' }}>{gem.position}</span>
                  </div>
                </div>
                <div style={{ 
                  background: '#E8F5E9', 
                  color: '#2E7D32', 
                  padding: '4px 12px', 
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>
                  Gap: +{gem.gap}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Score</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{gem.score}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recognition</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--muted)' }}>{gem.recognition}%</div>
                </div>
              </div>

              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{gem.reason}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Rising Stars ──────────── */}
      <section style={{ marginBottom: '6rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2>Rising Stars</h2>
          <p style={{ color: 'var(--muted)' }}>Players showing strongest growth trajectory</p>
        </div>

        <div className="grid-3" style={{ gap: '2rem' }}>
          {risingStars.map((star, i) => (
            <motion.div
              key={star.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
              style={{ padding: '2rem' }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{star.name}</h3>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{star.team}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <span style={{ 
                  background: 'rgba(232, 97, 44, 0.1)', 
                  color: 'var(--primary)', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700 
                }}>
                  +{star.growthRate}% / season
                </span>
                <span style={{ 
                  background: '#FFF8E1', 
                  color: '#F57F17', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700 
                }}>
                  Breakout Potential
                </span>
              </div>

              <div style={{ height: '120px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={star.trajectory.map((val, idx) => ({ val, idx }))}>
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke="var(--primary)" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: 'var(--primary)' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 5: Team Strength Index ───── */}
      <section>
        <h2 style={{ marginBottom: '3rem' }}>Team Strength Index</h2>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamStrengths} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#EEECE8" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="team" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 500 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="raiderStrength" name="Raider Strength" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="defenderStrength" name="Defender Strength" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ 
            marginTop: '3rem', 
            padding: '2rem', 
            background: 'var(--grad-primary)', 
            borderRadius: '20px', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>OVERALL STRONGEST TEAM</div>
              <h3 style={{ fontSize: '2rem' }}>{teamStrengths.sort((a, b) => b.overall - a.overall)[0].team}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800 }}>{teamStrengths.sort((a, b) => b.overall - a.overall)[0].overall}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>INDEX SCORE</div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
