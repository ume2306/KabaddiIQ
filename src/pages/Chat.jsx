import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '../api/kabaddiiq';

const SUGGESTIONS = [
  "Who is the best raider right now?",
  "Is Naveen Kumar worth picking in fantasy?",
  "Which zone should I target vs Jaipur?",
  "Compare Pardeep and Naveen",
];

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "SYSTEM INITIALIZED. I am KabaddiIQ AI Agent. I have access to 12 seasons of PKL metadata. How can I assist your scouting mission today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseData = await sendChatMessage(msg, history);
      setMessages(prev => [...prev, { role: 'assistant', content: responseData.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "CONNECTION INTERRUPTED. Ensure backend systems are online." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '140px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '3rem', flex: 1, overflow: 'hidden', paddingBottom: '3rem' }}>
        
        {/* ── Sidebar ── */}
        <aside style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card-premium" style={{ padding: '2rem' }}>
            <span className="section-label">AI AGENT ACTIVE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div className="glow-pill" style={{ width: '12px', height: '12px', background: 'var(--secondary)', borderRadius: '50%' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>PKL DATA STREAM: LIVE</span>
            </div>
          </div>

          <div className="card-premium" style={{ flex: 1, padding: '2rem' }}>
            <span className="section-label" style={{ marginBottom: '1.5rem' }}>SUGGESTED INTEL</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="btn-glass"
                  style={{ textAlign: 'left', padding: '15px', borderRadius: '12px', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Chat Feed ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="card-premium">
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '1.5rem 2rem',
                    background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    borderRadius: m.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                    border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                    fontSize: '1.1rem',
                    lineHeight: 1.5,
                    boxShadow: m.role === 'user' ? '0 10px 30px rgba(255,107,53,0.3)' : 'none'
                  }}
                >
                  {m.content}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '1rem 2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px' }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  ANALYSING DATA...
                </motion.div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ── */}
          <div style={{ padding: '2rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ position: 'relative' }}>
              <input
                className="btn-glass"
                style={{ width: '100%', padding: '25px 35px', borderRadius: '20px', fontSize: '1.1rem', border: 'none', outline: 'none' }}
                placeholder="Ask about players, teams, or tactics..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={() => handleSend()}
                className="btn-primary"
                style={{ 
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  padding: '12px 24px', borderRadius: '15px', fontWeight: 800
                }}
              >
                SEND →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
