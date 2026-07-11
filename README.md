# SATORI_ // Multi-Agent Investment Protocol

<p align="center">
  <img src="https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-000000?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TailwindCSS-000000?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <b>Absolute Clarity in Financial Chaos.</b><br><br>
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

```text
                     User Query
                         │
                         ▼
                ┌───────────────────┐
                │ Supervisor Agent  │
                └─────────┬─────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
 Research Agent      Bull Analyst      Bear Analyst
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

# Key Decisions & Trade-offs

Building a production-grade multi-agent system required several architectural decisions and practical trade-offs.

### LangGraph vs Standard LangChain

SATORI uses **LangGraph** instead of traditional LangChain chains because the workflow is inherently cyclical rather than linear. The application must pause execution during the **Human-in-the-Loop (HITL)** stage, wait for user approval, and then resume execution. This stateful routing is difficult to achieve using standard linear chains but is a core capability of LangGraph.

### Custom SVG Engine vs Charting Libraries

Instead of relying on charting libraries such as **Chart.js**, the frontend renders live market movements using a custom SVG engine.

**Benefits:**

- Smaller frontend bundle size
- Better rendering performance
- Complete design flexibility
- Institutional trading terminal aesthetics

### LLM Rate Limiting (Free Tier Trade-off)

A multi-agent workflow executes several LLM requests in rapid succession:

- Research Agent
- Bull Agent
- Bear Agent
- Judge Agent

This frequently exceeded the **Google Gemini Free Tier** rate limits (HTTP 429: Too Many Requests).

Rather than implementing a Redis-based token bucket rate limiter, lightweight `setTimeout()` delays were introduced between agent executions to stay within API quotas. This approach kept the architecture simple while ensuring reliable execution during development.

### OpenAI vs Gemini — Model Routing

> **TODO:** Briefly state which agents call OpenAI vs. which call Gemini, and why (e.g. cost, latency, or reasoning quality per role). If only one provider is required to run the app, say so explicitly and mark the other key optional in the Environment Variables section below.

### What Was Left Out

To focus on building the core multi-agent reasoning engine, the following features were intentionally deferred:

- JWT / OAuth authentication
- Redis response caching
- Portfolio management
- Multi-user support

---

# Example Runs

Below are example SATORI sessions across companies with different outcomes, to illustrate that the Judge Agent's verdict genuinely depends on the debate rather than defaulting to a single answer.

## Run 1 — Large-Cap Technology

**Target Company:** MICROSOFT (MSFT)
**Status:** Complete
**Final Verdict:** ✅ INVEST
**Confidence Score:** **95 / 100**

**Bull Agent Thesis**
- Strong Azure cloud growth
- Massive cash reserves
- Market leadership in Enterprise AI
- Durable competitive advantages

**Bear Agent Thesis**
- Premium valuation (high P/E ratio)
- Regulatory pressure in multiple regions
- Expectations already priced into the stock

**Judge Agent Decision**
While Microsoft's valuation remains elevated, the company's exceptional financial strength, dominant cloud ecosystem, and leadership in artificial intelligence outweigh the identified risks.

**Final Recommendation:** ✅ INVEST

---

## Run 2 — [Company Name]

> **TODO:** Add a second real run where the verdict is **AVOID** or **HOLD**, so reviewers can see the Bear Agent actually winning a debate. Include the same structure as Run 1: Bull thesis, Bear thesis, Judge decision, confidence score.

---

## Run 3 — [Company Name]

> **TODO:** Add a third run — ideally a lower-confidence / mixed-signal case (e.g. confidence in the 50–65 range) to show the Judge Agent isn't just returning high-confidence verdicts. If possible, attach a screenshot of the actual dashboard output or a snippet of raw agent logs/JSON here instead of only prose, so this is clearly a captured run rather than an illustration.

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

**Bull Agent**
- Positive Catalysts
- Growth Drivers
- Upside Potential

**Bear Agent**
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
- Custom SVG Rendering Engine

## Backend

- Node.js
- Express.js

## AI & Orchestration

- LangGraph
- LangChain
- OpenAI
- Google Gemini

## Database

- PostgreSQL
- LangGraph Checkpointer

## External APIs

- Finnhub
- Tavily Search

---

# Folder Structure

```text
AI-INVESTMENT-AGENT
│
├── client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── lib
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server
│
├── .env
├── package.json
├── README.md
└── .gitignore
```

---

# Prerequisites

Before installing, make sure you have the following available locally:

- **Node.js** — > **TODO:** specify minimum version (e.g. v18+)
- **npm** (or yarn/pnpm, if used instead)
- **PostgreSQL** — running locally or accessible remotely, with an empty database created for SATORI
- API keys for OpenAI, Google Gemini, Tavily, and Finnhub (see [Environment Variables](#environment-variables))

---

# Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/satori

OPENAI_API_KEY=YOUR_OPENAI_KEY

GOOGLE_API_KEY=YOUR_GEMINI_KEY

TAVILY_API_KEY=YOUR_TAVILY_KEY

VITE_FINNHUB_API_KEY=YOUR_FINNHUB_KEY
```

