# 🎓 AI Learning Companion

> A fully adaptive AI tutor that learns *you* — tracks your weak spots, builds personalized roadmaps, generates quizzes, and remembers everything across sessions using Vector DB memory.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Groq API](https://img.shields.io/badge/Groq%20API-F55036?style=flat-square&logo=groq&logoColor=white)
![LLaMA](https://img.shields.io/badge/LLaMA%203.3%2070B-6B48FF?style=flat-square&logo=meta&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)

---

## ✨ What It Does

Most learning apps give everyone the same content. This one doesn't.

The AI Learning Companion builds a persistent model of *your* knowledge — what you know, what you're struggling with, and what you need next. Every session starts smarter than the last.

---

## 🚀 Features

- **Adaptive Chat** — Conversational AI tutor powered by LLaMA 3.3 70B via Groq. Explains concepts, answers questions, and adjusts depth based on your level.
- **Quiz Generation** — Enter any topic and get an AI-generated quiz. Your answers are graded and fed back into your knowledge profile.
- **Weak Spot Detection** — The gaps engine tracks where you consistently struggle and surfaces those areas in future sessions.
- **Personalized Roadmap** — Dynamically generated learning path based on your goals and current weak spots. Updates as you improve.
- **Vector DB Memory** — Your learning history is embedded and stored so the AI genuinely remembers you across sessions — not just within one chat.
- **Progress Stats** — Dashboard showing your improvement over time, topics covered, and mastery levels.
- **Flashcard Export** — Export your session as Anki-style flashcards (JSON) for offline revision.
- **PDF Export** — Export your full conversation and roadmap as a PDF.

---

## 🖥️ Demo

> 🚀 Live demo: *coming soon*

![App Screenshot](./docs/screenshot.png)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| AI Model | LLaMA 3.3 70B Versatile (via Groq API) |
| Memory | Vector DB (long-term user knowledge) |
| Styling | Tailwind CSS |
| Runtime | Node.js |

---

## 📁 Project Structure

```
ai-learning-companion/
├── app/
│   ├── api/
│   │   ├── chat/          # Groq chat endpoint
│   │   ├── flashcards/    # Flashcard generation & export
│   │   ├── gaps/          # Weak spot detection engine
│   │   ├── memory/        # Vector DB read/write for user knowledge
│   │   ├── quiz/          # Quiz generation & grading
│   │   ├── roadmap/       # Personalized roadmap generator
│   │   └── stats/         # Progress tracking & analytics
│   ├── chat/              # Chat UI page
│   ├── quiz/              # Quiz UI page
│   ├── roadmap/           # Roadmap UI page
│   └── layout.tsx
├── .env.example
├── CLAUDE.md              # AI agent instructions
└── README.md
```

---

## 🧠 How It Works

```
User Message
     │
     ▼
Groq API (LLaMA 3.3 70B) ──► Response
     │
     ▼
Memory Engine (Vector DB)
     │
     ├──► Gaps Tracker    ──► Weak Spot Profile
     │
     └──► Roadmap Engine  ──► Updated Learning Path
                │
                ▼
         Stats Dashboard
```

1. User chats or takes a quiz on any topic
2. Responses and scores are embedded into the Vector DB under the user's profile
3. The gaps engine identifies recurring weak areas
4. The roadmap regenerates dynamically based on current knowledge state
5. Every new session pulls context from memory — the AI knows your history

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Groq API key → [console.groq.com](https://console.groq.com)

### Installation

```bash
# Clone
git clone https://github.com/shahil05/ai-learning-companion.git
cd ai-learning-companion/ai-learning-companion

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your keys to .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

```env
GROQ_API_KEY=your_groq_api_key
VECTOR_DB_API_KEY=your_vector_db_key
```

---

## 🗺️ Roadmap

- [x] Adaptive chat with LLaMA 3.3 70B via Groq
- [x] AI-powered quiz generation & grading
- [x] Weak spot / knowledge gap detection
- [x] Personalized learning roadmap
- [x] Vector DB memory across sessions
- [x] Progress stats dashboard
- [x] Flashcard export (JSON)
- [x] PDF export (conversation + roadmap)
- [ ] User authentication
- [ ] Spaced repetition scheduling
- [ ] Mobile responsive UI
- [ ] Browser co-pilot mode

---

## 📄 License

MIT © [Shahil](https://github.com/shahil05)

---

<p align="center">Built from scratch in 30 days with zero prior dev experience — using AI as a coding partner.</p>
