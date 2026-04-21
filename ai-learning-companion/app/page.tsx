'use client'

import { useState } from 'react'

export default function Home() {
  const [started, setStarted] = useState(false)
  const [topic, setTopic] = useState('')

  return (
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

      {!started ? (
        <>
          <h1 style={{ fontSize: '48px', fontWeight: 700, textAlign: 'center', marginBottom: '20px' }}>
            Learn smarter with{' '}
            <span style={{ color: '#7F77DD' }}>AI</span>
            {' '}that remembers you
          </h1>

          <p style={{ fontSize: '18px', color: '#888', textAlign: 'center', maxWidth: '500px', lineHeight: 1.7, marginBottom: '36px' }}>
            Your personal AI tutor that adapts to your pace, finds your weak spots, and builds a custom roadmap just for you.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setStarted(true)}
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
              Get started free
            </button>

            <button
              onClick={() => alert('The AI remembers everything you learn!')}
              style={{
                background: 'transparent',
                color: '#888',
                border: '1px solid #333',
                padding: '12px 28px',
                borderRadius: '8px',
                fontSize: '15px',
                cursor: 'pointer'
              }}>
              See how it works
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '24px' }}>
            What do you want to learn?
          </h1>

          <input
            type="text"
            placeholder="e.g. React, Python, Machine Learning..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              color: '#fff',
              padding: '14px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              width: '400px',
              marginBottom: '16px',
              outline: 'none'
            }}
          />

          <button
            onClick={() => alert(`Starting your ${topic} learning journey!`)}
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
            Start learning →
          </button>

          <button
            onClick={() => setStarted(false)}
            style={{
              marginTop: '12px',
              background: 'transparent',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
            ← go back
          </button>
        </>
      )}

    </main>
  )
}