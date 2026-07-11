# SATORI_ // Multi-Agent Investment Protocol


<p align="center">
  <img src="https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-000000?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TailwindCSS-000000?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <b>Absolute Clarity in Financial Chaos.</b><br>
  
  Autonomous Multi-Agent Financial Intelligence powered by LangGraph, LLMs, Real-Time Market Data, and Human-in-the-Loop Validation.
</p>

---

# Overview

SATORI is an enterprise-grade **AI Investment Intelligence Platform** that simulates institutional investment workflows through autonomous agent collaboration.

Instead of relying on a single LLM response, SATORI orchestrates multiple specialized AI agents that independently research, debate, validate, and synthesize financial information before producing a final investment recommendation.

The application combines:

- Autonomous AI Agents
- LangGraph State Machines
- Human-in-the-Loop Approval
- Real-Time Market Data
- Persistent PostgreSQL Memory
- Modern React Dashboard

The result is a transparent financial reasoning engine rather than a black-box chatbot.

---

# Architecture

```
                     User Query
                          │
                          ▼
                ┌───────────────────┐
                │ Supervisor Agent  │
                └─────────┬─────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
 Research Agent     Bull Analyst      Bear Analyst
        │                 │                 │
        └────────────┬────┴────┬────────────┘
                     ▼
            Human-In-The-Loop
               (Pause State)
                     │
                     ▼
               Judge Agent
                     │
                     ▼
           Final Investment Report
                     │
                     ▼
             PostgreSQL Memory
```

---

# Features

- Multi-Agent LangGraph Workflow
- Human-in-the-Loop (HITL) Validation
- Live Market Data using Finnhub API
- AI Financial Research
- Bull vs Bear Debate
- AI Judge Decision Engine
- Persistent PostgreSQL Session History
- Custom SVG Live Graph Engine
- Institutional Dashboard UI
- Responsive React Frontend
- Express Backend API

---

# Visual Walkthrough

## 1. Landing Dashboard

The landing page follows a brutalist monochrome design inspired by institutional trading terminals. The interface emphasizes readability, clarity, and performance while minimizing visual distractions.

<p align="center">
<img src="./client/src/assets/01-home-hero.png" width="900">
</p>

---

## 2. Live Market Marquee

Real-time market quotes stream continuously using the Finnhub API.

The scrolling ticker calculates:

- Current Price
- Previous Close
- Percentage Change
- Gain/Loss Status

without interrupting rendering performance.

<p align="center">
<img src="./client/src/assets/02-market-marquee.png" width="900">
</p>

---

## 3. Live SVG Market Engine

Instead of depending on external charting libraries, SATORI renders market movements using dynamically generated SVG paths.

Advantages include:

- Lightweight Rendering
- High FPS
- Real-Time Updates
- No Chart.js Dependency

<p align="center">
<img src="./client/src/assets/03-live-graph.png" width="900">
</p>

---

## 4. Bull vs Bear Debate

To minimize confirmation bias, SATORI launches two opposing investment analysts.

### Bull Agent

- Positive Catalysts
- Growth Drivers
- Upside Potential

### Bear Agent

- Risks
- Market Weakness
- Downside Scenarios

Execution intentionally pauses before generating the final decision, allowing a human operator to review both arguments.

<p align="center">
<img src="./client/src/assets/04-hitl-debate.png" width="900">
</p>

---

## 5. Judge Agent

After human approval, the Judge Agent consumes:

- Bull Analysis
- Bear Analysis
- User Constraints

and produces a structured investment verdict including:

- Recommendation
- Confidence Score
- Risk Assessment
- Supporting Evidence

<p align="center">
<img src="./client/src/assets/05-final-verdict.png" width="900">
</p>

---

## 6. PostgreSQL Session Archive

Every LangGraph checkpoint is persisted into PostgreSQL using the LangGraph Checkpointer.

Historical sessions remain accessible, allowing users to revisit previous analyses and investment decisions.

Stored information includes:

- Company
- Timestamp
- Confidence
- Verdict
- Session Status

<p align="center">
<img src="./client/src/assets/55.png" width="900">
</p>

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- SVG Rendering Engine

## Backend

- Node.js
- Express.js

## AI

- LangGraph
- LangChain
- OpenAI
- Gemini

## Database

- PostgreSQL
- LangGraph Checkpointer

## APIs

- Finnhub
- Tavily Search

---

# Folder Structure

```
AI-INVESTMENT-AGENT
│
├── client
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── lib
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public
│   └── package.json
│
├── server
│
├── .env
├── package.json
└── README.md
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/satori

OPENAI_API_KEY=YOUR_OPENAI_KEY

GOOGLE_API_KEY=YOUR_GEMINI_KEY

TAVILY_API_KEY=YOUR_TAVILY_KEY

VITE_FINNHUB_API_KEY=YOUR_FINNHUB_KEY
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/your-username/AI-INVESTMENT-AGENT.git
```

Move into the project

```bash
cd AI-INVESTMENT-AGENT
```

Install backend dependencies

```bash
npm install
```

Install frontend dependencies

```bash
cd client
npm install
```

---

# Running the Application

Backend

```bash
npm run dev
```

Frontend

```bash
cd client
npm run dev
```

---

# Workflow

1. User enters a company name.

2. Supervisor Agent creates the workflow.

3. Research Agent gathers live financial information.

4. Bull Agent generates optimistic analysis.

5. Bear Agent generates risk analysis.

6. LangGraph pauses execution.

7. Human reviews debate.

8. Judge Agent synthesizes every perspective.

9. Final investment recommendation is generated.

10. Session is stored permanently inside PostgreSQL.

---

# Future Improvements

- Portfolio Management
- Watchlists
- RAG Financial Memory
- PDF Investment Reports
- Authentication
- Multi-user Dashboard
- TradingView Integration
- Portfolio Risk Analytics

---

# Author

**Mohammad Tabish**

GitHub: https://github.com/tabishfarhan7

LinkedIn: https://linkedin.com/in/tabishfarhan7

---

# License

Licensed under the MIT License.

---

<p align="center">
<b>SATORI</b><br>
Institutional Intelligence. Autonomous Reasoning. Human Oversight.
</p>