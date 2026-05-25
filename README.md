# 📊 Trakly - Competitive Programming Analytics Platform

Trakly is a full-stack, AI-powered analytics dashboard engineered for competitive programmers. It aggregates user statistics across multiple coding platforms to provide a unified view of performance, consistency, and skill progression. Beyond basic metric tracking, Trakly leverages Large Language Models (LLMs) to autonomously analyze a user's coding patterns and generate targeted, topic-specific practice recommendations.

---

## 🚀 Key Features

* **Multi-Platform Integration:** Securely link and unlink Codeforces and LeetCode profiles to aggregate historical submission data.
* **Unified Analytics Engine:** Aggregates total problem counts and generates detailed topic-wise breakdowns to visualize proficiency across different algorithms and data structures.
* **Consistency Heatmap:** Displays a GitHub-style daily activity heatmap reflecting problems solved across all linked platforms on any given day.
* **AI-Powered Performance Analysis:** Leverages the **Google Gemini API** to analyze aggregated data, autonomously identifying the user's distinct strong and weak topics.
* **Smart Problem Recommendation:** Dynamically queries the database to serve a curated, deduplicated "Practice Plan" targeting the user's identified weak areas at an appropriate difficulty rating.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Redux Toolkit, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Infrastructure & Queues** | Redis, BullMQ |
| **AI Integration** | Google Gemini API |

---

## 🧠 System Architecture & Engineering Highlights

Trakly is engineered to handle heavy data ingestion asynchronously without degrading user experience or blocking the primary application thread.

* **Asynchronous Background Processing:** Fetching thousands of historical submissions synchronously would block the Node.js event loop. Data synchronization is entirely offloaded to a separate background worker process utilizing **Redis** and **BullMQ**.
* **Real-Time Streaming with SSE:** Instead of relying on inefficient, network-heavy client polling to check if background syncs are complete, the architecture implements **Server-Sent Events (SSE)** to stream live job completion statuses directly to the React frontend.
* **Fault-Tolerant Data Ingestion:** The worker loop is designed defensively, incorporating rate-limiting logic to strictly adhere to third-party API constraints (e.g., Codeforces' 1 request/2 seconds limit), effectively preventing IP bans during mass data syncs.
* **Optimized Database Queries:** Recommendation generation utilizes MongoDB's `$nin` operator for database-level exclusion, drastically improving performance by preventing the in-memory processing of duplicate problems.

---

## ⚙️ Local Setup & Installation

Follow these steps to get a local copy of Trakly up and running.

### Prerequisites
* Node.js (v16.x or higher)
* MongoDB (Local instance or Atlas URI)
* Redis (Running locally or via a cloud provider on port `6379`)

### 1. Clone the Repository
```bash
git clone [https://github.com/abhi-sharma-60/trakly.git](https://github.com/yourusername/trakly.git)
cd trakly
