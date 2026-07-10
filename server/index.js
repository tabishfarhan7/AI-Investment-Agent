import express from 'express';
import cors from 'cors';
import './config/env.js';
import pkg from 'pg';
import { researchGraph, memory } from './graph/workflow.js'; 

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Create the table automatically if it doesn't exist
const initializeDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        company VARCHAR(255) NOT NULL,
        verdict VARCHAR(255),
        confidence VARCHAR(50),
        status VARCHAR(50) DEFAULT 'PENDING',
        is_positive BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("🗄️ Custom ai_sessions table verified.");
  } catch (err) {
    console.error("Failed to verify ai_sessions table:", err);
  }
};

app.post('/api/research/start', async (req, res) => {
  const { company, threadId } = req.body;

  if (!company || !threadId) {
    return res.status(400).json({ error: "Missing required 'company' or 'threadId' fields." });
  }

  console.log(`\n[API: Start] Initiating persistent thread [${threadId}] for ${company}...`);

  try {
    // 1. Save initial pending state to our custom table
    await pool.query(
      `INSERT INTO ai_sessions (session_id, company, status) VALUES ($1, $2, $3) ON CONFLICT (session_id) DO NOTHING`,
      [threadId, company, 'PAUSED']
    );

    const config = { configurable: { thread_id: threadId } };
    const stream = await researchGraph.stream({ companyName: company }, config);
    
    let latestState = {};
    for await (const chunk of stream) {
      latestState = { ...latestState, ...chunk };
    }

    const graphState = await researchGraph.getState(config);

    res.json({
      status: "paused",
      message: "Research and debate completed. Graph is currently frozen awaiting human input.",
      threadId: threadId,
      collectedData: graphState.values
    });

  } catch (error) {
    console.error("Graph Initialization Error:", error);
    res.status(500).json({ error: "Failed to initialize the multi-agent execution pipeline." });
  }
});

app.post('/api/research/resume', async (req, res) => {
  const { threadId, humanOverride } = req.body;

  if (!threadId) {
    return res.status(400).json({ error: "Missing required 'threadId'." });
  }

  console.log(`\n[API: Resume] Resuming thread [${threadId}] with human input...`);

  try {
    const config = { configurable: { thread_id: threadId } };

    await researchGraph.updateState(config, { humanOverride: humanOverride || "None" });

    const stream = await researchGraph.stream(null, config);

    for await (const chunk of stream) {
      console.log("[Node Stream Churning]:", Object.keys(chunk));
    }

    const updatedGraphState = await researchGraph.getState(config);
    const finalData = updatedGraphState.values.finalVerdict;

    // 2. Parse the final verdict to update our database
    let verdictText = "UNKNOWN";
    let isPositive = false;
    let confidence = "--";

    if (finalData) {
       let parsed = finalData;
       if (typeof finalData === 'string') {
         try { parsed = JSON.parse(finalData.replace(/```json/g, '').replace(/```/g, '').trim()); } catch(e){}
       }
       const decisionStr = String(parsed.decision || parsed.verdict || parsed.action || "").toUpperCase();
       if (decisionStr.includes("PASS") || decisionStr.includes("AVOID") || decisionStr.includes("NO") || decisionStr.includes("SELL")) {
           verdictText = "AVOID";
           isPositive = false;
       } else if (decisionStr.includes("YES") || decisionStr.includes("BUY") || decisionStr.includes("INVEST")) {
           verdictText = "INVEST";
           isPositive = true;
       }
       confidence = parsed.confidence || parsed.confidenceMeter || "--";
    }

    // 3. Update the custom table with the final results!
    await pool.query(
      `UPDATE ai_sessions SET verdict = $1, confidence = $2, status = $3, is_positive = $4 WHERE session_id = $5`,
      [verdictText, confidence, 'COMPLETE', isPositive, threadId]
    );

    res.json({
      status: "complete",
      message: "Final judgment has been securely validated and processed.",
      result: finalData
    });

  } catch (error) {
    console.error("Graph Resumption Error:", error);
    res.status(500).json({ error: "Failed to resume graph execution framework." });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const query = 'SELECT * FROM ai_sessions ORDER BY created_at DESC LIMIT 50';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Failed to fetch sessions from database" });
  }
});

app.listen(PORT, async () => {
  try {
    await memory.setup(); 
    await initializeDB(); 
    console.log(` PostgreSQL Checkpointer connected and configured.`);
    console.log(` Investment Agent Backend listening securely on port ${PORT}`);
  } catch (error) {
    console.error("Failed to initialize PostgreSQL Checkpointer:", error);
  }
});
