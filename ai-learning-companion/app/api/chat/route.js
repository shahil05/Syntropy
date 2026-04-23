import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request) {
  try {
    const { message, topic } = await request.json()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert AI tutor helping someone learn ${topic}. Be concise, friendly, and use simple examples. Ask follow-up questions to check understanding. Keep responses under 150 words.`
        },
        {
          role: 'user',
          content: message
        }
      ]
    })

    return Response.json({
      reply: completion.choices[0].message.content
    })

  } catch (error) {
    console.error('Groq error:', error.message)
    return Response.json({ 
      reply: 'Error: ' + error.message 
    }, { status: 500 })
  }
}