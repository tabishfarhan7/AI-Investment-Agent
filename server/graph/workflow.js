import { StateGraph, START, END } from "@langchain/langgraph";
import { InvestmentState } from "./state.js";
import pg from "pg"; 
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres"; 

// Import all 5 of our workers
import { fundamentalsNode } from "./nodes/fundamentals.js";
import { newsNode } from "./nodes/news.js";
import { bullNode } from "./nodes/bull.js";
import { bearNode } from "./nodes/bear.js";
import { judgeNode } from "./nodes/judge.js";

const workflow = new StateGraph(InvestmentState);

workflow.addNode("fundamentals", fundamentalsNode);
workflow.addNode("news", newsNode);
workflow.addNode("bull", bullNode);
workflow.addNode("bear", bearNode);
workflow.addNode("judge", judgeNode);

workflow.addEdge(START, "fundamentals");
workflow.addEdge("fundamentals", "news");
workflow.addEdge("news", "bull");
workflow.addEdge("bull", "bear");
workflow.addEdge("bear", "judge");
workflow.addEdge("judge", END);

// 1. Initialize the PostgreSQL Connection Pool
const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
});

// 2. Create the PostgreSQL persistent checkpointer
// Export it so we can run its setup() method when the server starts
export const memory = new PostgresSaver(pool); 

// 3. Compile the graph with the new database memory
export const researchGraph = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["judge"]
});