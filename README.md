# SATORI_ // Multi-Agent Investment Protocol

![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000000?style=for-the-badge&logo=postgresql&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-000000?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-000000?style=for-the-badge&logo=tailwindcss&logoColor=white)

> **Absolute clarity in financial chaos.** Satori is an autonomous, multi-agent financial terminal designed to strip away market noise. It extracts fundamental truths, gauges real-time sentiment, and executes institutional-grade thesis validation.

---

## Visual Walkthrough & System Architecture

Satori is designed to showcase complex AI orchestration (LangGraph) and real-time data streaming (Finnhub) wrapped in a brutalist, high-performance React frontend.

### 1. The Command Center (Landing Interface)
The entry point of the application utilizes a strict, monochrome "Swiss Design" aesthetic. This brutalist UI purposefully mimics high-end enterprise financial terminals, prioritizing data clarity and immediate user action over unnecessary visual clutter. 

<div align="center">
  <img src="./client/assets/01-home-hero.png" alt="Satori Home Dashboard" width="850"/>
</div>

### 2. Live Market Marquee
Directly below the hero section, the application establishes a live connection to the Finnhub API. This infinitely scrolling marquee processes real-time quotes, calculates percentage changes against previous closes, and handles conditional rendering dynamically without causing main-thread stutter.

<div align="center">
  <img src="./client/assets/02-market-marquee.png" alt="Live Market Marquee" width="850"/>
</div>

### 3. Real-Time Market Velocity (SVG Engine)
Instead of relying on heavy third-party charting libraries, Satori features a custom-built, sub-second SVG rendering engine. It polls live tick data and dynamically recalculates SVG paths to visualize institutional high-frequency data flows instantly.

<div align="center">
  <img src="./client/assets/03-live-graph.png" alt="Live SVG Market Graph" width="850"/>
</div>

### 4. Adversarial Debate & Human-in-the-Loop (HITL)
**The core of the LangGraph architecture.** To eliminate LLM confirmation bias, the system spawns two opposing AI agents (Bull vs. Bear) that process the exact same scraped financial data. 
* **The Pause:** The state machine intentionally halts execution before a final decision is made.
* **Human Override:** The user is prompted to read the debate and inject dynamic operational constraints before the graph is allowed to resume.

<div align="center">
  <img src="./client/assets/04-hitl-debate.png" alt="Bull vs Bear Debate and HITL" width="850"/>
</div>

### 5. Judicial Synthesis & Final Verdict
Once authorized by the human operator, a final "Judge" node consumes the adversarial debate and the human override constraints. It outputs a highly deterministic, JSON payload. The React frontend safely parses this raw data into a clean, actionable UI.

<div align="center">
  <img src="./client/assets/05-final-verdict.png" alt="Final Judicial Verdict" width="850"/>
</div>

### 6. Persistent State Memory (PostgreSQL Archive)
When the LangGraph pauses for the HITL check, the workflow completely halts. To prevent data loss, the entire neural mesh state is serialized and written securely to a PostgreSQL database using `@langchain/langgraph-checkpoint-postgres`. The Archive UI directly queries this database to track historical session verdicts, confidence ratings, and persistent statuses.

<div align="center">
  <img src="./client/assets/55.png" alt="PostgreSQL Session Archive" width="850"/>
</div>

---
## 💻 Tech Stack & Infrastructure

* **Frontend:** React (Vite), Tailwind CSS, Custom Mathematical SVG Charting
* **Backend:** Node.js, Express.js
* **AI / Orchestration:** LangGraph, LangChain, LLM APIs (Gemini/OpenAI)
* **Database & Memory:** PostgreSQL (LangGraph Checkpointer & Session History)
* **Data Integration:** Finnhub (Live Equity Data), Tavily (Real-time financial search)

---

## 🛠️ Quick Start & Installation

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/satori-investment-agent.git
cd satori-investment-agent
\`\`\`

### 2. Environment Variables
Create a `.env` file in the root directory and configure the following:
\`\`\`env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/satori"

# API Keys
VITE_FINNHUB_API_KEY="your_finnhub_key"
OPENAI_API_KEY="your_llm_key"
TAVILY_API_KEY="your_search_key"
\`\`\`

### 3. Install Dependencies
\`\`\`bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
\`\`\`

### 4. Boot Sequence
Start both the backend and frontend concurrently:
\`\`\`bash
# From the root directory
npm run dev
\`\`\`

---
**Author:** Mohammad Tabish  
**License:** MIT