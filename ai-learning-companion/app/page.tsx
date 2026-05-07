'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Change 'cjs' to 'esm' here:
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  const [showQuiz, setShowQuiz] = useState(false)
  const [quiz, setQuiz] = useState<any>(null)
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({})
  const [quizResults, setQuizResults] = useState<any>(null)
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loadingFlashcards, setLoadingFlashcards] = useState(false)
  const [shuffleMode, setShuffleMode] = useState(false)
  const [reviewedCards, setReviewedCards] = useState<Set<number>>(new Set())
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60) // 25 minutes in seconds
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus')
  const [showTimer, setShowTimer] = useState(false)
  const [totalStudyTime, setTotalStudyTime] = useState(() => {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem('totalStudyTime')
  return stored ? parseInt(stored) : 0
})
   
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
  const [customFocusMinutes, setCustomFocusMinutes] = useState(25)
  const [customBreakMinutes, setCustomBreakMinutes] = useState(5)
  const [showTimerSettings, setShowTimerSettings] = useState(false)

  // Add this helper function
function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}
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
useEffect(() => {
  let interval: NodeJS.Timeout | null = null

  if (timerRunning && timerSeconds > 0) {
    interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          // Timer finished
          setTimerRunning(false)
          
          // Play sound (optional - browser's beep)
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LhjHQU2jdTx0H4yBSh+zPLaizsKEly28OehUBELTKXh8bllHgU1i9Dx0n8zBSl/zPDajDsKEVuz6+mnUhEMTKPg8bllHwU0iM/x1YA1BSiByvDbjTwKD1+16OeoUxIMTKPf8bllHwU0iM/x1YA1BSiByvDbjTwKEFux6OenUxIMTKLe8bllHwU0iM/x1YA1BSiByvDbjTwKEFux6OenUxIMTKLe8bllHwU0iM/x1YA1BSiByvDbjTwKEFux6OenUxIMTKLe8bllHwU0iM/x1YA1BSiByvDbjTwKEFux6OenUxIMTKLe8bllHwU0iM/x1YA1BSiByvDbjTwKEFux6OenUxIMTKLe8bllHwU0iM/x1YA1BSiByvDbjTwKEFux6OenUxIMTKLe8bllHwU0iM/x1YA1BSiByvDbjTwKEFux6OenUxIMTKLe8bllHwU0iM/x1YA1BSiByvDbjTwKEFux6OenUxIMTKLe8bllHwU0iM/x1YA1BSiByvDbjTwKEFux6OenUxIMTKLe8bllHwU0iM/x1YA1BSiByvDbjTwK')
          audio.play().catch(() => {}) // Ignore if browser blocks
          
          // Switch mode
          // Inside the useEffect, replace the mode switching section:

if (timerMode === 'focus') {
  // Save study time
  const sessionTime = customFocusMinutes * 60
  const newTotal = totalStudyTime + sessionTime
  setTotalStudyTime(newTotal)
  localStorage.setItem('totalStudyTime', newTotal.toString())
  
  alert(`🎉 ${customFocusMinutes}-minute focus session complete! Time for a ${customBreakMinutes}-minute break.`)
  setTimerMode('break')
  setTimerSeconds(customBreakMinutes * 60)
} else {
  alert(`✅ Break over! Ready for another ${customFocusMinutes}-minute focus session?`)
  setTimerMode('focus')
  setTimerSeconds(customFocusMinutes * 60)
}
          
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return () => {
    if (interval) clearInterval(interval)
  }
}, [timerRunning, timerSeconds, timerMode, totalStudyTime])

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
async function startQuiz() {
  if (messages.length < 6) {
    alert('Have a longer conversation first!')
    return
  }

  setShowQuiz(true)
  setLoadingQuiz(true)
  setQuizResults(null)
  setQuizAnswers({})

  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate',
        topic,
        history: messages,
        gaps
      })
    })
    const data = await res.json()
    setQuiz(data.quiz)
  } catch (err) {
    console.error('Quiz generation failed')
  } finally {
    setLoadingQuiz(false)
  }
}

