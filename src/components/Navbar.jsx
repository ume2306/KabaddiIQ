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
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)' }}>
            Kabaddi<span style={{ color: 'var(--primary)' }}>IQ</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="nav-links-desktop">
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
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link to="/player" className="btn-primary" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
            Explore Now
          </Link>
        </motion.div>
      </div>
    </nav>
  );
}
