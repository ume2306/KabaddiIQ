import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getLeagueOverview } from '../api/kabaddiiq';
import ErrorMessage from '../components/ErrorMessage';

const SkeletonTable = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {[1,2,3,4,5].map(i => <div key={i} style={{ height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }} />)}
  </div>
);

export default function LeagueOverview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const res = await getLeagueOverview();
        setData(res);
      } catch (err) {
        setError("Failed to load league data.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeague();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '160px', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '6rem' }}>
        <span className="section-label">GLOBAL RANKINGS</span>
        <h1 style={{ fontSize: '5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
          LEAGUE <span className="gradient-text">PULSE.</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
          Real-time performance rankings across all franchises. Powered by our proprietary valuation engine.
        </p>
      </header>

      {loading && <SkeletonTable />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data && (
        <section style={{ marginBottom: '8rem' }}>
          <div className="card-premium" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ 
              display: 'grid', gridTemplateColumns: '100px 2fr 1fr 1.5fr 1fr', 
              padding: '2rem 3rem', background: 'rgba(255,255,255,0.02)', 
              fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em' 
            }}>
              <span>RANK</span>
              <span>PLAYER</span>
              <span>TIER</span>
              <span>AI VALUATION</span>
              <span>FORM</span>
            </div>
            
            {data.top10.map((player, idx) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/player?search=${player.name}`)}
                className="table-row-premium"
                style={{
                  display: 'grid', gridTemplateColumns: '100px 2fr 1fr 1.5fr 1fr',
                  alignItems: 'center', padding: '2.5rem 3rem', cursor: 'pointer',
                  borderTop: '1px solid var(--border)', transition: 'all 0.3s'
                }}
              >
                <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: idx < 3 ? 'var(--primary)' : 'white' }}>
                  {idx + 1}
                </span>
                
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>{player.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{player.team}</div>
                </div>

                <span className={`pill pill-${player.tier === 'Elite' ? 'orange' : 'green'}`} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                  {player.tier}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', width: '60px' }}>{player.valuation_score}</span>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ width: `${player.valuation_score}%`, height: '100%', background: 'var(--primary)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: player.form === 'rising' ? 'var(--secondary)' : '#FF4B4B', fontSize: '1.5rem' }}>
                    {player.form === 'rising' ? '↑' : '↓'}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>{player.form}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Season Highlights ── */}
      <section className="grid-2" style={{ gap: '3rem' }}>
        <div className="card-premium">
          <span className="section-label">TOP RAIDER</span>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>NAVEEN KUMAR</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Maintained Elite tier for 4 consecutive seasons with 73% raid success.</p>
          <div className="btn-cta btn-primary" style={{ padding: '12px 24px', fontSize: '0.8rem' }}>VIEW PROFILE</div>
        </div>
        <div className="card-premium">
          <span className="section-label">CLUTCH DEFENDER</span>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>FAZEL ATRACHALI</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Highest tackle efficiency in death minutes (35-40) this season.</p>
          <div className="btn-cta btn-glass" style={{ padding: '12px 24px', fontSize: '0.8rem' }}>VIEW PROFILE</div>
        </div>
      </section>
    </motion.div>
  );
}
