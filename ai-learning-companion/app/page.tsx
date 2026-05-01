'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

type Message = { role: 'user' | 'ai', content: string }

export default function Home() {
  const [screen, setScreen] = useState('landing')
  const [topic, setTopic] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [gaps, setGaps] = useState<any>(null)
  const [showGaps, setShowGaps] = useState(false)
  const [analyzingGaps, setAnalyzingGaps] = useState(false)
  const [socraticMode, setSocraticMode] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [showRoadmap, setShowRoadmap] = useState(false)
  const [roadmap, setRoadmap] = useState<any>(null)
  const [loadingRoadmap, setLoadingRoadmap] = useState(false)
   
  const [sessions, setSessions] = useState<any[]>(() => {
     if (typeof window === 'undefined') return []
      const stored = localStorage.getItem('learningSessions')
      return stored ? JSON.parse(stored) : []
  })
  const [userId] = useState(() => {
    if (typeof window === 'undefined') return 'user-default'
    const stored = localStorage.getItem('userId')
    if (stored) return stored
    const newId = 'user-' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('userId', newId)
    return newId
  })
// app/page.tsx 

useEffect(() => {
  // Only run logic if we have messages and it's a multiple of 5
  if (messages.length > 0 && messages.length % 5 === 0) {
    const session = {
      topic,
      messageCount: messages.length,
      timestamp: new Date().toISOString()
    };

    // Use a functional update (prevSessions)
    // This way we don't need 'sessions' in the dependency array
    setSessions(prevSessions => {
      const updated = [...prevSessions, session];
      localStorage.setItem('learningSessions', JSON.stringify(updated));
      return updated;
    });
  }
  
  // ONLY messages.length and topic should be here.
  // REMOVE 'sessions' from this array!
}, [messages.length, topic]);

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
          history: updatedMessages,
          userId,
          socraticMode
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

  async function analyzeGaps() {
   if (messages.length < 2) {
     alert('Have a longer conversation first!')
     return
   }
  
   setShowGaps(true)
   setAnalyzingGaps(true)
   try {
      const res = await fetch('/api/gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messages, topic })
      })
    const data = await res.json()
    
    console.log("🚨 BACKEND RESPONSE:", data) // ADD THIS LINE!
    
    setGaps(data.gaps)
  } catch (err) {
    console.error('Gap analysis failed')
  } finally {
    setAnalyzingGaps(false)
  }
  }
  async function fetchStats() {
  setShowProgress(true)
  try {
    const res = await fetch('/api/stats', {
      method: 'POST', // Change this from GET to POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessions }) // Send the sessions from your state
    })
    const data = await res.json()
    setStats(data)
  } catch (err) {
    console.warn('Stats failed', err) 
  }
}
  async function generateRoadmap() {
  if (messages.length < 2) {
    alert('Have a longer conversation first!')
    return
  }

  setShowRoadmap(true)
  setLoadingRoadmap(true)
  
  try {
    const res = await fetch('/api/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        topic, 
        history: messages,
        gaps 
      })
    })
    const data = await res.json()
    setRoadmap(data.roadmap)
  } catch (err) {
    console.error('Roadmap failed')
  } finally {
    setLoadingRoadmap(false)
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

      <h1 style={{
        fontSize: '48px',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '20px',
        lineHeight: 1.2
      }}>
        Learn smarter with{' '}
        <span style={{ color: '#7F77DD' }}>AI</span>
        {' '}that remembers you
      </h1>

      <p style={{
        fontSize: '18px',
        color: '#888',
        textAlign: 'center',
        maxWidth: '500px',
        lineHeight: 1.7,
        marginBottom: '36px'
      }}>
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

      <button
        onClick={() => setSocraticMode(!socraticMode)}
        style={{
          fontSize: '11px',
          color: socraticMode ? '#fff' : '#888',
          background: socraticMode ? '#7F77DD' : 'transparent',
          padding: '4px 12px',
          borderRadius: '999px',
          border: socraticMode ? 'none' : '1px solid #333',
          cursor: 'pointer',
          transition: 'all 0.2s'
       }}>
        {socraticMode ? '💡 Socratic ON' : '💭 Socratic mode'}
      </button>

      <button
        onClick={fetchStats}
        style={{
          fontSize: '11px',
          color: '#fff',
          background: '#22c55e',
          padding: '4px 12px',
          borderRadius: '999px',
          border: 'none',
          cursor: 'pointer'
        }}>
        📊 My Progress
      </button>

      {messages.length >= 6 && (
  <button
    onClick={generateRoadmap}
    style={{
      fontSize: '11px',
      color: '#fff',
      background: '#3b82f6',
      padding: '4px 12px',
      borderRadius: '999px',
      border: 'none',
      cursor: 'pointer'
    }}>
    🗺️ My Roadmap
  </button>
)}
      
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
          onClick={() => { setScreen('landing'); setMessages([]); setGaps(null); setShowGaps(false) }}
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

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {messages.length > 0 && (
            <div style={{
              fontSize: '11px',
              color: '#7F77DD',
              background: '#1a1a2e',
              padding: '3px 10px',
              borderRadius: '999px',
              border: '1px solid #7F77DD33'
            }}>
              🧠 Memory active
            </div>
          )}

          {messages.length >= 4 && (
            <button
              onClick={analyzeGaps}
              style={{
                fontSize: '11px',
                color: '#fff',
                background: '#7F77DD',
                padding: '4px 12px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer'
              }}>
              🔍 Analyze my gaps
            </button>
          )}
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
                    p: ({children}) => <p style={{ margin: '0 0 12px 0', lineHeight: 1.8 }}>{children}</p>,
                    strong: ({children}) => <strong style={{ color: '#AFA9EC', fontWeight: 600 }}>{children}</strong>,
                    ul: ({children}) => <ul style={{ paddingLeft: '20px', margin: '8px 0 12px 0' }}>{children}</ul>,
                    ol: ({children}) => <ol style={{ paddingLeft: '20px', margin: '8px 0 12px 0' }}>{children}</ol>,
                    li: ({children}) => <li style={{ marginBottom: '8px', lineHeight: 1.7 }}>{children}</li>,
                    blockquote: ({children}) => (
                      <blockquote style={{
                        borderLeft: '3px solid #7F77DD',
                        paddingLeft: '14px',
                        margin: '12px 0',
                        color: '#888',
                        fontStyle: 'italic'
                      }}>{children}</blockquote>
                    ),
                    h1: ({children}) => <h1 style={{ fontSize: '18px', fontWeight: 700, margin: '16px 0 8px 0' }}>{children}</h1>,
                    h2: ({children}) => <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '14px 0 8px 0', color: '#AFA9EC' }}>{children}</h2>,
                    h3: ({children}) => <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '12px 0 6px 0', color: '#AFA9EC' }}>{children}</h3>,
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
              color: '#555'
            }}>
              Alex is thinking...
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

      {/* Gaps Panel */}
      {showGaps && (
        <div style={{
          position: 'fixed',
          top: 0, right: 0,
          width: '320px',
          height: '100vh',
          background: '#0a0a0a',
          borderLeft: '1px solid #1f1f1f',
          padding: '24px',
          overflowY: 'auto',
          zIndex: 100
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Knowledge Analysis</div>
            <button
              onClick={() => setShowGaps(false)}
              style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '20px' }}>
              ×
            </button>
          </div>

          {analyzingGaps ? (
            <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>
              Analyzing your learning history...
            </div>
          ) : gaps ? (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Mastery</div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#7F77DD' }}>{gaps.overallMasteryScore}%</div>
                <div style={{ marginTop: '8px', height: '6px', background: '#1a1a1a', borderRadius: '999px' }}>
                  <div style={{
                    width: `${gaps.overallMasteryScore}%`,
                    height: '100%',
                    background: '#7F77DD',
                    borderRadius: '999px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              {gaps.masteredConcepts?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#22c55e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Mastered</div>
                  {gaps.masteredConcepts.map((c: string, i: number) => (
                    <div key={i} style={{ fontSize: '13px', color: '#888', padding: '7px 0', borderBottom: '1px solid #111' }}>{c}</div>
                  ))}
                </div>
              )}

              {gaps.weakConcepts?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚠ Needs work</div>
                  {gaps.weakConcepts.map((c: string, i: number) => (
                    <div key={i} style={{ fontSize: '13px', color: '#888', padding: '7px 0', borderBottom: '1px solid #111' }}>{c}</div>
                  ))}
                </div>
              )}

              {gaps.confusedConcepts?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#ef4444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✗ Confused</div>
                  {gaps.confusedConcepts.map((c: string, i: number) => (
                    <div key={i} style={{ fontSize: '13px', color: '#888', padding: '7px 0', borderBottom: '1px solid #111' }}>{c}</div>
                  ))}
                </div>
              )}

              {gaps.recommendedNextTopic && (
                <div style={{
                  background: '#1a1a2e',
                  border: '1px solid #7F77DD33',
                  borderRadius: '8px',
                  padding: '14px',
                  marginTop: '8px'
                }}>
                  <div style={{ fontSize: '11px', color: '#7F77DD', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📍 Learn next</div>
                  <div style={{ fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>{gaps.recommendedNextTopic}</div>
                </div>
              )}
            </>
          ) : (
            <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>
              Not enough data yet. Chat more with Alex first!
            </div>
          )}
        </div>
      )}
      {showProgress && (
  <div style={{
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    maxHeight: '80vh',
    background: '#0a0a0a',
    border: '1px solid #1f1f1f',
    borderRadius: '12px',
    padding: '28px',
    overflowY: 'auto',
    zIndex: 200,
    boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <div style={{ fontWeight: 700, fontSize: '18px' }}>Your Learning Progress</div>
      <button
        onClick={() => setShowProgress(false)}
        style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '20px' }}>
        ×
      </button>
    </div>

    {stats ? (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#141414', padding: '16px', borderRadius: '8px', border: '1px solid #1f1f1f' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Total Sessions</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#7F77DD' }}>{stats.totalSessions}</div>
          </div>

          <div style={{ background: '#141414', padding: '16px', borderRadius: '8px', border: '1px solid #1f1f1f' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px', textTransform: 'uppercase' }}>Learning Streak</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>{stats.streak} days</div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '8px', textTransform: 'uppercase' }}>Overall Mastery</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e', marginBottom: '8px' }}>{stats.overallMastery}%</div>
          <div style={{ height: '8px', background: '#1a1a1a', borderRadius: '999px' }}>
            <div style={{
              width: `${stats.overallMastery}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #22c55e, #7F77DD)',
              borderRadius: '999px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#fff' }}>Topics Studied</div>
          {stats.topicsStudied.length === 0 ? (
            <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              No topics yet. Start learning!
            </div>
          ) : (
            stats.topicsStudied.map((topic: any, i: number) => (
              <div key={i} style={{
                background: '#141414',
                border: '1px solid #1f1f1f',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '4px' }}>{topic.name}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Last studied: {topic.lastStudied}</div>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#7F77DD',
                  background: '#1a1a2e',
                  padding: '4px 10px',
                  borderRadius: '999px'
                }}>
                  {topic.messageCount} messages
                </div>
              </div>
            ))
          )}
        </div>
      </>
    ) : (
      <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>
        Loading your stats...
      </div>
    )}
  </div>
)}

{showProgress && (
  <div
    onClick={() => setShowProgress(false)}
    style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)',
      zIndex: 199
    }}
  />
)}
{showRoadmap && (
  <>
    <div
      onClick={() => setShowRoadmap(false)}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.8)',
        zIndex: 300
      }}
    />
    
    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '600px',
      maxHeight: '85vh',
      background: '#0a0a0a',
      border: '1px solid #1f1f1f',
      borderRadius: '12px',
      padding: '28px',
      overflowY: 'auto',
      zIndex: 301,
      boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ fontWeight: 700, fontSize: '18px' }}>Your Learning Roadmap</div>
        <button
          onClick={() => setShowRoadmap(false)}
          style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '20px' }}>
          ×
        </button>
      </div>

      {loadingRoadmap ? (
        <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '60px 20px' }}>
          Generating your personalized roadmap...
        </div>
      ) : roadmap ? (
        <>
          <div style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #7F77DD)', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '24px',
            color: '#fff'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>Current Level</div>
            <div style={{ fontSize: '24px', fontWeight: 700, textTransform: 'capitalize' }}>
              {roadmap.currentLevel}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              Estimated completion: {roadmap.estimatedCompletionWeeks} weeks
            </div>
          </div>

          {roadmap.topicsCovered && roadmap.topicsCovered.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#22c55e' }}>
                ✓ Topics You've Covered
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {roadmap.topicsCovered.map((t: string, i: number) => (
                  <div key={i} style={{
                    background: '#0f2a1f',
                    border: '1px solid #22c55e33',
                    color: '#22c55e',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
            📍 What to Learn Next
          </div>

          {roadmap.nextTopics?.map((topic: any, i: number) => (
            <div key={i} style={{
              background: '#141414',
              border: '1px solid #1f1f1f',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
                  {i + 1}. {topic.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  background: topic.difficulty === 'beginner' ? '#22c55e22' : topic.difficulty === 'intermediate' ? '#f59e0b22' : '#ef444422',
                  color: topic.difficulty === 'beginner' ? '#22c55e' : topic.difficulty === 'intermediate' ? '#f59e0b' : '#ef4444',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  textTransform: 'capitalize'
                }}>
                  {topic.difficulty}
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', lineHeight: 1.6 }}>
                {topic.why}
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#555' }}>
                <div>⏱️ {topic.estimatedHours}h</div>
                {topic.prerequisites && topic.prerequisites.length > 0 && (
                  <div>📚 Requires: {topic.prerequisites.join(', ')}</div>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '60px 20px' }}>
          Failed to generate roadmap. Try again.
        </div>
      )}
    </div>
  </>
)}


    </main>
  )
}