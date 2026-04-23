'use client'

import { useState } from 'react'

export default function Home() {
  const [screen, setScreen] = useState('landing')
  const [topic, setTopic] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, topic })
    })

    const data = await res.json()
    setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
    setLoading(false)
  }

  if (screen === 'landing') return (
    <main style={{ background: '#0f0f0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#fff' }}>
      <div style={{ background: '#1a1a2e', border: '1px solid #7F77DD', color: '#AFA9EC', fontSize: '12px', padding: '4px 14px', borderRadius: '999px', marginBottom: '24px' }}>AI-Powered Learning</div>
      <h1 style={{ fontSize: '48px', fontWeight: 700, textAlign: 'center', marginBottom: '20px' }}>
        Learn smarter with <span style={{ color: '#7F77DD' }}>AI</span> that remembers you
      </h1>
      <p style={{ fontSize: '18px', color: '#888', textAlign: 'center', maxWidth: '500px', lineHeight: 1.7, marginBottom: '36px' }}>Your personal AI tutor that adapts to your pace, finds your weak spots, and builds a custom roadmap just for you.</p>
      <button onClick={() => setScreen('onboard')} style={{ background: '#7F77DD', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: 500 }}>
        Get started free
      </button>
    </main>
  )

  if (screen === 'onboard') return (
    <main style={{ background: '#0f0f0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#fff' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>What do you want to learn?</h1>
      <p style={{ color: '#888', marginBottom: '28px' }}>Your AI tutor will personalise everything around this topic.</p>
      <input
        type="text"
        placeholder="e.g. React, Python, Machine Learning..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && topic.trim() && setScreen('chat')}
        style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '14px 20px', borderRadius: '8px', fontSize: '16px', width: '400px', marginBottom: '16px', outline: 'none' }}
      />
      <button
        onClick={() => topic.trim() && setScreen('chat')}
        style={{ background: '#7F77DD', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: 500 }}>
        Start learning →
      </button>
    </main>
  )

  return (
    <main style={{ background: '#0f0f0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#fff' }}>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => { setScreen('landing'); setMessages([]) }} style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>AI Tutor</div>
          <div style={{ fontSize: '12px', color: '#7F77DD' }}>Learning: {topic}</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '720px', width: '100%', margin: '0 auto' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#444', marginTop: '60px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>👋</div>
            <div style={{ fontSize: '16px' }}>Ask me anything about <span style={{ color: '#7F77DD' }}>{topic}</span></div>
            <div style={{ fontSize: '13px', color: '#333', marginTop: '8px' }}>e.g. "Where do I start?", "Explain it like I'm 10"</div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              background: msg.role === 'user' ? '#7F77DD' : '#1a1a1a',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              maxWidth: '80%',
              fontSize: '14px',
              lineHeight: 1.6
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#1a1a1a', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', color: '#555', fontSize: '14px' }}>
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #1f1f1f', display: 'flex', gap: '12px', maxWidth: '720px', width: '100%', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Ask your AI tutor anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ background: '#7F77DD', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          Send
        </button>
      </div>
    </main>
  )
}