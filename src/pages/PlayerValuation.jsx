import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getPlayer, searchPlayers } from '../api/kabaddiiq';
import ErrorMessage from '../components/ErrorMessage';

const SkeletonHuge = () => (
  <motion.div 
    animate={{ opacity: [0.1, 0.2, 0.1] }} 
    transition={{ duration: 1.5, repeat: Infinity }}
    style={{ background: 'white', borderRadius: '32px', height: '600px', width: '100%', opacity: 0.1 }}
  />
);

export default function PlayerValuation() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (q) => {
    setQuery(q);
    if (q.length < 2) { setSuggestions([]); return; }
    try {
      const results = await searchPlayers(q);
      setSuggestions(results);
    } catch (err) { console.error(err); }
  };

  const selectPlayer = async (name) => {
    setQuery(name);
    setSuggestions([]);
    setLoading(true);
    setError(null);
    try {
      const data = await getPlayer(name);
      setPlayer(data);
    } catch (err) {
      setError(err.response?.status === 404 ? "Player not found." : "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '160px', paddingBottom: '100px' }}>
      {/* ── Search Header ── */}
      <div style={{ marginBottom: '6rem' }}>
        <span className="section-label">PERSONNEL ANALYSIS</span>
        <h1 style={{ fontSize: '5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
          PLAYER <span className="gradient-text">VALUATION.</span>
        </h1>
        
        <div style={{ position: 'relative', maxWidth: '800px' }}>
          <input
            className="card-premium"
            style={{ 
              width: '100%', fontSize: '1.4rem', padding: '30px 40px', 
              background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)',
              outline: 'none', transition: 'all 0.3s'
            }}
            placeholder="SEARCH PLAYER NAME..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card-premium"
                style={{ 
                  position: 'absolute', top: '105%', left: 0, width: '100%', zIndex: 100,
                  maxHeight: '400px', overflowY: 'auto', padding: '1rem',
                  border: '1px solid rgba(255, 107, 53, 0.2)'
                }}
              >
                {suggestions.map(s => (
                  <div 
                    key={s} 
                    onClick={() => selectPlayer(s)}
                    style={{ padding: '1.25rem', cursor: 'pointer', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 600 }}
                    className="nav-link-premium"
                  >
                    {s}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading && <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}><SkeletonHuge /><SkeletonHuge /></div>}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && player && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            
            {/* ── Main Bio & Energy Core ── */}
            <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
              <div className="energy-core">
                <div className="energy-ring" />
                <motion.div 
                  className="energy-fill" 
                  initial={{ clipPath: 'polygon(50% 50%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)' }}
                  animate={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${player.valuation_score > 12.5 ? '100% 0%' : '50% 0%'}, ${player.valuation_score > 37.5 ? '100% 100%' : '50% 100%'}, ${player.valuation_score > 62.5 ? '0% 100%' : '50% 100%'}, ${player.valuation_score > 87.5 ? '0% 0%' : '50% 0%'}, 50% 0%)` 
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <div className="energy-value">{player.valuation_score}</div>
              </div>

              <div>
                <span className="section-label" style={{ color: 'var(--text-muted)' }}>{player.position}</span>
                <h2 style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1 }}>{player.name}</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className="btn-cta btn-glass" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>{player.team}</span>
                  <span className="btn-cta btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>{player.tier}</span>
                  <span style={{ 
                    color: player.form === 'rising' ? 'var(--secondary)' : '#FF4B4B', 
                    fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' 
                  }}>
                    {player.form === 'rising' ? '↑' : '↓'} {player.form.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Performance Drivers ── */}
            <div className="card-premium">
              <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>VALUATION DRIVERS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {Object.entries(player.shap).map(([key, val], i) => (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{key.replace(/_/g, ' ').toUpperCase()}</span>
                      <span style={{ color: val > 0 ? 'var(--secondary)' : '#FF4B4B', fontWeight: 800 }}>
                        {val > 0 ? '+' : ''}{val.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.abs(val) * 12, 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        style={{ 
                          height: '100%', 
                          background: val > 0 ? 'var(--secondary)' : '#FF4B4B',
                          boxShadow: `0 0 10px ${val > 0 ? 'var(--secondary)' : '#FF4B4B'}50`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Trend Analysis ── */}
          <div className="card-premium">
            <h3 style={{ fontSize: '1.8rem', marginBottom: '3rem' }}>SEASONAL TRAJECTORY</h3>
            <div style={{ height: '400px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={player.season_trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="season" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ background: '#121214', border: '1px solid var(--border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--primary)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="valuation_score" 
                    stroke="var(--primary)" 
                    strokeWidth={5} 
                    dot={{ r: 8, fill: 'var(--primary)', stroke: 'white', strokeWidth: 3 }} 
                    activeDot={{ r: 10, shadow: '0 0 20px var(--primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
