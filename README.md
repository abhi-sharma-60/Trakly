# 🚀 Trakly — Competitive Programming Analytics Platform

<div align="center">

### 📊 Track • Analyze • Improve • Repeat

An AI-powered full-stack analytics dashboard for competitive programmers that aggregates coding statistics, visualizes consistency, and generates personalized practice recommendations using LLMs.

🌐 **Live Demo:** https://trakly-v2fs.onrender.com/  
📂 **Repository:** https://github.com/abhi-sharma-60/Trakly

</div>

---

# ✨ Overview

**Trakly** is a modern competitive programming analytics platform designed to help programmers monitor their growth across multiple coding platforms in one unified dashboard.

Instead of manually checking profiles across different websites, Trakly automatically aggregates data from platforms like Codeforces and LeetCode, analyzes performance trends, and uses AI to recommend what topics to practice next.

The platform is engineered with scalability and real-time responsiveness in mind using asynchronous workers, Redis queues, and SSE-based live updates.

---

# 🚀 Features

## 🔗 Multi-Platform Integration

- Connect and disconnect coding profiles securely.
- Supports:
  - Codeforces
  - LeetCode
- Aggregates historical submission data from all linked platforms.

---

## 📈 Unified Analytics Dashboard

- Total solved problems across platforms.
- Topic-wise breakdown of:
  - Dynamic Programming
  - Graphs
  - Trees
  - Greedy
  - Binary Search
  - And many more...
- Performance visualization for algorithmic strengths and weaknesses.

---

## 🔥 Consistency Heatmap

- GitHub-style activity heatmap.
- Tracks daily problem-solving consistency.
- Combines submissions from all connected platforms.

---

## 🤖 AI-Powered Performance Analysis

Uses the Gemini API to:

- Analyze coding patterns
- Detect weak and strong topics
- Generate actionable insights
- Suggest improvement strategies automatically

---

## 🎯 Smart Problem Recommendations

- Personalized "Practice Plan" generation
- AI-driven topic targeting
- Difficulty-aware recommendations
- Deduplicated problem suggestions using optimized database queries

---

# 🛠️ Tech Stack

## 🎨 Frontend

- React.js
- Redux Toolkit
- Tailwind CSS

---

## ⚙️ Backend

- Node.js
- Express.js

---

## 🗄️ Database

- MongoDB
- Mongoose

---

## 🚦 Infrastructure & Queues

- Redis
- BullMQ

---

## 🧠 AI Integration

- Google Gemini API

---

# 🧠 System Architecture & Engineering Highlights

## ⚡ Asynchronous Background Processing

Fetching thousands of submissions synchronously would block the Node.js event loop and severely degrade performance.

To solve this:

- Submission synchronization is offloaded to dedicated background workers
- Powered by Redis queues and BullMQ workers
- Ensures a smooth and responsive frontend experience

---

## 📡 Real-Time Streaming with SSE

Instead of inefficient client-side polling:

- Implemented **Server-Sent Events (SSE)** for real-time communication
- Streams live sync progress directly to the frontend
- Provides instant job completion updates

---

## 🛡️ Fault-Tolerant Data Ingestion

Designed defensively to handle third-party API constraints safely.

### Includes:

- Rate limiting
- Retry handling
- Queue-based processing
- Controlled synchronization pipelines

Example:

- Adheres strictly to Codeforces API constraints (1 request / 2 seconds) to avoid bans

---

## 🚀 Optimized Database Queries

Recommendation generation uses MongoDB query optimization techniques such as:

- `$nin` operator for exclusion
- Database-level deduplication
- Reduced in-memory filtering
- Faster recommendation pipelines

---

# 📂 Project Structure

```bash
Trakly/
│
├── client/          # React Frontend
├── server/          # Express Backend
├── workers/         # BullMQ Workers
├── models/          # Mongoose Schemas
├── routes/          # API Routes
├── controllers/     # Business Logic
├── redux/           # Redux State Management
└── utils/           # Helper Functions
