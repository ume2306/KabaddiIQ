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
    <div className="container" style={{ paddingTop: '160px', height: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', gap: '4rem', flex: 1, overflow: 'hidden' }}>
        
        {/* ── Sidebar ── */}
        <aside style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div className="card-premium" style={{ padding: '3rem', background: 'white' }}>
            <span className="section-label">AI AGENT ACTIVE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '1.5rem' }}>
              <div className="glow-pill" style={{ width: '16px', height: '16px', background: 'var(--secondary)', borderRadius: '50%' }} />
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>PKL DATA STREAM: LIVE</span>
            </div>
          </div>

          <div className="card-premium" style={{ flex: 1, padding: '3rem', background: 'white', display: 'flex', flexDirection: 'column' }}>
            <span className="section-label" style={{ marginBottom: '2rem' }}>SUGGESTED INTEL</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="btn-glass"
                  style={{ 
                    textAlign: 'left', padding: '20px', borderRadius: '16px', 
                    fontSize: '1rem', cursor: 'pointer', fontWeight: 600, color: '#475569',
                    border: '1px solid #E2E8F0', background: '#F8FAFC'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Chat Feed ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }} className="card-premium">
          <div style={{ flex: 1, overflowY: 'auto', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '2rem 2.5rem',
                    background: m.role === 'user' ? 'var(--primary)' : '#F8FAFC',
                    color: m.role === 'user' ? 'white' : '#0F172A',
                    borderRadius: m.role === 'user' ? '32px 32px 8px 32px' : '32px 32px 32px 8px',
                    border: m.role === 'user' ? 'none' : '1px solid #E2E8F0',
                    fontSize: '1.3rem',
                    lineHeight: 1.6,
                    fontWeight: 500,
                    boxShadow: m.role === 'user' ? '0 15px 40px rgba(255,107,53,0.25)' : 'none'
                  }}
                >
                  {m.content}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '1.5rem 2.5rem', background: '#F8FAFC', borderRadius: '32px', border: '1px solid #E2E8F0', color: '#64748B', fontWeight: 700 }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  ANALYSING PKL METADATA...
                </motion.div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ── */}
          <div style={{ padding: '3rem', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <div style={{ position: 'relative' }}>
              <input
                style={{ 
                  width: '100%', padding: '30px 40px', borderRadius: '24px', 
                  fontSize: '1.4rem', border: '1px solid #CBD5E1', outline: 'none',
                  background: 'white', color: '#0F172A', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                }}
                placeholder="Ask about players, teams, or tactics..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={() => handleSend()}
                className="btn-primary"
                style={{ 
                  position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                  padding: '16px 32px', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem',
                  border: 'none', cursor: 'pointer'
                }}
              >
                SEND DATA →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
