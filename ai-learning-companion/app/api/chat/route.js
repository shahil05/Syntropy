import Groq from 'groq-sdk'
import { Pinecone } from '@pinecone-database/pinecone'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const INDEX_NAME = 'ai-learning-companion'

async function saveMemory(userId, topic, message, role) {
  try {
    const index = pinecone.index(INDEX_NAME)
    await index.upsert([{
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
      query: { inputs: { text: query }, topK: 5 },
      filter: { userId: { '$eq': userId } },
      fields: ['text', 'role', 'topic', 'timestamp']
    })
    return results.result.hits.map(h => h.fields)
  } catch (err) {
    console.error('Fetch memory failed:', err.message)
    return []
  }
}

async function analyzeGaps(userId, topic) {
  try {
    const index = pinecone.index(INDEX_NAME)
    const results = await index.searchRecords({
      query: { inputs: { text: topic }, topK: 15 },
      filter: { userId: { '$eq': userId } },
      fields: ['text', 'role']
    })

    const memories = results.result.hits.map(h => h.fields)
    if (memories.length < 3) return null

    const conversationSummary = memories.map(m => `[${m.role}]: ${m.text}`).join('\n')

    const analysis = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Analyze this learning conversation and return ONLY valid JSON:
{
  "weakConcepts": ["concept1", "concept2"],
  "confusedConcepts": ["concept1"],
  "masteredConcepts": ["concept1"]
}`
        },
        { role: 'user', content: `Analyze for ${topic}:\n${conversationSummary}` }
      ]
    })

    const rawText = analysis.choices[0].message.content
    const cleanText = rawText.replace(/```json|```/g, '').trim()
    return JSON.parse(cleanText)

  } catch (err) {
    console.error('Gap analysis failed:', err.message)
    return null
  }
}

export async function POST(request) {
  try {
    const { message, topic, history, userId, socraticMode } = await request.json()

    saveMemory(userId, topic, message, 'user')

    const memories = await fetchMemories(userId, message)
    const gaps = await analyzeGaps(userId, topic)

    let memoryContext = ''
    if (memories.length > 0) {
      memoryContext = `\n\nRELEVANT PAST MEMORIES:\n` +
        memories.map(m => `- [${m.role}] ${m.text}`).join('\n')
    }

    let gapContext = ''
    if (gaps) {
      gapContext = `\n\nSTUDENT KNOWLEDGE GAPS:\n` +
        `- Weak areas: ${gaps.weakConcepts?.join(', ') || 'none identified'}\n` +
        `- Confused about: ${gaps.confusedConcepts?.join(', ') || 'none identified'}\n` +
        `- Already mastered: ${gaps.masteredConcepts?.join(', ') || 'none identified'}\n\n` +
        `ADAPTIVE INSTRUCTION: When you ask questions, focus on their weak and confused areas. ` +
        `Skip concepts they've already mastered unless building on them.`
    }

    const conversationMessages = [
      {
        role: 'system',
        content: `You are Alex — the best teacher the student has ever had. Teaching ${topic}.

FIRST PRINCIPLES TEACHING:
- Start with WHY, not definitions
- Build from basics upward
- Use analogies from everyday life

PERSONALITY:
- Warm, funny, genuinely excited
- Celebrate correct answers
- Never say "wrong" — say "interesting, but here's what's happening..."

ADAPTIVE TEACHING — CRITICAL:
- You have access to this student's knowledge gaps below
- Ask questions ONLY about their weak/confused areas
- When they answer correctly, move to next weak area
- When they answer incorrectly, explain differently and re-test
- NEVER ask about concepts they've mastered unless building on them
- After every explanation, ask ONE targeted question about their weakest concept

${socraticMode ? `
SOCRATIC MODE ACTIVE — NEVER GIVE DIRECT ANSWERS:
- When asked a question, respond with 2-3 leading questions that guide them to the answer
- Use analogies from things they already know
- Break complex questions into smaller questions
- If they get stuck, give a tiny hint in the form of another question
- Only after 2-3 exchanges can you confirm their answer
- Example: "What's a loop?" → "Have you ever done the same task over and over? Like checking your phone every 5 minutes? What would you call that pattern?"
- NEVER say "A loop is..." — always ask questions that make THEM say it
` : ''}${gapContext}${memoryContext}


FLOW:
1. Hook with surprising fact
2. Explain WHY it exists
3. Build up layer by layer
4. Give concrete example
5. Ask ONE question targeting their weakest area
6. Move forward after one exchange

FORMAT:
- Max 2 lines before line break
- **Bold** key terms
- Bullet points for 3+ items
- Ask question only when introducing new concept OR testing weak area
- 130 word limit (ignore for roadmaps)

SPECIAL: If asked for roadmap/plan → give full week-by-week breakdown`
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
    saveMemory(userId, topic, reply, 'ai')

    return Response.json({ reply })

  } catch (error) {
    console.error('Chat error:', error.message)
    return Response.json({ reply: 'Error: ' + error.message }, { status: 500 })
  }
}