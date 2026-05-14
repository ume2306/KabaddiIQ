import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navLinks = [
  { to: '/player',   label: 'Player Analysis' },
  { to: '/opponent', label: 'Opponent Intel' },
  { to: '/h2h',      label: 'Head to Head' },
  { to: '/zone',     label: 'Zone Map' },
  { to: '/league',   label: 'League' },
  { to: '/chat',     label: 'Chat' },
];

export default function Navbar() {
  return (
    <nav className="navbar glass" style={{ height: '80px', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 800, 
            fontSize: '1.8rem', 
            letterSpacing: '-0.02em',
            color: 'var(--text)' 
          }}>
            Kabaddi<span className="text-gradient">IQ</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="nav-links">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* CTA */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/player" className="btn-premium" style={{ textDecoration: 'none', padding: '12px 28px' }}>
            Explore Now
          </Link>
        </motion.div>
      </div>
    </nav>
  );
}
