import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const { action, topic, history, gaps, answers } = await request.json()

    if (action === 'generate') {
      // Generate quiz questions
      const conversationSummary = history.map(m => `[${m.role}]: ${m.content}`).join('\n')

      let gapInfo = ''
      if (gaps) {
        gapInfo = `\nFocus on these weak areas: ${gaps.weakConcepts?.join(', ') || 'general concepts'}`
      }

      const quizPrompt = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a quiz generator. Create 5 questions to test understanding.

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Rules:
- Questions should test UNDERSTANDING, not memorization
- Mix of easy/medium/hard questions
- Focus on weak areas if provided
- Each question should have 4 options
- Make questions practical and scenario-based`
          },
          {
            role: 'user',
            content: `Topic: ${topic}

Student's conversation:
${conversationSummary}
${gapInfo}

Generate 5 multiple-choice questions.`
          }
        ]
      })

      const rawText = quizPrompt.choices[0].message.content
      const cleanText = rawText.replace(/```json|```/g, '').trim()
      const quiz = JSON.parse(cleanText)

      return Response.json({ quiz })

    } else if (action === 'grade') {
      // Grade quiz answers
      const gradingPrompt = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a quiz grader. Grade the student's answers and provide explanations.

Return ONLY valid JSON:
{
  "results": [
    {
      "questionId": 1,
      "correct": true,
      "explanation": "Brief explanation of why the answer is correct/incorrect"
    }
  ],
  "score": 80,
  "feedback": "Overall feedback on performance"
}`
          },
          {
            role: 'user',
            content: `Topic: ${topic}

Grade these answers:
${JSON.stringify(answers, null, 2)}

Provide detailed explanations for each answer.`
          }
        ]
      })

      const rawText = gradingPrompt.choices[0].message.content
      const cleanText = rawText.replace(/```json|```/g, '').trim()
      const results = JSON.parse(cleanText)

      return Response.json({ results })
    }

  } catch (error) {
    console.error('Quiz error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}