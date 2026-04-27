import Groq from 'groq-sdk'
import { Pinecone } from '@pinecone-database/pinecone'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const INDEX_NAME = 'ai-learning-companion'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const topic = searchParams.get('topic')

    // 1. Fetch ALL memories for this user
    const index = pinecone.index(INDEX_NAME)
    const results = await index.searchRecords({
      query: {
        inputs: { text: topic },
        topK: 20
      },
      filter: { userId: { '$eq': userId } },
      fields: ['text', 'role', 'topic', 'timestamp']
    })

    const memories = results.result.hits.map(h => h.fields)

    if (memories.length < 3) {
      return Response.json({
        gaps: [],
        message: 'Not enough learning history yet. Keep chatting!'
      })
    }

    // 2. Ask Groq to analyze the gaps
    const conversationSummary = memories
      .map(m => `[${m.role}]: ${m.text}`)
      .join('\n')

    const analysis = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert learning analyst. Analyze a student's learning conversation and identify knowledge gaps.

Return ONLY a valid JSON object in this exact format, nothing else:
{
  "masteredConcepts": ["concept1", "concept2"],
  "weakConcepts": ["concept1", "concept2"],
  "confusedConcepts": ["concept1", "concept2"],
  "recommendedNextTopic": "the single most important concept to learn next",
  "overallMasteryScore": 45
}

Rules:
- masteredConcepts: things the student answered correctly and confidently
- weakConcepts: things they got partially right or needed hints
- confusedConcepts: things they got wrong or said they didn't understand
- recommendedNextTopic: ONE specific concept they should learn next
- overallMasteryScore: 0-100 number based on how well they understand the topic overall`
        },
        {
          role: 'user',
          content: `Analyze this student's learning session about ${topic}:\n\n${conversationSummary}`
        }
      ]
    })

    // 3. Parse the JSON response
    const rawText = analysis.choices[0].message.content
    const cleanText = rawText.replace(/```json|```/g, '').trim()
    const gaps = JSON.parse(cleanText)

    return Response.json({ gaps, memoriesAnalyzed: memories.length })

  } catch (error) {
    console.error('Gaps error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}