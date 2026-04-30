import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const { history, topic } = await request.json()

    if (history.length < 6) {
      return Response.json({
        gaps: null,
        message: 'Not enough conversation yet'
      })
    }

    const conversationSummary = history.map(m => `[${m.role}]: ${m.content}`).join('\n')

    const analysis = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Analyze and return ONLY valid JSON:
{
  "weakConcepts": ["concept1"],
  "confusedConcepts": ["concept1"],
  "masteredConcepts": ["concept1"],
  "recommendedNextTopic": "what to learn next",
  "overallMasteryScore": 45
}`
        },
        { role: 'user', content: `Analyze ${topic}:\n${conversationSummary}` }
      ]
    })

    const rawText = analysis.choices[0].message.content
    const cleanText = rawText.replace(/```json|```/g, '').trim()
    const gaps = JSON.parse(cleanText)

    return Response.json({ gaps })

  } catch (error) {
    console.error('Gaps error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}