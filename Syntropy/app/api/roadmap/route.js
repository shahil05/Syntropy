import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const { topic, history, gaps } = await request.json()

    const conversationSummary = history.map(m => `[${m.role}]: ${m.content}`).join('\n')

    let gapInfo = ''
    if (gaps) {
      gapInfo = `\nKnowledge gaps:
- Mastered: ${gaps.masteredConcepts?.join(', ') || 'none'}
- Weak: ${gaps.weakConcepts?.join(', ') || 'none'}
- Confused: ${gaps.confusedConcepts?.join(', ') || 'none'}`
    }

    const roadmapPrompt = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a learning path architect. Create a personalized roadmap based on the student's current knowledge.

Return ONLY valid JSON in this exact format:
{
  "currentLevel": "beginner|intermediate|advanced",
  "topicsCovered": ["topic1", "topic2"],
  "nextTopics": [
    {
      "name": "Topic name",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedHours": 5,
      "prerequisites": ["prerequisite1"],
      "why": "One sentence explaining why this topic is important next"
    }
  ],
  "estimatedCompletionWeeks": 8
}`
        },
        {
          role: 'user',
          content: `Student is learning: ${topic}

Conversation history:
${conversationSummary}
${gapInfo}

Generate a personalized 5-topic roadmap showing what they should learn next.`
        }
      ]
    })

    const rawText = roadmapPrompt.choices[0].message.content
    const cleanText = rawText.replace(/```json|```/g, '').trim()
    const roadmap = JSON.parse(cleanText)

    return Response.json({ roadmap })

  } catch (error) {
    console.error('Roadmap error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}