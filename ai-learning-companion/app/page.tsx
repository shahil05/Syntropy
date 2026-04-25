'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Message = { role: 'user' | 'ai', content: string }

export default function Home() {
  const [screen, setScreen] = useState('landing')
  const [topic, setTopic] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          topic,
          history: updatedMessages
        })
      })

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  if (screen === 'landing') return (
    <main style={{
      background: '#0f0f0f',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      color: '#fff'
    }}>
      <div style={{
        background: '#1a1a2e',
        border: '1px solid #7F77DD',
        color: '#AFA9EC',
        fontSize: '12px',
        padding: '4px 14px',
        borderRadius: '999px',
        marginBottom: '24px'
      }}>
        AI-Powered Learning
      </div>

      <h1 style={{ fontSize: '48px', fontWeight: 700, textAlign: 'center', marginBottom: '20px', lineHeight: 1.2 }}>
        Learn smarter with{' '}
        <span style={{ color: '#7F77DD' }}>AI</span>
        {' '}that remembers you
      </h1>

      <p style={{ fontSize: '18px', color: '#888', textAlign: 'center', maxWidth: '500px', lineHeight: 1.7, marginBottom: '36px' }}>
        Your personal AI tutor that teaches from first principles, adapts to your pace, and never moves on until you actually get it.
      </p>

      <button
        onClick={() => setScreen('onboard')}
        style={{
          background: '#7F77DD',
          color: 'white',
          border: 'none',
          padding: '14px 32px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 600
        }}>
        Start learning free →
      </button>
    </main>
  )

  if (screen === 'onboard') return (
    <main style={{
      background: '#0f0f0f',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>
        What do you want to learn?
      </h1>
      <p style={{ color: '#555', marginBottom: '28px', fontSize: '15px' }}>
        Alex will teach it from scratch using first principles.
      </p>

      <input
        type="text"
        placeholder="e.g. Machine Learning, React, Bitcoin, Physics..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && topic.trim() && setScreen('chat')}
        style={{
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          color: '#fff',
          padding: '14px 20px',
          borderRadius: '8px',
          fontSize: '16px',
          width: '420px',
          marginBottom: '16px',
          outline: 'none'
        }}
      />

      <button
        onClick={() => topic.trim() && setScreen('chat')}
        style={{
          background: '#7F77DD',
          color: 'white',
          border: 'none',
          padding: '12px 28px',
          borderRadius: '8px',
          fontSize: '15px',
          cursor: 'pointer',
          fontWeight: 500
        }}>
        Meet Alex →
      </button>
    </main>
  )

  return (
    <main style={{
      background: '#0f0f0f',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      color: '#fff'
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 24px',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'sticky',
        top: 0,
        background: '#0f0f0f',
        zIndex: 10
      }}>
        <button
          onClick={() => { setScreen('landing'); setMessages([]) }}
          style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>
          ←
        </button>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#7F77DD', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0
        }}>
          A
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>Alex — AI Tutor</div>
          <div style={{ fontSize: '11px', color: '#7F77DD' }}>Teaching: {topic}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '740px',
        width: '100%',
        margin: '0 auto'
      }}>

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>👋</div>
            <div style={{ fontSize: '17px', fontWeight: 500, marginBottom: '8px' }}>Hey! I'm Alex.</div>
            <div style={{ fontSize: '14px', color: '#555', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
              I'll teach you <span style={{ color: '#7F77DD' }}>{topic}</span> from the ground up.<br />
              Type anything to get started — even just "hi".
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: '10px',
            alignItems: 'flex-start'
          }}>

            {msg.role === 'ai' && (
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: '#7F77DD', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: '12px',
                flexShrink: 0, marginTop: '4px'
              }}>
                A
              </div>
            )}

            <div style={{
              background: msg.role === 'user' ? '#7F77DD' : '#141414',
              color: '#fff',
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              maxWidth: '78%',
              fontSize: '14px',
              lineHeight: 1.7,
              border: msg.role === 'ai' ? '1px solid #1f1f1f' : 'none'
            }}>
              {msg.role === 'ai' ? (
                <ReactMarkdown
                  components={{
                    p: ({children}) => (
                      <p style={{ margin: '0 0 12px 0', lineHeight: 1.8 }}>{children}</p>
                    ),
                    strong: ({children}) => (
                      <strong style={{ color: '#AFA9EC', fontWeight: 600 }}>{children}</strong>
                    ),
                    ul: ({children}) => (
                      <ul style={{ paddingLeft: '20px', margin: '8px 0 12px 0' }}>{children}</ul>
                    ),
                    ol: ({children}) => (
                      <ol style={{ paddingLeft: '20px', margin: '8px 0 12px 0' }}>{children}</ol>
                    ),
                    li: ({children}) => (
                      <li style={{ marginBottom: '8px', lineHeight: 1.7 }}>{children}</li>
                    ),
                    blockquote: ({children}) => (
                      <blockquote style={{
                        borderLeft: '3px solid #7F77DD',
                        paddingLeft: '14px',
                        margin: '12px 0',
                        color: '#888',
                        fontStyle: 'italic'
                      }}>{children}</blockquote>
                    ),
                    h1: ({children}) => (
                      <h1 style={{ fontSize: '18px', fontWeight: 700, margin: '16px 0 8px 0', color: '#fff' }}>{children}</h1>
                    ),
                    h2: ({children}) => (
                      <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '14px 0 8px 0', color: '#AFA9EC' }}>{children}</h2>
                    ),
                    h3: ({children}) => (
                      <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '12px 0 6px 0', color: '#AFA9EC' }}>{children}</h3>
                    ),
                    code: ({children}) => (
                      <code style={{
                        background: '#0f0f0f',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#7F77DD'
                      }}>{children}</code>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: '#7F77DD', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0
            }}>
              A
            </div>
            <div style={{
              background: '#141414',
              border: '1px solid #1f1f1f',
              padding: '14px 18px',
              borderRadius: '4px 18px 18px 18px',
              fontSize: '14px',
              color: '#555',
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <span>Alex is thinking</span>
              <span style={{ letterSpacing: '2px' }}>...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #1a1a1a',
        maxWidth: '740px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          placeholder="Ask Alex anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
          style={{
            flex: 1,
            background: '#141414',
            border: '1px solid #2a2a2a',
            color: '#fff',
            padding: '13px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            background: loading ? '#222' : '#7F77DD',
            color: loading ? '#555' : 'white',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}>
          {loading ? '...' : 'Send'}
        </button>
      </div>

    </main>
  )
}