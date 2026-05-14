import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getLeagueOverview } from '../api/kabaddiiq';
import ErrorMessage from '../components/ErrorMessage';

const SkeletonTable = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    {[1,2,3,4,5].map(i => (
      <div key={i} className="skeleton-huge" style={{ height: '120px', borderRadius: '24px' }} />
    ))}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '180px', paddingBottom: '120px' }}>
      <header style={{ marginBottom: '8rem' }}>
        <span className="section-label">GLOBAL RANKINGS</span>
        <h1 style={{ fontSize: '6rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-0.05em', color: '#0F172A' }}>
          LEAGUE <span className="gradient-text">PULSE.</span>
        </h1>
        <p style={{ fontSize: '1.6rem', color: 'var(--text-muted)', maxWidth: '800px', lineHeight: 1.4 }}>
          Real-time performance rankings across all franchises. Powered by our proprietary valuation engine.
        </p>
      </header>

      {loading && <SkeletonTable />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data && (
        <section style={{ marginBottom: '10rem' }}>
          <div className="card-premium" style={{ padding: '0', background: 'white' }}>
            <div style={{ 
              display: 'grid', gridTemplateColumns: '120px 2.5fr 1.5fr 2fr 1fr', 
              padding: '2.5rem 4rem', background: '#F8FAFC', 
              fontSize: '1rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.15em' 
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
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/player?search=${player.name}`)}
                className="table-row-premium"
                style={{
                  display: 'grid', gridTemplateColumns: '120px 2.5fr 1.5fr 2fr 1fr',
                  alignItems: 'center', padding: '3rem 4rem', cursor: 'pointer',
                  borderTop: '1px solid var(--border)', transition: 'all 0.3s',
                  background: 'white'
                }}
              >
                <span style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: idx < 3 ? 'var(--primary)' : '#94A3B8' }}>
                  {idx + 1}
                </span>
                
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px', color: '#0F172A' }}>{player.name}</div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{player.team}</div>
                </div>

                <span className={`btn-cta btn-${player.tier === 'Elite' ? 'primary' : 'glass'}`} style={{ padding: '8px 20px', fontSize: '0.9rem', width: 'fit-content' }}>
                  {player.tier}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingRight: '2rem' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', width: '70px' }}>{player.valuation_score}</span>
                  <div style={{ flex: 1, height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${player.valuation_score}%`, height: '100%', background: 'var(--primary)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: player.form === 'rising' ? 'var(--secondary)' : '#EF4444', fontSize: '1.8rem', fontWeight: 900 }}>
                    {player.form === 'rising' ? '↑' : '↓'}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>{player.form}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Season Highlights ── */}
      <section className="grid-2" style={{ gap: '4rem' }}>
        <div className="card-premium" style={{ background: 'white' }}>
          <span className="section-label">TOP RAIDER</span>
          <h3 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: '#0F172A' }}>NAVEEN KUMAR</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: 1.5 }}>
            Maintained Elite tier for 4 consecutive seasons with an unparalleled 73% raid success rate.
          </p>
          <div className="btn-cta btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>VIEW PROFILE</div>
        </div>
        <div className="card-premium" style={{ background: 'white' }}>
          <span className="section-label">CLUTCH DEFENDER</span>
          <h3 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: '#0F172A' }}>FAZEL ATRACHALI</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: 1.5 }}>
            Highest tackle efficiency in death minutes (35-40) this season. A true defensive anchor.
          </p>
          <div className="btn-cta btn-glass" style={{ padding: '16px 32px', fontSize: '1rem' }}>VIEW PROFILE</div>
        </div>
      </section>
    </motion.div>
  );
}
