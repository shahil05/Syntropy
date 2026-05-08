<div align="center">

# Syntropy

### The AI tutor that actually knows you.

*Adaptive learning powered by LLaMA 3.3 70B — with memory, not just chat.*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-syntropy--eta.vercel.app-6366f1?style=for-the-badge)](https://syntropy-v7ia.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Groq](https://img.shields.io/badge/Groq%20API-F55036?style=flat-square&logo=groq&logoColor=white)
![LLaMA](https://img.shields.io/badge/LLaMA%203.3%2070B-6B48FF?style=flat-square&logo=meta&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)

</div>

---

## The Problem

Every learning app treats you the same. YouTube tutorials don't know you failed recursion twice. Udemy doesn't remember you aced dynamic programming last week. You're always starting from zero.

**Syntropy doesn't forget.**

---

## What Syntropy Does

Syntropy builds a persistent model of your knowledge. Every quiz you take, every concept you chat about, every gap you expose — it all gets stored in a Vector DB and fed back into your next session. The AI gets smarter about *you* over time.

```
Day 1:  "Explain binary trees"          →  Baseline established
Day 3:  Quiz on trees → 60% score       →  Weak spot flagged
Day 5:  Roadmap auto-updates            →  Trees prioritized
Day 7:  "Let's review what you missed"  →  AI remembers everything
```

---

## Features

| Feature | What it does |
|---------|-------------|
| 🤖 **Adaptive Chat** | AI tutor that adjusts depth and pace to your level in real time |
| 🧠 **Vector DB Memory** | Your learning history persists across sessions — not just within one chat |
| 📝 **Quiz Engine** | Enter any topic, get an AI-generated quiz, get graded instantly |
| 🎯 **Weak Spot Detection** | Gaps engine tracks where you consistently struggle and resurfaces those areas |
| 🗺️ **Personalized Roadmap** | Dynamic learning path built from your goals and current knowledge state |
| 📊 **Progress Dashboard** | Visual stats — topics mastered, sessions completed, improvement over time |
| 🃏 **Flashcard Export** | Export session as Anki-compatible flashcards (JSON) for offline revision |
| 📄 **PDF Export** | Export your full conversation and roadmap as a PDF |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| AI Model | LLaMA 3.3 70B Versatile via Groq API |
| Memory | Vector DB — long-term user knowledge store |
| Styling | Tailwind CSS |
| Deployment | Vercel |

> **Why Groq?** LLaMA 3.3 70B on Groq runs at ~800 tokens/second — near-instant responses. Learning shouldn't feel like waiting.

---

## Architecture

```
┌──────────────────────────────────────────────┐
│                 User Session                  │
└─────────────────────┬────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │   Next.js App Router    │
         │  (chat / quiz / roadmap)│
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │       Groq API          │
         │    LLaMA 3.3 70B        │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │     Memory Engine       │
         │      (Vector DB)        │
         └──────┬──────────┬───────┘
                │          │
   ┌────────────▼─┐  ┌─────▼─────────────┐
   │ Gaps Tracker │  │  Roadmap Generator │
   │ (weak spots) │  │  (learning path)   │
   └──────────────┘  └────────────────────┘
```

---

## Project Structure

```
Syntropy/
├── app/
│   ├── api/
│   │   ├── chat/          # Groq streaming endpoint
│   │   ├── flashcards/    # Flashcard generation & JSON export
│   │   ├── gaps/          # Weak spot detection engine
│   │   ├── memory/        # Vector DB read/write
│   │   ├── quiz/          # Quiz generation & grading
│   │   ├── roadmap/       # Personalized roadmap generator
│   │   └── stats/         # Progress analytics
│   ├── chat/              # Chat UI
│   ├── quiz/              # Quiz UI
│   ├── roadmap/           # Roadmap UI
│   └── layout.tsx
├── public/
├── .env.example
├── AGENTS.md
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Groq API key — [console.groq.com](https://console.groq.com) *(free tier available)*

### Installation

```bash
# Clone
git clone https://github.com/shahil05/Syntropy.git
cd Syntropy

# Install
npm install

# Configure
cp .env.example .env.local
# Add your GROQ_API_KEY and VECTOR_DB_API_KEY

# Run
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
GROQ_API_KEY=your_groq_api_key
VECTOR_DB_API_KEY=your_vector_db_api_key
```

---

## Roadmap

- [x] Adaptive chat with LLaMA 3.3 70B via Groq
- [x] AI-powered quiz generation & grading
- [x] Weak spot / knowledge gap detection
- [x] Personalized dynamic learning roadmap
- [x] Vector DB memory across sessions
- [x] Progress stats dashboard
- [x] Flashcard export (JSON / Anki-compatible)
- [x] PDF export (conversation + roadmap)
- [ ] Collaborative learning workspace
- [ ] Chat history analysis (learn from past sessions)
- [ ] User authentication & profiles
- [ ] Spaced repetition scheduling
- [ ] Mobile app

---

## License

MIT © [Shahil](https://github.com/shahil05)

---

<div align="center">

**[Try it live →](https://syntropy-v7ia.vercel.app)**

</div>
