import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTeams, getOpponent } from '../api/kabaddiiq';
import ErrorMessage from '../components/ErrorMessage';

const SkeletonHuge = () => (
  <motion.div 
    animate={{ opacity: [0.3, 0.6, 0.3] }} 
    transition={{ duration: 1.5, repeat: Infinity }}
    className="skeleton-huge"
    style={{ height: '500px', width: '100%' }}
  />
);

export default function OpponentIntel() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await getTeams();
        setTeams(res);
        if (res.length > 0) handleSelect(res[0]);
      } catch (err) {
        setError("Failed to load team list.");
      }
    };
    fetchTeams();
  }, []);

  const handleSelect = async (teamName) => {
    setSelectedTeam(teamName);
    setLoading(true);
    setError(null);
    try {
      const data = await getOpponent(teamName);
      setTeamData(data);
    } catch (err) {
      setError("Failed to load opponent data.");
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts since we only have aggregates from backend currently
  const scoringPace = [
    { minute: 0, points: 2 }, { minute: 10, points: 8 }, { minute: 20, points: 18 },
    { minute: 30, points: 25 }, { minute: 40, points: 36 }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '180px', paddingBottom: '120px' }}>
      
      {/* ── Header & Team Selector ── */}
      <header style={{ marginBottom: '6rem' }}>
        <span className="section-label">TEAM SCOUTING</span>
        <h1 style={{ fontSize: '6rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-0.05em', color: '#0F172A' }}>
          OPPONENT <span className="gradient-text">INTEL.</span>
        </h1>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', maxWidth: '1200px' }}>
          {teams.map(team => (
            <motion.button
              key={team}
              onClick={() => handleSelect(team)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px 32px',
                borderRadius: '16px',
                border: selectedTeam === team ? 'none' : '1px solid #E2E8F0',
                background: selectedTeam === team ? 'var(--primary)' : 'white',
                color: selectedTeam === team ? 'white' : '#64748B',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: selectedTeam === team ? '0 10px 20px rgba(255,107,53,0.3)' : '0 4px 6px rgba(0,0,0,0.02)',
                transition: 'all 0.3s'
              }}
            >
              {team}
            </motion.button>
          ))}
        </div>
      </header>

      {error && <ErrorMessage message={error} />}
      {loading && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}><SkeletonHuge /><SkeletonHuge /></div>}

      {!loading && !error && teamData && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', marginBottom: '4rem' }}>
            
            {/* ── Team Summary Card ── */}
            <div className="card-premium" style={{ background: 'white' }}>
              <h2 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#0F172A', lineHeight: 1.1 }}>{teamData.team}</h2>
              
              <div style={{ marginBottom: '3rem' }}>
                <span className="section-label">AVERAGE AI VALUATION</span>
                <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                  {teamData.avg_valuation?.toFixed(1) || 'N/A'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#64748B' }}>RAID SUCCESS (AVG)</span>
                    <span style={{ fontWeight: 900, color: '#0F172A' }}>{(teamData.avg_raid_success_rate * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px' }}>
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${teamData.avg_raid_success_rate * 100}%` }} 
                      style={{ height: '100%', background: 'var(--primary)', borderRadius: '4px' }} 
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#64748B' }}>TACKLE SUCCESS (AVG)</span>
                    <span style={{ fontWeight: 900, color: '#0F172A' }}>{(teamData.avg_tackle_success_rate * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px' }}>
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${teamData.avg_tackle_success_rate * 100}%` }} 
                      style={{ height: '100%', background: 'var(--secondary)', borderRadius: '4px' }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Scoring Pace Chart ── */}
            <div className="card-premium" style={{ background: 'white' }}>
              <span className="section-label">MATCH PROGRESSION</span>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: '#0F172A' }}>SCORING PACE</h3>
              <div style={{ height: '400px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoringPace} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="minute" tickFormatter={(v) => `${v}m`} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600, fontSize: 14 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontWeight: 600, fontSize: 14 }} />
                    <Tooltip 
                      contentStyle={{ background: 'white', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      labelStyle={{ color: '#64748B', fontWeight: 700 }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: 800 }}
                    />
                    <Area type="monotone" dataKey="points" stroke="var(--primary)" strokeWidth={5} fillOpacity={1} fill="url(#colorPoints)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Tactical Brief ── */}
          <div className="card-premium" style={{ background: 'white' }}>
            <span className="section-label">AI TACTICAL BRIEF</span>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#0F172A' }}>EXPLOIT OPPORTUNITIES</h3>
            <div className="grid-3" style={{ gap: '3rem' }}>
              <div style={{ padding: '2.5rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>Right Cover Vulnerability</h4>
                <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.5 }}>Opponent shows a 15% drop in tackle success when attacked from the right side. Target this zone with left-raiders.</p>
              </div>
              <div style={{ padding: '2.5rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>Do-or-Die Dependency</h4>
                <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.5 }}>Highly reliant on Do-or-Die raids. Playing a deep defensive line on 3rd raids increases their error rate by 22%.</p>
              </div>
              <div style={{ padding: '2.5rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏱️</div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>Late Half Slump</h4>
                <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.5 }}>Scoring pace drops significantly between minutes 15-20. Optimal window to deploy aggressive multi-point raid strategies.</p>
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </motion.div>
  );
}
