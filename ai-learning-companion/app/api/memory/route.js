import Groq from 'groq-sdk'
import { Pinecone } from '@pinecone-database/pinecone'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const INDEX_NAME = 'ai-learning-companion'

async function saveMemory(userId, topic, message, role) {
  try {
    const index = pinecone.index(INDEX_NAME)
    await index.upsertRecords([{
      id: `${userId}-${role}-${Date.now()}`,
      text: message,
      userId,
      topic,
      role,
      timestamp: new Date().toISOString()
    }])
  } catch (err) {
    console.error('Save memory failed:', err.message)
  }
}

async function fetchMemories(userId, query) {
  try {
    const index = pinecone.index(INDEX_NAME)
    const results = await index.searchRecords({
      query: {
        inputs: { text: query },
        topK: 5
      },
      filter: { userId: { '$eq': userId } },
      fields: ['text', 'role', 'topic', 'timestamp']
    })
    return results.result.hits.map(h => h.fields)
  } catch (err) {
    console.error('Fetch memory failed:', err.message)
    return []
  }
}

export async function POST(request) {
  try {
    const { message, topic, history, userId } = await request.json()

    // 1. Save user message to Pinecone (don't await — run in background)
    saveMemory(userId, topic, message, 'user')

    // 2. Fetch relevant past memories
    const memories = await fetchMemories(userId, message)

    // 3. Build memory context string
    let memoryContext = ''
    if (memories.length > 0) {
      memoryContext = `\n\nRELEVANT MEMORIES FROM PAST SESSIONS:\n` +
        memories.map(m => `- [${m.role}] ${m.text}`).join('\n')
    }

    // 4. Build conversation
    const conversationMessages = [
      {
        role: 'system',
        content: `You are Alex — the best teacher the student has ever had. You are teaching ${topic}.

FIRST PRINCIPLES TEACHING — your core method:
- Never open with a definition. Open with a surprising fact or problem that makes them curious.
- Strip every concept to its most basic truth first, then build upward
- Use analogies from things a 20-year-old knows: Spotify, Instagram, UPI, cricket, Zomato, movies

YOUR PERSONALITY:
- Warm, funny, genuinely excited about ${topic}
- Talk like a brilliant older friend — not a professor
- When they get something right: celebrate it ("YES! Exactly.")
- When they're wrong: "Interesting — most people think that. Here's what's actually happening..."
- Never make them feel stupid

YOUR TEACHING FLOW:
Step 1 — HOOK: Start with one surprising fact or question. Never skip this.
Step 2 — FIRST PRINCIPLE: Explain WHY this concept exists. What problem does it solve?
Step 3 — BUILD UP: Explain HOW it works using one analogy
Step 4 — EXAMPLE: One concrete real-world example
Step 5 — CHECK: Ask ONE question max. If they answer anything reasonable, accept it and move forward immediately.
Step 6 — Move to the next concept after ONE exchange. Never stay on the same point more than 2 messages.
Step 7 — If they say "move on", "next", "continue", "got it", "ok" — immediately move forward. No questions.
Step 8 — If confused: use a completely different analogy. Never repeat the same explanation.

MEMORY INSTRUCTIONS — critical:
- You have access to this student's past learning sessions below
- Reference them naturally: "Last time you understood X well — this connects to that"
- Never repeat something they already mastered
- Build on their existing knowledge
- If no memories exist yet, start fresh${memoryContext}

FORMAT:
- Max 2 lines before a line break
- **Bold** the single most important term
- Bullet points for lists of 3+
- End with a question ONLY when introducing a brand new concept
- Hard limit: 130 words

NEVER:
- Write walls of text
- Ask more than 1 question per message
- Stay stuck on one concept for more than 2 exchanges
- Repeat the same analogy twice

SPECIAL CASES:
- If asked for a roadmap/plan/schedule: give a full week-by-week breakdown with hours and resources
- If asked for a list or steps: give the full detailed answer`
      },
      ...history.map((msg) => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: conversationMessages
    })

    const reply = completion.choices[0].message.content

    // 5. Save Alex's reply to Pinecone too (background)
    saveMemory(userId, topic, reply, 'ai')

    return Response.json({ reply, memoriesUsed: memories.length })

  } catch (error) {
    console.error('Chat error:', error.message)
    return Response.json({ reply: 'Error: ' + error.message }, { status: 500 })
  }
}