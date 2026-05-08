export async function POST(request) {
  try {
    const { sessions } = await request.json()

    if (!sessions || sessions.length === 0) {
      return Response.json({
        totalSessions: 0,
        topicsStudied: [],
        streak: 0,
        overallMastery: 0
      })
    }

    // Calculate stats from sessions
    const topicsMap = {}
    
    sessions.forEach(session => {
      if (!topicsMap[session.topic]) {
        topicsMap[session.topic] = {
          name: session.topic,
          messageCount: 0,
          lastStudied: session.timestamp
        }
      }
      topicsMap[session.topic].messageCount += session.messageCount
      if (new Date(session.timestamp) > new Date(topicsMap[session.topic].lastStudied)) {
        topicsMap[session.topic].lastStudied = session.timestamp
      }
    })

    const topicsStudied = Object.values(topicsMap).map(t => ({
      ...t,
      lastStudied: new Date(t.lastStudied).toLocaleDateString()
    }))

    // Calculate streak
    const dates = sessions.map(s => new Date(s.timestamp).toDateString())
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a))
    
    let streak = 0
    const today = new Date().toDateString()
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - streak)
      
      if (uniqueDates[i] === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }

    const totalMessages = sessions.reduce((sum, s) => sum + s.messageCount, 0)
    const overallMastery = Math.min(Math.floor(totalMessages / 10) * 10, 100)

    return Response.json({
      totalSessions: sessions.length,
      topicsStudied,
      streak,
      overallMastery
    })

  } catch (error) {
    console.error('Stats error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}