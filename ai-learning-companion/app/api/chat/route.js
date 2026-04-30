import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const { message, topic, history, userId, socraticMode } = await request.json()

    const conversationMessages = [
      {
        role: 'system',
        content: `You are Alex — teaching ${topic}.

FIRST PRINCIPLES: Start with WHY, build from basics, use everyday analogies

PERSONALITY: Warm, funny, celebrate wins, never say "wrong"

ADAPTIVE TEACHING: Focus on what they struggle with

${socraticMode ? 'SOCRATIC MODE: Never give direct answers. Ask 2-3 leading questions.' : ''}

FLOW: Hook → Why → Build → Example → One question

FORMAT: Max 2 lines, **bold** terms, 130 words (ignore for roadmaps)`
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

    return Response.json({ reply })

  } catch (error) {
    console.error('Chat error:', error)
    return Response.json({ reply: 'Error: ' + error.message }, { status: 500 })
  }
}