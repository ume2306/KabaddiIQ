import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '100px' }}
    >
      {/* ── Huge Hero Section ──────────────────── */}
      <section className="container" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '1000px', position: 'relative', zIndex: 10 }}
        >
          <span className="section-label">INTELLIGENCE MAT</span>
          <h1 className="hero-text">
            ELITE <span className="gradient-text">DATA</span><br />
            DOMINANCE.
          </h1>
          
          <p style={{ 
            fontSize: '1.4rem', 
            color: 'var(--text-muted)', 
            maxWidth: '650px', 
            marginBottom: '3rem',
            lineHeight: 1.4,
            fontWeight: 400
          }}>
            The world's first AI-driven intelligence layer for Pro Kabaddi. 
            Analyse every raid, predict every tackle, and scout with clinical precision.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/player" className="btn-cta btn-primary" style={{ textDecoration: 'none' }}>
              GET STARTED
            </Link>
            <Link to="/chat" className="btn-cta btn-glass" style={{ textDecoration: 'none' }}>
              RECRUIT AI AGENT
            </Link>
          </div>
        </motion.div>

        {/* ── Background Court Elements ──────────── */}
        <div style={{ position: 'absolute', right: '4rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, pointerEvents: 'none' }}>
          <div style={{ fontSize: '30rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>01</div>
        </div>
        <div className="baulk-line" style={{ top: '20%', left: '10%' }} />
        <div className="baulk-line" style={{ top: '60%', right: '10%' }} />
      </section>

      {/* ── Huge Feature Grid ──────────────────── */}
      <section className="container" style={{ paddingBottom: '10rem' }}>
        <span className="section-label">ANALYSIS MODULES</span>
        <div className="feature-grid-huge">
          {[
            { 
              num: '01', 
              title: 'PLAYER VALUATION', 
              desc: 'High-fidelity performance metrics using XGBoost and SHAP explainability layers.',
              link: '/player'
            },
            { 
              num: '02', 
              title: 'OPPONENT INTEL', 
              desc: 'Real-time scouting briefs with zone vulnerability heatmaps for every PKL franchise.',
              link: '/opponent'
            },
            { 
              num: '03', 
              title: 'ZONE MAPS', 
              desc: 'Spatial intelligence mapping of the mat. Identify where champions strike.',
              link: '/zone'
            },
            { 
              num: '04', 
              title: 'LEAGUE PULSE', 
              desc: 'Live leaderboard rankings and emerging hidden gems across 12 seasons.',
              link: '/league'
            }
          ].map((feat, i) => (
            <motion.div
              key={feat.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <Link to={feat.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-premium" style={{ height: '100%' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, opacity: 0.2, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                    {feat.num}
                  </div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>{feat.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{feat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Performance Stats Strip ────────────── */}
      <section style={{ borderTop: '1px solid var(--border)', background: 'rgba(255, 107, 53, 0.02)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '6rem 4rem' }}>
          {[
            { val: '12+', label: 'SEASONS' },
            { val: '500+', label: 'PLAYERS' },
            { val: '1.2M', label: 'RAID POINTS' },
            { val: '98%', label: 'ACCURACY' }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>{stat.val}</div>
              <div className="section-label" style={{ margin: 0 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
