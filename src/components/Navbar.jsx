import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navLinks = [
  { to: '/player',   label: 'ANALYSIS' },
  { to: '/opponent', label: 'SCOUT' },
  { to: '/h2h',      label: 'H2H' },
  { to: '/zone',     label: 'ZONES' },
  { to: '/league',   label: 'LEAGUE' },
  { to: '/chat',     label: 'AI CHAT' },
];

export default function Navbar() {
  return (
    <nav className="nav-wrapper">
      <div className="logo-container">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-icon">
            <span style={{ transform: 'rotate(10deg)' }}>K</span>
          </div>
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 800, 
            fontSize: '1.6rem', 
            letterSpacing: '-0.04em',
            color: 'white' 
          }}>
            KABADDI<span className="gradient-text">IQ</span>
          </span>
        </Link>
      </div>

      <div className="nav-links-premium">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link-premium${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link to="/chat" className="btn-cta btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '0.85rem' }}>
          LAUNCH AI →
        </Link>
      </motion.div>
    </nav>
  );
}
