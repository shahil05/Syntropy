import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
const INDEX_NAME = 'ai-learning-companion'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const index = pinecone.index(INDEX_NAME)

    // Fetch ALL user memories (increase topK)
    const results = await index.searchRecords({
      query: { inputs: { text: 'learning session topic conversation' }, topK: 200 },
      filter: { userId: { '$eq': userId } },
      fields: ['text', 'role', 'topic', 'timestamp']
    })

    const memories = results.result.hits.map(h => h.fields)

    console.log('Fetched memories:', memories.length)

    if (memories.length === 0) {
      return Response.json({
        totalSessions: 0,
        topicsStudied: [],
        streak: 0,
        overallMastery: 0
      })
    }

    // Get unique topics
    const topicsSet = new Set()
    memories.forEach(m => {
      if (m.topic) topicsSet.add(m.topic)
    })
    const topics = Array.from(topicsSet)

    // Calculate sessions by date
    const sessionsByDate = {}
    memories.forEach(m => {
      if (!m.timestamp) return
      const date = new Date(m.timestamp).toDateString()
      if (!sessionsByDate[date]) sessionsByDate[date] = 0
      sessionsByDate[date]++
    })

    // Calculate streak
    const sortedDates = Object.keys(sessionsByDate).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    )

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < sortedDates.length; i++) {
      const sessionDate = new Date(sortedDates[i])
      sessionDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - streak)
      expectedDate.setHours(0, 0, 0, 0)

      if (sessionDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    // Build topic stats
    const topicsWithStats = topics.map(topic => {
      const topicMemories = memories.filter(m => m.topic === topic)
      
      // Find last studied
      let lastStudied = 'Unknown'
      if (topicMemories.length > 0) {
        const latest = topicMemories.reduce((a, b) => {
          const aTime = new Date(a.timestamp || 0).getTime()
          const bTime = new Date(b.timestamp || 0).getTime()
          return aTime > bTime ? a : b
        })
        if (latest.timestamp) {
          lastStudied = new Date(latest.timestamp).toLocaleDateString()
        }
      }

      return {
        name: topic,
        messageCount: topicMemories.length,
        lastStudied
      }
    }).sort((a, b) => b.messageCount - a.messageCount)

    // Calculate overall mastery (10% per 10 messages, max 100%)
    const overallMastery = Math.min(Math.floor(memories.length / 10) * 10, 100)

    const stats = {
      totalSessions: Object.keys(sessionsByDate).length,
      topicsStudied: topicsWithStats,
      streak,
      overallMastery,
      totalMessages: memories.length
    }

    console.log('Returning stats:', stats)

    return Response.json(stats)

  } catch (error) {
    console.error('Stats error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}