> **TODO:** Clarify whether both `OPENAI_API_KEY` and `GOOGLE_API_KEY` are required, or whether the app can run with only one provider configured.

---

# Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/AI-INVESTMENT-AGENT.git
```

### Navigate into the Project

```bash
cd AI-INVESTMENT-AGENT
```

### Install Backend Dependencies

```bash
npm install
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Set Up the Database

> **TODO:** Add the exact steps to create the PostgreSQL database and any tables/migrations required before first run, e.g.:
> ```bash
> createdb satori
> # then, if a migration script exists:
> npm run migrate
> ```
> If the LangGraph Checkpointer auto-creates its own tables on first run, say so explicitly here so users aren't left guessing.

---

# Running the Application

### Start the Backend

```bash
node index.js
```

> **TODO:** State which port the backend runs on (e.g. `http://localhost:5000`) and whether a `/health` endpoint exists to confirm it's up.

### Start the Frontend

```bash
cd client
npm run dev
```

> **TODO:** State which port the frontend runs on (Vite default is usually `http://localhost:5173`) and confirm the frontend is pre-configured to proxy API requests to the backend port.

---

# Workflow

The application follows the workflow below:

1. User enters a company name.
2. Supervisor Agent initializes the workflow.
3. Research Agent gathers real-time financial data.
4. Bull Agent generates an optimistic investment thesis.
5. Bear Agent generates a risk-focused investment thesis.
6. LangGraph pauses execution for Human-in-the-Loop (HITL) validation.
7. The user reviews the debate and optionally provides additional constraints.
8. Judge Agent synthesizes all available information.
9. A final investment recommendation is generated.
10. The complete session is persisted in PostgreSQL for future reference.

---

# What I Would Improve With More Time

### Redis Caching Pipeline

Implement a Redis-based token bucket rate limiter and caching layer to efficiently handle high-frequency multi-agent executions while avoiding API rate limits.

### Portfolio Management

Allow users to build and monitor personalized investment portfolios directly within the application.

### RAG Financial Memory

Enable Retrieval-Augmented Generation (RAG) by indexing SEC 10-K and 10-Q filings, giving agents richer contextual knowledge during analysis.

### Multi-user Authentication

Introduce secure JWT/OAuth authentication so that every user has a private investment workspace and archived session history.

---

# Bonus: LLM Chat Transcripts

As required by the assignment, the complete LLM interaction logs — including architectural discussions, debugging sessions, deployment challenges, and prompt engineering iterations — are included with the project.

📄 **[View the full LLM chat transcript](./LLM_TRANSCRIPTS.md)**

> **TODO:** Confirm `LLM_TRANSCRIPTS.md` (or the equivalent PDF) actually exists at this path before submitting — update the link above if it lives elsewhere.

---

# Author

**Mohammad Tabish**

- **GitHub:** https://github.com/tabishfarhan7
- **LinkedIn:** https://linkedin.com/in/tabishfarhan7

---

# License

This project is licensed under the **MIT License**.
