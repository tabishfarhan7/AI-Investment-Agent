import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// CHANGED: We now import 'memory' alongside 'researchGraph' so we can initialize the Postgres tables
import { researchGraph, memory } from './graph/workflow.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Essential to read the incoming JSON body!

// =========================================================================
// 1. START PIPELINE: Runs the gathering and debates, then pauses
// =========================================================================
app.post('/api/research/start', async (req, res) => {
  const { company, threadId } = req.body;

  if (!company || !threadId) {
    return res.status(400).json({ error: "Missing required 'company' or 'threadId' fields." });
  }

  console.log(`\n[API: Start] Initiating persistent thread [${threadId}] for ${company}...`);

  try {
    // We pass a configuration object containing the threadId to track this session
    const config = { configurable: { thread_id: threadId } };
    
    // Kick off the graph. It will execute nodes sequentially until it hits the "judge" interruption
    const stream = await researchGraph.stream({ companyName: company }, config);
    
    let latestState = {};
    for await (const chunk of stream) {
      // The stream yields updates per node. We merge them into a state tracker object
      latestState = { ...latestState, ...chunk };
    }

    // Grab the current state data explicitly from the graph's checkpointer memory
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

// =========================================================================
// 2. RESUME PIPELINE: Updates state with human choices, then runs the Judge
// =========================================================================
app.post('/api/research/resume', async (req, res) => {
  const { threadId, humanOverride } = req.body;

  if (!threadId) {
    return res.status(400).json({ error: "Missing required 'threadId'." });
  }

  console.log(`\n[API: Resume] Resuming thread [${threadId}] with human input...`);

  try {
    const config = { configurable: { thread_id: threadId } };

    // 1. Manually update the persistent state container with the human override string
    await researchGraph.updateState(config, { humanOverride: humanOverride || "None" });

    // 2. Resume execution by running the stream with a 'null' input value.
    // LangGraph interprets 'null' as an instruction to proceed from the exact checkpoint it paused at.
    const stream = await researchGraph.stream(null, config);

    for await (const chunk of stream) {
      // Let it finish processing the remaining node(s)
      console.log("[Node Stream Churning]:", Object.keys(chunk));
    }

    // 3. Retrieve the fully completed state showing the final verdict object
    const updatedGraphState = await researchGraph.getState(config);

    res.json({
      status: "complete",
      message: "Final judgment has been securely validated and processed.",
      result: updatedGraphState.values.finalVerdict
    });

  } catch (error) {
    console.error("Graph Resumption Error:", error);
    res.status(500).json({ error: "Failed to resume graph execution framework." });
  }
});

app.listen(PORT, async () => {
  try {
    // Run the required setup to prepare the PostgreSQL database tables
    await memory.setup(); 
    console.log(`🗄️ PostgreSQL Checkpointer connected and configured.`);
    console.log(`🚀 Investment Agent Backend listening securely on port ${PORT}`);
  } catch (error) {
    console.error("❌ Failed to initialize PostgreSQL Checkpointer:", error);
  }
});