import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>
        Kabaddi<span style={{ color: 'var(--primary)' }}>IQ</span>
      </span>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {[
          ['/player', 'Player Analysis'],
          ['/opponent', 'Opponent Intel'],
          ['/h2h', 'Head to Head'],
          ['/zone', 'Zone Map'],
          ['/league', 'League'],
          ['/chat', 'Chat'],
        ].map(([to, label]) => (
          <Link key={to} to={to} style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
            {label}
          </Link>
        ))}
      </div>
      <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
        Built for PKL. Powered by XAI.
      </span>
    </footer>
  );
}
