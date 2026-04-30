import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request) {
  try {
    const { history, topic } = await request.json();

    // 1. Move this inside to catch key errors
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is missing in .env.local" }, { status: 500 });
    }
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    if (!history || history.length < 2) {
      return NextResponse.json({ gaps: null, message: 'More chat needed' });
    }

    const conversationSummary = history.map(m => `[${m.role}]: ${m.content}`).join('\n');

    // 2. Added response_format: { type: "json_object" }
    const analysis = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" }, 
      messages: [
        {
          role: 'system',
          content: `Analyze the user's understanding of ${topic}. Return ONLY a JSON object:
          {
            "weakConcepts": [],
            "confusedConcepts": [],
            "masteredConcepts": [],
            "recommendedNextTopic": "",
            "overallMasteryScore": 0
          }`
        },
        { role: 'user', content: conversationSummary }
      ]
    });

    // 3. Bulletproof parsing
    const content = analysis.choices[0].message.content;
    const gaps = JSON.parse(content);

    return NextResponse.json({ gaps });

  } catch (error) {
    console.error('SERVER ERROR:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}