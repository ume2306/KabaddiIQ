import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getH2H, searchPlayers } from '../api/kabaddiiq';
import ErrorMessage from '../components/ErrorMessage';

const SkeletonHuge = () => (
  <motion.div 
    animate={{ opacity: [0.3, 0.6, 0.3] }} 
    transition={{ duration: 1.5, repeat: Infinity }}
    className="skeleton-huge"
    style={{ height: '500px', width: '100%' }}
  />
);

export default function HeadToHead() {
  const [raider, setRaider] = useState('Naveen Kumar');
  const [defender, setDefender] = useState('Fazel Atrachali');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For now, we mock the H2H data since the backend API for /h2h isn't fully implemented in app.py
    // We will simulate a fetch delay and provide premium dummy data
    const fetchH2H = async () => {
      setLoading(true);
      setTimeout(() => {
        setData({
          raider: { name: raider, score: 87, team: 'Dabang Delhi KC' },
          defender: { name: defender, score: 83, team: 'UP Yoddhas' },
          totalEncounters: 24,
          raiderWins: 14,
          defenderWins: 10,
          probability: 58.3
        });
        setLoading(false);
      }, 800);
    };
    fetchH2H();
  }, [raider, defender]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '180px', paddingBottom: '120px' }}>
      
      {/* ── Header ── */}
      <header style={{ marginBottom: '6rem', textAlign: 'center' }}>
        <span className="section-label">DUEL ANALYSIS</span>
        <h1 style={{ fontSize: '6rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.05em', color: '#0F172A' }}>
          HEAD TO <span className="gradient-text">HEAD.</span>
        </h1>
        <p style={{ fontSize: '1.6rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto' }}>
          Simulate matchups between elite raiders and defenders.
        </p>
      </header>

      {loading && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}><SkeletonHuge /><SkeletonHuge /></div>}
      
      {!loading && data && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          
          <div className="card-premium" style={{ background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6rem 4rem' }}>
            
            {/* ── VS Display ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem', width: '100%', marginBottom: '6rem' }}>
              
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span className="section-label" style={{ color: 'var(--primary)' }}>RAIDER</span>
                <h2 style={{ fontSize: '3.5rem', color: '#0F172A', marginBottom: '1rem', lineHeight: 1.1 }}>{data.raider.name}</h2>
                <span className="btn-cta btn-glass" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>{data.raider.team}</span>
              </div>

              <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', background: '#F8FAFC', 
                border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 900, color: '#94A3B8', flexShrink: 0,
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
              }}>
                VS
              </div>

              <div style={{ flex: 1, textAlign: 'left' }}>
                <span className="section-label" style={{ color: 'var(--secondary)' }}>DEFENDER</span>
                <h2 style={{ fontSize: '3.5rem', color: '#0F172A', marginBottom: '1rem', lineHeight: 1.1 }}>{data.defender.name}</h2>
                <span className="btn-cta btn-glass" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>{data.defender.team}</span>
              </div>

            </div>

            {/* ── Win Probability Ring ── */}
            <div style={{ position: 'relative', width: '400px', height: '400px', marginBottom: '4rem' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                <motion.circle 
                  cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="8" 
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * (data.probability / 100)) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '6rem', fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                  {data.probability}%
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.1em' }}>
                  RAIDER WIN PROBABILITY
                </div>
              </div>
            </div>

            {/* ── Historical Encounters ── */}
            <div style={{ display: 'flex', gap: '2rem', width: '100%', maxWidth: '800px' }}>
              <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '24px', padding: '2.5rem', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#64748B', marginBottom: '1rem' }}>RAIDER WINS</div>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)' }}>{data.raiderWins}</div>
              </div>
              <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '24px', padding: '2.5rem', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#64748B', marginBottom: '1rem' }}>TOTAL DUELS</div>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: '#0F172A' }}>{data.totalEncounters}</div>
              </div>
              <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '24px', padding: '2.5rem', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#64748B', marginBottom: '1rem' }}>DEFENDER WINS</div>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--secondary)' }}>{data.defenderWins}</div>
              </div>
            </div>

          </div>

        </motion.div>
      )}
    </motion.div>
  );
}
