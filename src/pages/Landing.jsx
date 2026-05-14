import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CounterStat from '../components/CounterStat';
import FeatureCard from '../components/FeatureCard';

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mesh-bg"
      style={{ position: 'relative' }}
    >
      <div className="mat-overlay" />
      
      {/* ── Hero Section ────────────────────────── */}
      <section className="container hero-content" style={{ minHeight: '90vh' }}>
        <div className="floating-elements">
          <div className="blob" style={{ background: 'var(--primary)', width: '400px', height: '400px', top: '10%', left: '10%' }} />
          <div className="blob" style={{ background: 'var(--secondary)', width: '300px', height: '300px', bottom: '20%', right: '10%' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="stat-pill" style={{ marginBottom: '2rem', display: 'inline-block' }}>
             PKL Analytics Platform
          </div>
          
          <h1 className="hero-title">
            WHERE <span className="text-gradient">DATA</span><br />
            MEETS THE MAT
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--muted)', 
            maxWidth: '600px', 
            margin: '2rem auto',
            lineHeight: 1.6
          }}>
            12 seasons. 500+ players. Every raid. Every tackle. <br />
            Deep-dive into Kabaddi intelligence powered by AI.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to="/player" className="btn-premium" style={{ textDecoration: 'none' }}>
              Analyse a Player
            </Link>
            <Link to="/opponent" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Scout an Opponent
            </Link>
          </div>
        </motion.div>

        {/* ── Animated Stats Row ──────────────────── */}
        <div className="grid-3 glass-card" style={{ 
          marginTop: '6rem', 
          width: '100%', 
          maxWidth: '1000px', 
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <CounterStat value={12} label="Seasons of Data" />
          <CounterStat value={500} suffix="+" label="PKL Players" />
          <CounterStat value={2} label="AI Modules" />
        </div>
      </section>

      {/* ── Features Section ─────────────────────── */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Built for the game. <span className="text-gradient">Powered by AI.</span></h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Advanced analytics modules for elite performance tracking.</p>
        </div>

        <div className="grid-3" style={{ gap: '2rem' }}>
          <FeatureCard 
            icon="🎯" 
            title="Player Valuation" 
            description="AI-powered scoring for every PKL player with SHAP explainability layers."
            link="Analyse Now"
          />
          <FeatureCard 
            icon="🛡️" 
            title="Opponent Intel" 
            description="Pre-match tactical briefs and zone vulnerability maps for every team."
            link="Scout Now"
          />
          <FeatureCard 
            icon="🗺️" 
            title="Zone Intelligence" 
            description="Deep heatmap analysis for raiding and defending zones across seasons."
            link="Explore Now"
          />
        </div>
      </section>

      {/* ── Kabaddi Visual Elements ──────────────── */}
      <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
        <div className="court-line court-line-h" style={{ top: '20%' }} />
        <div className="court-line court-line-h" style={{ top: '80%' }} />
        <div className="court-line court-line-v" style={{ left: '10%' }} />
        <div className="court-line court-line-v" style={{ right: '10%' }} />
      </div>
    </motion.div>
  );
}
