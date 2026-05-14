import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlayerZone } from '../api/kabaddiiq';
import ErrorMessage from '../components/ErrorMessage';

const SkeletonHuge = () => (
  <motion.div 
    animate={{ opacity: [0.3, 0.6, 0.3] }} 
    transition={{ duration: 1.5, repeat: Infinity }}
    className="skeleton-huge"
    style={{ height: '600px', width: '100%' }}
  />
);

const ZONES = [
  { id: 'left-corner', label: 'L Corner', x: '10%', y: '20%' },
  { id: 'left-in', label: 'L In', x: '30%', y: '30%' },
  { id: 'center', label: 'Center', x: '50%', y: '40%' },
  { id: 'right-in', label: 'R In', x: '70%', y: '30%' },
  { id: 'right-corner', label: 'R Corner', x: '90%', y: '20%' },
];

export default function ZoneIntelligence() {
  const [mode, setMode] = useState('player'); // 'player' or 'team'
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Mocking data since the backend doesn't have full zone spatial data yet
    setLoading(true);
    setTimeout(() => {
      setData({
        name: mode === 'player' ? 'Naveen Kumar' : 'Jaipur Pink Panthers',
        type: mode === 'player' ? 'Raider' : 'Team',
        zones: {
          'left-corner': 85,
          'left-in': 65,
          'center': 40,
          'right-in': 30,
          'right-corner': 45
        }
      });
      setLoading(false);
    }, 600);
  }, [mode]);

  const getHeatColor = (score) => {
    if (score > 75) return 'var(--primary)'; // Hot/Strong
    if (score > 50) return '#F59E0B'; // Medium
    return '#E2E8F0'; // Cold/Weak
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '180px', paddingBottom: '120px' }}>
      
      {/* ── Header ── */}
      <header style={{ marginBottom: '6rem', textAlign: 'center' }}>
        <span className="section-label">SPATIAL MAPPING</span>
        <h1 style={{ fontSize: '6rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.05em', color: '#0F172A' }}>
          ZONE <span className="gradient-text">INTELLIGENCE.</span>
        </h1>
        
        <div style={{ display: 'inline-flex', background: 'white', padding: '8px', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
          <button
            onClick={() => setMode('player')}
            style={{
              padding: '16px 40px', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s',
              background: mode === 'player' ? '#0F172A' : 'transparent', color: mode === 'player' ? 'white' : '#64748B'
            }}
          >
            PLAYER HEATMAP
          </button>
          <button
            onClick={() => setMode('team')}
            style={{
              padding: '16px 40px', borderRadius: '16px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s',
              background: mode === 'team' ? '#0F172A' : 'transparent', color: mode === 'team' ? 'white' : '#64748B'
            }}
          >
            TEAM VULNERABILITY
          </button>
        </div>
      </header>

      {loading && <SkeletonHuge />}

      {!loading && data && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          
          <div className="card-premium" style={{ background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '3rem', color: '#0F172A' }}>{data.name}</h2>
              <span className="section-label" style={{ marginTop: '0.5rem' }}>{mode === 'player' ? 'DOMINANT ZONES' : 'DEFENSIVE BLIND SPOTS'}</span>
            </div>

            {/* ── Kabaddi Court Heatmap ── */}
            <div style={{ 
              position: 'relative', width: '100%', maxWidth: '1000px', height: '500px', 
              background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '24px', overflow: 'hidden' 
            }}>
              {/* Midline */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '4px', background: '#CBD5E1', transform: 'translateX(-50%)' }} />
              
              {/* Baulk Lines */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '20%', width: '2px', background: '#E2E8F0' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, right: '20%', width: '2px', background: '#E2E8F0' }} />

              {/* Bonus Lines */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '10%', width: '2px', background: '#E2E8F0', borderStyle: 'dashed' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, right: '10%', width: '2px', background: '#E2E8F0', borderStyle: 'dashed' }} />

              {/* Heat Zones */}
              {ZONES.map((zone, i) => {
                const score = data.zones[zone.id];
                const color = getHeatColor(score);
                return (
                  <motion.div
                    key={zone.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    style={{
                      position: 'absolute',
                      left: zone.x,
                      top: zone.y,
                      width: '180px',
                      height: '180px',
                      transform: 'translate(-50%, -50%)',
                      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ background: 'white', padding: '8px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>{score}%</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{zone.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Analysis Legend ── */}
            <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', background: '#F8FAFC', padding: '1.5rem 3rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '6px' }} />
                <span style={{ fontWeight: 700, color: '#475569' }}>HIGH SUCCESS (&gt;75%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '20px', height: '20px', background: '#F59E0B', borderRadius: '6px' }} />
                <span style={{ fontWeight: 700, color: '#475569' }}>MODERATE (50-75%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '20px', height: '20px', background: '#E2E8F0', borderRadius: '6px' }} />
                <span style={{ fontWeight: 700, color: '#475569' }}>WEAK (&lt;50%)</span>
              </div>
            </div>

          </div>

        </motion.div>
      )}
    </motion.div>
  );
}
