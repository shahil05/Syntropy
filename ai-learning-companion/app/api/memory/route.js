import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
})

const INDEX_NAME = 'ai-learning-companion'

export async function POST(request) {
  try {
    const { userId, topic, message, role } = await request.json()

    const index = pinecone.index(INDEX_NAME)

    await index.upsertRecords([{
      id: `${userId}-${Date.now()}`,
      text: message,
      userId: userId,
      topic: topic,
      role: role,
      timestamp: new Date().toISOString()
    }])

    return Response.json({ success: true })

  } catch (error) {
    console.error('Memory save error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const query = searchParams.get('query') || 'learning'

    const index = pinecone.index(INDEX_NAME)

    const results = await index.searchRecords({
      query: {
        inputs: { text: query },
        topK: 5
      },
      filter: { userId: { '$eq': userId } },
      fields: ['text', 'userId', 'topic', 'role', 'timestamp']
    })

    const memories = results.result.hits.map(h => h.fields)

    return Response.json({ memories })

  } catch (error) {
    console.error('Memory fetch error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}