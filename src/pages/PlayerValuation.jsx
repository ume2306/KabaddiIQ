import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getPlayer, searchPlayers } from '../api/kabaddiiq';
import SkeletonCard from '../components/SkeletonCard';
import ErrorMessage from '../components/ErrorMessage';

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
      setError(err.response?.status === 404 ? "Player not found in our database." : "Could not connect to analysis server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Player <span className="text-gradient">Valuation</span></h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2.5rem' }}>AI-driven performance metrics for every PKL player</p>
        
        <div style={{ position: 'relative' }}>
          <input
            className="chat-input"
            style={{ width: '100%', fontSize: '1.1rem', padding: '20px 30px' }}
            placeholder="Enter player name (e.g. Naveen Kumar)"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card"
                style={{ 
                  position: 'absolute', top: '110%', left: 0, width: '100%', zIndex: 100,
                  maxHeight: '300px', overflowY: 'auto', textAlign: 'left', padding: '0.5rem'
                }}
              >
                {suggestions.map(s => (
                  <div 
                    key={s} 
                    onClick={() => selectPlayer(s)}
                    style={{ padding: '1rem', cursor: 'pointer', borderRadius: '12px' }}
                    className="nav-link"
                  >
                    {s}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {loading && <div className="grid-2"><SkeletonCard height={400} /><SkeletonCard height={400} /></div>}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && player && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
            {/* Score Card */}
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                <svg width="200" height="200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#EEECE8" strokeWidth="12" />
                  <motion.circle
                    cx="100" cy="100" r="90" fill="none" stroke="var(--primary)" strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 90}
                    initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 90) * (1 - player.valuation_score / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div style={{ 
                  position: 'absolute', top: '50%', left: '50%', 
                  transform: 'translate(-50%, -50%)', textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                    {player.valuation_score}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>AI Score</div>
                </div>
              </div>
              
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{player.name}</h2>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <span className="pill pill-orange">{player.team}</span>
                <span className="pill pill-green">{player.tier}</span>
                <span className={`pill pill-${player.form === 'rising' ? 'green' : 'orange'}`}>Form: {player.form}</span>
              </div>
            </div>

            {/* SHAP / Contributions */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Valuation Drivers (SHAP)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {Object.entries(player.shap).map(([key, val], i) => (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                      <span style={{ color: val > 0 ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                        {val > 0 ? '+' : ''}{val.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ height: '8px', background: '#EEECE8', borderRadius: '4px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.abs(val) * 10, 100)}%` }}
                        style={{ 
                          height: '100%', 
                          background: val > 0 ? '#10B981' : '#EF4444',
                          marginLeft: val > 0 ? '0' : 'auto'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Trend */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '2rem' }}>Career Trajectory</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={player.season_trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEECE8" />
                  <XAxis dataKey="season" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="valuation_score" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: 'var(--primary)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