async function submitQuiz() {
  if (Object.keys(quizAnswers).length < quiz.questions.length) {
    alert('Please answer all questions first!')
    return
  }

  setLoadingQuiz(true)

  try {
    const formattedAnswers = quiz.questions.map((q: any) => ({
      questionId: q.id,
      question: q.question,
      studentAnswer: quizAnswers[q.id],
      correctAnswer: q.correctAnswer
    }))

    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'grade',
        topic,
        answers: formattedAnswers
      })
    })
    const data = await res.json()
    setQuizResults(data.results)

    // Save quiz result to sessions
    const quizSession = {
      topic,
      messageCount: 1,
      timestamp: new Date().toISOString(),
      type: 'quiz',
      score: data.results.score
    }
    const updated = [...sessions, quizSession]
    setSessions(updated)
    localStorage.setItem('learningSessions', JSON.stringify(updated))

  } catch (err) {
    console.error('Quiz grading failed')
  } finally {
    setLoadingQuiz(false)
  }
}
async function generateFlashcards() {
  if (messages.length < 8) {
    alert('Have a longer conversation first!')
    return
  }

  setShowFlashcards(true)
  setLoadingFlashcards(true)
  setCurrentCardIndex(0)
  setIsFlipped(false)

  try {
    const res = await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        history: messages
      })
    })
    const data = await res.json()
    setFlashcards(data.flashcards || [])
  } catch (err) {
    console.error('Flashcard generation failed')
  } finally {
    setLoadingFlashcards(false)
  }
}

function nextCard() {
  setReviewedCards(new Set([...reviewedCards, currentCardIndex]))
  setIsFlipped(false)
  
  if (shuffleMode) {
    const remaining = flashcards
      .map((_, i) => i)
      .filter(i => !reviewedCards.has(i) && i !== currentCardIndex)
    if (remaining.length > 0) {
      const randomIndex = remaining[Math.floor(Math.random() * remaining.length)]
      setCurrentCardIndex(randomIndex)
    } else {
      setCurrentCardIndex((currentCardIndex + 1) % flashcards.length)
    }
  } else {
    setCurrentCardIndex((currentCardIndex + 1) % flashcards.length)
  }
}

function prevCard() {
  setIsFlipped(false)
  setCurrentCardIndex((currentCardIndex - 1 + flashcards.length) % flashcards.length)
}

function toggleShuffle() {
  setShuffleMode(!shuffleMode)
  setReviewedCards(new Set())
}
function startTimer() {
  setTimerRunning(true)
}

function pauseTimer() {
  setTimerRunning(false)
}

