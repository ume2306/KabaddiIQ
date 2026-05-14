import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED = [
  "Who is the best raider in Season 10?",
  "What is Naveen Kumar's raid success rate?",
  "Explain Fazel Atrachali's playing style",
  "Which team has the weakest left corner defense?",
  "Who are the top hidden gems this season?",
];

const MOCK_RESPONSES = {
  "Who is the best raider in Season 10?":
    "Based on current season data, **Naveen Kumar** holds the top raider position with a valuation score of **87** — classified as Elite tier. His ankle-hold raids in the left corner are lethal with a 73% success rate. His consistency score of 88 and clutch index of 91 make him the standout raider of Season 10.",
  "What is Naveen Kumar's raid success rate?":
    "Naveen Kumar's overall raid success rate is **73%**, the highest among active raiders this season. He's especially dominant in the Left Corner zone with 148 raids at 73% success. His form is Rising, with scores improving from 61 (S7) → 70 (S8) → 78 (S9) → 87 (S10).",
  "Explain Fazel Atrachali's playing style":
    "Fazel Atrachali is an **Elite Defender** with a valuation score of 83 and a clutch index of 88. His primary weapon is the chain tackle — he's the league's most complete defensive player. His dominant zones are Left Corner (88 strength, 201 tackles) and Right Corner (82 strength). He's weakest at Right In (47 strength, 43% success), which can be exploited.",
  "Which team has the weakest left corner defense?":
    "Based on zone vulnerability analysis, **Jaipur Pink Panthers** have the highest Left Corner vulnerability at **82%** — their weakest zone by a significant margin. This makes ankle-hold raids targeting that zone highly effective, especially from Naveen Kumar (71% success probability vs Jaipur).",
  "Who are the top hidden gems this season?":
    "The top hidden gems based on rising form indicators are:\n1. **Naveen Kumar** (↑ score: 87) — consistently improving\n2. **Pawan Sehrawat** (↑ score: 82) — great toe-touch raids\n3. **Arjun Deshwal** (↑ score: 79) — strong left-cover attacks\n\nAll three show upward season trajectories and are undervalued in many fantasy team selections.",
};

function getResponse(msg) {
  const key = Object.keys(MOCK_RESPONSES).find(k =>
    k.toLowerCase().includes(msg.toLowerCase().slice(0, 20))
    || msg.toLowerCase().includes(k.toLowerCase().slice(0, 20))
  );
  if (key) return MOCK_RESPONSES[key];
  return `Great question about "${msg}"! Based on KabaddiIQ's 12-season database, I can see several relevant patterns. For detailed stats on this, try checking the Player Valuation or Zone Intelligence pages — or rephrase your question using a player or team name for a precise answer.`;
}

function renderMsg(text) {
  // minimal markdown: **bold** and newlines
  const lines = text.split('\n');
  return lines.map((line, li) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <p key={li} style={{ margin: li > 0 ? '0.35rem 0 0' : 0 }}>
        {parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p)}
      </p>
    );
  });
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm **KabaddiIQ**, your PKL intelligence assistant. Ask me anything about players, tactics, zones, or stats across all 12 PKL seasons." }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = (msg) => {
    if (!msg.trim() || thinking) return;
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const resp = getResponse(msg);
      setThinking(false);
      setMessages(prev => [...prev, { role: 'assistant', text: resp }]);
    }, 1100 + Math.random() * 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '80vh', padding: '3rem 1rem 2rem' }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '76vh' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '0.4rem' }}>
            KabaddiIQ <span style={{ color: 'var(--primary)' }}>Chat</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Ask anything about PKL players, tactics, or stats</p>
        </div>

        {/* Suggested prompts */}
        {messages.length === 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', justifyContent: 'center' }}>
            {SUGGESTED.map(s => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => send(s)}
                style={{
                  background: 'rgba(232,97,44,0.07)',
                  border: '1px solid rgba(232,97,44,0.2)',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1rem',
        }}>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '82%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user'
                    ? 'var(--primary)'
                    : '#F7F5F2',
                  color: m.role === 'user' ? 'white' : 'var(--text)',
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  {m.role === 'assistant' && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      KabaddiIQ
                    </div>
                  )}
                  {renderMsg(m.text)}
                </div>
              </motion.div>
            ))}

            {thinking && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                <div style={{
                  padding: '0.85rem 1.1rem',
                  borderRadius: '14px 14px 14px 4px',
                  background: '#F7F5F2',
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', opacity: 0.7 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            id="chat-input"
            className="input-base"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Ask about any player, team, or tactic..."
            disabled={thinking}
            style={{ flex: 1 }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => send(input)}
            disabled={thinking || !input.trim()}
            className="btn-primary"
            style={{ borderRadius: 'var(--radius-btn)', padding: '0 1.25rem', flexShrink: 0, opacity: (!input.trim() || thinking) ? 0.5 : 1 }}
          >
            {thinking ? '...' : 'Send ↑'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
