import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getPlayer, searchPlayers } from '../api/kabaddiiq';
import ErrorMessage from '../components/ErrorMessage';

const SkeletonHuge = () => (
  <motion.div 
    animate={{ opacity: [0.3, 0.6, 0.3] }} 
    transition={{ duration: 1.5, repeat: Infinity }}
    className="skeleton-huge"
    style={{ height: '600px', width: '100%' }}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '180px', paddingBottom: '120px' }}>
      {/* ── Search Header ── */}
      <div style={{ marginBottom: '8rem' }}>
        <span className="section-label">PERSONNEL ANALYSIS</span>
        <h1 style={{ fontSize: '6rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-0.05em' }}>
          PLAYER <span className="gradient-text">VALUATION.</span>
        </h1>
        
        <div style={{ position: 'relative', maxWidth: '1000px' }}>
          <input
            className="card-premium"
            style={{ 
              width: '100%', fontSize: '1.6rem', padding: '40px 50px', 
              background: 'white', color: '#0F172A', border: '1px solid var(--border)',
              outline: 'none', transition: 'all 0.3s', borderRadius: '32px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
            }}
            placeholder="Search for any player..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="card-premium"
                style={{ 
                  position: 'absolute', top: '105%', left: 0, width: '100%', zIndex: 100,
                  maxHeight: '400px', overflowY: 'auto', padding: '1.5rem',
                  border: '1px solid rgba(255, 107, 53, 0.2)', background: 'white'
                }}
              >
                {suggestions.map(s => (
                  <div 
                    key={s} 
                    onClick={() => selectPlayer(s)}
                    style={{ padding: '1.5rem', cursor: 'pointer', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', transition: 'all 0.2s' }}
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

      {loading && <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}><SkeletonHuge /><SkeletonHuge /></div>}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && player && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
            
            {/* ── Main Bio & Energy Core ── */}
            <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '5rem', background: 'white' }}>
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
                <h2 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1, color: '#0F172A' }}>{player.name}</h2>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <span className="btn-cta btn-glass" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>{player.team}</span>
                  <span className="btn-cta btn-primary" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>{player.tier}</span>
                </div>
              </div>
            </div>

            {/* ── Performance Drivers ── */}
            <div className="card-premium" style={{ background: 'white' }}>
              <span className="section-label">AI EXPLAINABILITY</span>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: '#0F172A' }}>VALUATION DRIVERS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {Object.entries(player.shap).map(([key, val], i) => (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 700, color: '#475569', fontSize: '1.1rem' }}>{key.replace(/_/g, ' ').toUpperCase()}</span>
                      <span style={{ color: val > 0 ? 'var(--secondary)' : '#EF4444', fontWeight: 900, fontSize: '1.2rem' }}>
                        {val > 0 ? '+' : ''}{val.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.abs(val) * 12, 100)}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1 }}
                        style={{ 
                          height: '100%', 
                          background: val > 0 ? 'var(--secondary)' : '#EF4444',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Trend Analysis ── */}
          <div className="card-premium" style={{ background: 'white' }}>
            <span className="section-label">LONG-TERM PERFORMANCE</span>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '4rem', color: '#0F172A' }}>SEASONAL TRAJECTORY</h3>
            <div style={{ height: '500px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={player.season_trend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="season" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 14, fontWeight: 600 }} dy={10} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 14, fontWeight: 600 }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ background: 'white', border: 'none', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '1rem' }}
                    itemStyle={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem' }}
                    labelStyle={{ color: '#64748B', fontWeight: 700, marginBottom: '0.5rem' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="valuation_score" 
                    stroke="var(--primary)" 
                    strokeWidth={6} 
                    dot={{ r: 8, fill: 'white', stroke: 'var(--primary)', strokeWidth: 4 }} 
                    activeDot={{ r: 12, strokeWidth: 0, fill: 'var(--primary)', shadow: '0 0 20px var(--primary)' }}
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