function resetTimer() {
  setTimerRunning(false)
  setTimerSeconds(timerMode === 'focus' ? customFocusMinutes * 60 : customBreakMinutes * 60)
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
function exportConversationAsPDF() {
  if (messages.length === 0) {
    alert('No conversation to export!')
    return
  }

  // Dynamic import to avoid SSR issues
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(`Learning: ${topic}`, 20, 20)
    
    // Metadata
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Exported: ${new Date().toLocaleDateString()}`, 20, 30)
    doc.text(`Messages: ${messages.length}`, 20, 35)
    
    // Messages
    let y = 50
    doc.setFontSize(11)
    
    messages.forEach((msg, i) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      
      // Speaker label
      doc.setFont('helvetica', 'bold')
      doc.text(msg.role === 'user' ? 'You:' : 'Vyom:', 20, y)
      
      // Message content (wrapped)
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(msg.content, 170)
      doc.text(lines, 20, y + 5)
      
      y += (lines.length * 5) + 10
    })
    
    doc.save(`${topic.replace(/\s+/g, '-')}-conversation.pdf`)
  })
}

function exportFlashcardsAsJSON() {
  if (flashcards.length === 0) {
    alert('No flashcards to export! Generate them first.')
    return
  }

  const exportData = {
    topic,
    exportedAt: new Date().toISOString(),
    totalCards: flashcards.length,
    flashcards: flashcards.map(card => ({
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      category: card.category
    }))
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${topic.replace(/\s+/g, '-')}-flashcards.json`
  a.click()
  URL.revokeObjectURL(url)
}

function exportRoadmapAsText() {
  if (!roadmap) {
    alert('No roadmap to export! Generate it first.')
    return
  }

  let text = `LEARNING ROADMAP: ${topic}\n`
  text += `Generated: ${new Date().toLocaleDateString()}\n`
  text += `\n${'='.repeat(50)}\n\n`
  
  text += `CURRENT LEVEL: ${roadmap.currentLevel.toUpperCase()}\n`
  text += `Estimated completion: ${roadmap.estimatedCompletionWeeks} weeks\n\n`
  
  if (roadmap.topicsCovered?.length > 0) {
    text += `TOPICS COVERED:\n`
    roadmap.topicsCovered.forEach((t: string) => {
      text += `  ✓ ${t}\n`
    })
    text += `\n`
  }
  
  text += `WHAT TO LEARN NEXT:\n\n`
  roadmap.nextTopics?.forEach((topic: any, i: number) => {
    text += `${i + 1}. ${topic.name} [${topic.difficulty}]\n`
    text += `   ${topic.why}\n`
    text += `   Time: ${topic.estimatedHours}h`
    if (topic.prerequisites?.length > 0) {
      text += ` | Prerequisites: ${topic.prerequisites.join(', ')}`
    }
    text += `\n\n`
  })

  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${topic.replace(/\s+/g, '-')}-roadmap.txt`
  a.click()
  URL.revokeObjectURL(url)
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
        fontSize: isMobile() ? '32px' : '48px',
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
        fontSize: isMobile() ? '16px' : '18px',
        color: '#888',
        textAlign: 'center',
        maxWidth: '500px',
        lineHeight: 1.7,
        marginBottom: '36px',
        padding: isMobile() ? '0 20px' : '0'

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
        Vyom will teach it from scratch using first principles.
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
        Meet Vyom →
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
  <>
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
    <button
      onClick={startQuiz}
      style={{
        fontSize: '11px',
        color: '#fff',
        background: '#8b5cf6',
        padding: '4px 12px',
        borderRadius: '999px',
        border: 'none',
        cursor: 'pointer'
      }}>
      📝 Take Quiz
    </button>
    {messages.length >= 8 && (
      <button

        onClick={generateFlashcards}
        style={{
          fontSize: '11px',
          color: '#fff',
          background: '#ec4899',
          padding: '4px 12px',
          borderRadius: '999px',
          border: 'none',
          cursor: 'pointer'
        }}>
        🃏 Flashcards
      </button>
      
    )}
    <button
  onClick={() => setShowTimer(!showTimer)}
  style={{
    fontSize: '11px',
    color: showTimer ? '#fff' : '#888',
    background: showTimer ? '#10b981' : 'transparent',
    padding: '4px 12px',
    borderRadius: '999px',
    border: showTimer ? 'none' : '1px solid #333',
    cursor: 'pointer'
  }}>
  ⏱️ {showTimer ? 'Timer ON' : 'Study Timer'}
</button>
  </>
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
          V
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>Vyom</div>
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
  {showTimer && (
    <div style={{
    position: 'sticky',
    top: 0,
    background: timerMode === 'focus' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
    padding: isMobile() ? '12px 16px' : '16px 20px',
    borderRadius: '12px',
    marginBottom: '16px',
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px', textTransform: 'uppercase' }}>
          {timerMode === 'focus' ? '🎯 Focus Session' : '☕ Break Time'}
        </div>
        <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
          {formatTime(timerSeconds)}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
          Total study time today: {Math.floor(totalStudyTime / 60)} minutes
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => setShowTimerSettings(!showTimerSettings)}
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.25)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
          ⚙️
        </button>

        {!timerRunning ? (
          <button
            onClick={startTimer}
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            ▶ Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            ⏸ Pause
          </button>
        )}
        
        <button
          onClick={resetTimer}
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.25)',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
          ↻ Reset
        </button>
      </div>
    </div>

    {/* Settings dropdown */}
    {showTimerSettings && (
      <div style={{
        marginTop: '16px',
        padding: '16px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px', fontWeight: 600 }}>
          Timer Settings
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>
            Focus Duration (minutes)
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setCustomFocusMinutes(Math.max(5, customFocusMinutes - 5))}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
              −
            </button>
            <input
              type="number"
              value={customFocusMinutes}
              onChange={(e) => setCustomFocusMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '60px',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '6px',
                borderRadius: '6px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            />
            <button
              onClick={() => setCustomFocusMinutes(Math.min(120, customFocusMinutes + 5))}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
              +
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '6px' }}>
            Break Duration (minutes)
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setCustomBreakMinutes(Math.max(1, customBreakMinutes - 1))}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
              −
            </button>
            <input
              type="number"
              value={customBreakMinutes}
              onChange={(e) => setCustomBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '60px',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '6px',
                borderRadius: '6px',
                fontSize: '14px',
                textAlign: 'center'
              }}
            />
            <button
              onClick={() => setCustomBreakMinutes(Math.min(30, customBreakMinutes + 1))}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
              +
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => { setCustomFocusMinutes(25); setCustomBreakMinutes(5); }}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '6px',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer'
            }}>
            Classic (25/5)
          </button>
          <button
            onClick={() => { setCustomFocusMinutes(50); setCustomBreakMinutes(10); }}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '6px',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer'
            }}>
            Long (50/10)
          </button>
        </div>
      </div>
    )}
  </div>
)}

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>👋</div>
            <div style={{ fontSize: '17px', fontWeight: 500, marginBottom: '8px' }}>Hey! I'm Vyom.</div>
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
                V
              </div>
            )}

            <div style={{
              background: msg.role === 'user' ? '#7F77DD' : '#141414',
              color: '#fff',
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              maxWidth: isMobile() ? '85%' : '78%',
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
                    code: ({node, inline, className, children, ...props}: any) => {
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  
  return !inline && match ? (
    <div style={{ position: 'relative', marginTop: '12px', marginBottom: '12px' }}>
      {/* Language label */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: '#1a1a1a',
        color: '#7F77DD',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        textTransform: 'uppercase',
        fontWeight: 600,
        zIndex: 1
      }}>
        {language}
      </div>
      
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '8px',
          fontSize: '13px',
          padding: '16px',
          background: '#1a1a1a'
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
      
      {/* Copy button */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
          alert('Code copied!')
        }}
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          background: '#2a2a2a',
          color: '#888',
          border: '1px solid #333',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          cursor: 'pointer',
          fontWeight: 500
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#7F77DD'
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.borderColor = '#7F77DD'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#2a2a2a'
          e.currentTarget.style.color = '#888'
          e.currentTarget.style.borderColor = '#333'
        }}
      >
        Copy
      </button>
    </div>
  ) : (
    <code style={{
      background: '#0f0f0f',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '13px',
      color: '#7F77DD'
    }} {...props}>
      {children}
    </code>
  )
},
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
              Vyom is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: isMobile() ? '12px 16px' : '16px 24px', 
        borderTop: '1px solid #1a1a1a',
        maxWidth: '740px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          placeholder="Ask Vyom anything..."
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
              Not enough data yet. Chat more with Vyom first!
            </div>
          )}
        </div>
      )}
      {showProgress && (
  <div style={{
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile() ? '90vw' : '500px',
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
        {/* ADD THIS EXPORT BUTTON HERE ⬇️ */}
        <button
          onClick={exportConversationAsPDF}
          style={{
            width: '100%',
            background: 'transparent',
            color: '#7F77DD',
            border: '1px solid #7F77DD',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '20px'
          }}>
          📥 Export Conversation as PDF
        </button>
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
        width: '100vw' , height: '100vh',
        background: 'rgba(0,0,0,0.85)',
        zIndex: 300,
        backdropFilter: 'blur(4px)'

      }}
    />
    
    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: isMobile() ? '92vw' : '600px',
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
          

          {/* ADD THIS EXPORT BUTTON HERE ⬇️ */}
          <button
            onClick={exportRoadmapAsText}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '20px'
            }}>
            📥 Export Roadmap as Text
          </button>

        </>
      
      ) : (
        <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '60px 20px' }}>
          Failed to generate roadmap. Try again.
        </div>
      )}
    </div>
  </>
)}
{showQuiz && (
  <>
    <div
      onClick={() => setShowQuiz(false)}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.85)',
        zIndex: 400
      }}
    />

    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: isMobile() ? '92vw' : '600px',
      maxHeight: '90vh',
      background: '#0a0a0a',
      border: '1px solid #1f1f1f',
      borderRadius: '12px',
      padding: isMobile() ? '20px' : '32px',
      overflowY: 'auto',
      zIndex: 401,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '20px' }}>Knowledge Check</div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
            {topic} • 5 questions
          </div>
        </div>
        <button
          onClick={() => setShowQuiz(false)}
          style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '22px' }}>
          ×
        </button>
      </div>

      {loadingQuiz ? (
        <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '80px 20px' }}>
          {quizResults ? 'Grading your answers...' : 'Generating quiz questions...'}
        </div>
      ) : quizResults ? (
        <>
          <div style={{
            background: quizResults.score >= 80 ? 'linear-gradient(135deg, #22c55e, #16a34a)' : quizResults.score >= 60 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            color: '#fff',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Your Score</div>
            <div style={{ fontSize: '48px', fontWeight: 700 }}>{quizResults.score}%</div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px' }}>
              {quizResults.score >= 80 ? '🎉 Excellent!' : quizResults.score >= 60 ? '👍 Good job!' : '💪 Keep practicing!'}
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#888', marginBottom: '20px', lineHeight: 1.6 }}>
            {quizResults.feedback}
          </div>

          {quiz.questions.map((q: any, i: number) => {
            const result = quizResults.results.find((r: any) => r.questionId === q.id)
            return (
              <div key={i} style={{
                background: '#141414',
                border: `1px solid ${result?.correct ? '#22c55e33' : '#ef444433'}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <div style={{
                    background: result?.correct ? '#22c55e22' : '#ef444422',
                    color: result?.correct ? '#22c55e' : '#ef4444',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600
                  }}>
                    {result?.correct ? '✓ Correct' : '✗ Incorrect'}
                  </div>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#fff' }}>
                  {q.question}
                </div>

                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                  Your answer: <span style={{ color: result?.correct ? '#22c55e' : '#ef4444' }}>{quizAnswers[q.id]}</span>
                </div>

                {!result?.correct && (
                  <div style={{ fontSize: '12px', color: '#22c55e', marginBottom: '8px' }}>
                    Correct answer: {q.correctAnswer}
                  </div>
                )}

                <div style={{ fontSize: '12px', color: '#7F77DD', marginTop: '8px', lineHeight: 1.5 }}>
                  💡 {result?.explanation}
                </div>
              </div>
            )
          })}

          <button
            onClick={() => { setShowQuiz(false); setQuizResults(null) }}
            style={{
              width: '100%',
              background: '#7F77DD',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '8px'
            }}>
            Done
          </button>
        </>
      ) : quiz ? (
        <>
          {quiz.questions.map((q: any, i: number) => (
            <div key={i} style={{
              background: '#141414',
              border: '1px solid #1f1f1f',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{
                  background: q.difficulty === 'easy' ? '#22c55e22' : q.difficulty === 'medium' ? '#f59e0b22' : '#ef444422',
                  color: q.difficulty === 'easy' ? '#22c55e' : q.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  textTransform: 'capitalize'
                }}>
                  {q.difficulty}
                </div>
              </div>

              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px', color: '#fff', lineHeight: 1.5 }}>
                {i + 1}. {q.question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((option: string, optIdx: number) => (
                  <label key={optIdx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    background: quizAnswers[q.id] === option ? '#7F77DD22' : '#0f0f0f',
                    border: quizAnswers[q.id] === option ? '1px solid #7F77DD' : '1px solid #222',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      checked={quizAnswers[q.id] === option}
                      onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: option })}
                      style={{ marginRight: '10px' }}
                    />
                    <span style={{ fontSize: '13px', color: quizAnswers[q.id] === option ? '#fff' : '#888' }}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={submitQuiz}
            disabled={Object.keys(quizAnswers).length < quiz.questions.length}
            style={{
              width: '100%',
              background: Object.keys(quizAnswers).length < quiz.questions.length ? '#333' : '#7F77DD',
              color: Object.keys(quizAnswers).length < quiz.questions.length ? '#555' : '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: Object.keys(quizAnswers).length < quiz.questions.length ? 'not-allowed' : 'pointer'
            }}>
            Submit Quiz ({Object.keys(quizAnswers).length}/{quiz.questions.length} answered)
          </button>
        </>
      ) : null}
    </div>
  </>
)}
{showFlashcards && (
  <>
    <div
      onClick={() => setShowFlashcards(false)}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.9)',
        zIndex: 500,
        backdropFilter: 'blur(4px)'
      }}
    />

    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: isMobile() ? '92vw' : '600px',
      background: '#0a0a0a',
      maxHeight: '85vh',
      overflowY: 'auto',
      border: '1px solid #1f1f1f',
      borderRadius: '16px',
      padding: isMobile() ? '20px' : '32px',
      zIndex: 501,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '20px' }}>Study Flashcards</div>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
            {topic} • {flashcards.length} cards
          </div>
        </div>
        <button
          onClick={() => setShowFlashcards(false)}
          style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '22px' }}>
          ×
        </button>
      </div>

      {loadingFlashcards ? (
        <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '100px 20px' }}>
          Generating flashcards from your conversation...
        </div>
      ) : flashcards.length > 0 ? (
        <>
          <div style={{ 
            perspective: '1000px',
            marginBottom: '24px'
          }}>
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                position: 'relative',
                width: '100%',
                height: '280px',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                transition: 'transform 0.6s',
                cursor: 'pointer'
              }}>
              {/* Front of card */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', textTransform: 'uppercase' }}>
                  Question
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff', textAlign: 'center', lineHeight: 1.6 }}>
                  {flashcards[currentCardIndex]?.question}
                </div>
                <div style={{ position: 'absolute', bottom: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                  Click to reveal answer
                </div>
              </div>

              {/* Back of card */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #7F77DD, #3b82f6)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transform: 'rotateY(180deg)'
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', textTransform: 'uppercase' }}>
                  Answer
                </div>
                <div style={{ fontSize: '16px', color: '#fff', textAlign: 'center', lineHeight: 1.7 }}>
                  {flashcards[currentCardIndex]?.answer}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', color: '#888' }}>
              Card {currentCardIndex + 1} of {flashcards.length}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                fontSize: '11px',
                background: flashcards[currentCardIndex]?.difficulty === 'easy' ? '#22c55e22' : flashcards[currentCardIndex]?.difficulty === 'medium' ? '#f59e0b22' : '#ef444422',
                color: flashcards[currentCardIndex]?.difficulty === 'easy' ? '#22c55e' : flashcards[currentCardIndex]?.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
                padding: '4px 10px',
                borderRadius: '4px',
                textTransform: 'capitalize'
              }}>
                {flashcards[currentCardIndex]?.difficulty}
              </div>
              <div style={{
                fontSize: '11px',
                background: '#7F77DD22',
                color: '#7F77DD',
                padding: '4px 10px',
                borderRadius: '4px',
                textTransform: 'capitalize'
              }}>
                {flashcards[currentCardIndex]?.category}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={prevCard}
              style={{
                flex: 1,
                background: '#1f1f1f',
                color: '#fff',
                border: '1px solid #333',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
              ← Previous
            </button>
            <button
              onClick={nextCard}
              style={{
                flex: 1,
                background: '#7F77DD',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
              Next →
            </button>
          </div>

          <button
            onClick={toggleShuffle}
            style={{
              width: '100%',
              background: shuffleMode ? '#ec489922' : 'transparent',
              color: shuffleMode ? '#ec4899' : '#888',
              border: '1px solid ' + (shuffleMode ? '#ec4899' : '#333'),
              padding: '10px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            🔀 Shuffle Mode {shuffleMode ? 'ON' : 'OFF'}
          </button>

          
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#555', textAlign: 'center' }}>
            Reviewed: {reviewedCards.size} / {flashcards.length} cards
          </div>

          {/* ADD THIS EXPORT BUTTON HERE ⬇️ */}
          <button
            onClick={exportFlashcardsAsJSON}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#ec4899',
              border: '1px solid #ec4899',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '12px'
            }}>
            📥 Export Flashcards as JSON
          </button>

        </>
      ) : (
        <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '60px 20px' }}>
          Failed to generate flashcards. Try again.
        </div>
      )}
    </div>
  </>
)}


    </main>
  )
}