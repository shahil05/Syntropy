import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const { topic, history } = await request.json()

    if (history.length < 8) {
      return Response.json({
        error: 'Need more conversation to generate flashcards'
      }, { status: 400 })
    }

    const conversationSummary = history.map(m => `[${m.role}]: ${m.content}`).join('\n')

    const flashcardPrompt = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a flashcard generator. Create study flashcards from conversations.

Return ONLY valid JSON:
{
  "flashcards": [
    {
      "id": 1,
      "question": "Clear, specific question",
      "answer": "Concise answer (2-3 sentences max)",
      "difficulty": "easy|medium|hard",
      "category": "concept|definition|example|application"
    }
  ]
}

Rules:
- Generate 8-10 flashcards
- Questions should be clear and testable
- Answers should be concise but complete
- Mix of different difficulty levels
- Focus on KEY concepts, not minor details
- Use active recall format (not yes/no questions)`
        },
        {
          role: 'user',
          content: `Topic: ${topic}

Conversation:
${conversationSummary}

Generate flashcards covering the main concepts discussed.`
        }
      ]
    })

    const rawText = flashcardPrompt.choices[0].message.content
    const cleanText = rawText.replace(/```json|```/g, '').trim()
    const data = JSON.parse(cleanText)

    return Response.json({ flashcards: data.flashcards })

  } catch (error) {
    console.error('Flashcard error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}