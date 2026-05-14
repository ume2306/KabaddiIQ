import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '../api/kabaddiiq';

const SUGGESTIONS = [
  "Who is the best raider right now?",
  "Is Naveen Kumar worth picking in fantasy?",
  "Which zone should I target vs Jaipur?",
  "Compare Pardeep and Naveen",
  "Who are the hidden gems this season?",
  "How does Fazel perform in clutch moments?",
];

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm KabaddiIQ, your AI analyst for Pro Kabaddi League. I have data from 12 seasons covering 500+ players. Ask me anything about player performance, tactics, or matchups."
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

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Map frontend 'content' to backend 'content' if needed, but app.py expects a list of dicts with role/content
      // Actually my app.py expects list of dicts. Let's make sure format is correct.
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseData = await sendChatMessage(msg, history);
      setMessages(prev => [...prev, { role: 'assistant', content: responseData.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now. Please check if the backend is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <aside className="chat-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '40px', height: '40px', background: 'var(--grad-primary)', 
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '1.2rem'
          }}>
            IQ
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem' }}>KabaddiIQ Chat</h2>
            <div style={{ display: 'flex', alignItems: 'center', color: '#10B981', fontSize: '0.75rem', fontWeight: 600 }}>
              <span className="live-dot" /> Live Stats
            </div>
          </div>
        </div>

        <button className="btn-secondary" style={{ width: '100%', marginBottom: '2rem', padding: '12px' }} onClick={() => setMessages([messages[0]])}>
          + New Analysis
        </button>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase' }}>
            Suggested Queries
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {SUGGESTIONS.map(s => (
              <motion.button
                key={s}
                whileHover={{ x: 5, background: '#f5f5f5' }}
                onClick={() => handleSend(s)}
                style={{
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'white',
                  fontSize: '0.85rem',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-messages">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={m.role === 'assistant' ? 'message-ai' : 'message-user'}
              >
                {m.role === 'assistant' && (
                  <div style={{ 
                    fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', 
                    marginBottom: '0.5rem', textTransform: 'uppercase' 
                  }}>
                    KabaddiIQ Analyst
                  </div>
                )}
                <div style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="message-ai"
              style={{ padding: '1rem 1.5rem' }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                    style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about any player, team, or tactic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={() => handleSend()}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--grad-primary)',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
