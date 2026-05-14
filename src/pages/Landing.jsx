import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '110px' }}
    >
      {/* ── Massive Hero Section ────────────────── */}
      <section className="container" style={{ minHeight: '95vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '1200px', position: 'relative', zIndex: 10 }}
        >
          <span className="section-label">AI SCOUTING ENGINE</span>
          <h1 className="hero-text">
            ELITE <span className="gradient-text">DATA</span><br />
            INTEL.
          </h1>
          
          <p style={{ 
            fontSize: '1.8rem', 
            color: 'var(--text-muted)', 
            maxWidth: '800px', 
            marginBottom: '4.5rem',
            lineHeight: 1.3,
            fontWeight: 500
          }}>
            12 Seasons. 500+ Champions. One Intelligence Layer. <br />
            Dominate the mat with clinical precision and predictive AI.
          </p>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/player" className="btn-cta btn-primary" style={{ textDecoration: 'none' }}>
              ANALYSE PLAYER
            </Link>
            <Link to="/chat" className="btn-cta btn-glass" style={{ textDecoration: 'none' }}>
              RECRUIT AI
            </Link>
          </div>
        </motion.div>

        {/* ── Background Decals ── */}
        <div style={{ position: 'absolute', right: '5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.05, pointerEvents: 'none' }}>
          <div style={{ fontSize: '40rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>IQ</div>
        </div>
      </section>

      {/* ── Feature Grid (Huge) ── */}
      <section className="container" style={{ paddingBottom: '15rem' }}>
        <span className="section-label">SYSTEM MODULES</span>
        <div className="feature-grid-huge">
          {[
            { 
              num: '01', 
              title: 'PLAYER VALUATION', 
              desc: 'High-fidelity performance metrics using XGBoost and SHAP explainability. Identify true value.',
              link: '/player'
            },
            { 
              num: '02', 
              title: 'OPPONENT SCOUT', 
              desc: 'Real-time tactical briefs with zone vulnerability heatmaps for every PKL franchise.',
              link: '/opponent'
            },
            { 
              num: '03', 
              title: 'SPATIAL INTEL', 
              desc: 'Deep mapping of the mat. Identify strike zones and defensive blind spots with AI.',
              link: '/zone'
            },
            { 
              num: '04', 
              title: 'LEAGUE PULSE', 
              desc: 'Global leaderboards and breakout hidden gems across 12 seasons of match metadata.',
              link: '/league'
            }
          ].map((feat, i) => (
            <motion.div
              key={feat.num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 1 }}
            >
              <Link to={feat.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-premium">
                  <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)', opacity: 0.15, marginBottom: '2rem' }}>
                    {feat.num}
                  </div>
                  <h3 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#0F172A' }}>{feat.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', lineHeight: 1.4 }}>{feat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Data Strip ── */}
      <section style={{ borderTop: '1px solid var(--border)', background: 'white' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '10rem 5rem' }}>
          {[
            { val: '12+', label: 'PKL SEASONS' },
            { val: '500+', label: 'PLAYERS' },
            { val: '1.2M', label: 'DATA POINTS' },
            { val: '99%', label: 'ACCURACY' }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '5rem', fontWeight: 900, color: '#0F172A', marginBottom: '1rem', letterSpacing: '-0.05em' }}>{stat.val}</div>
              <span className="section-label" style={{ margin: 0 }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
