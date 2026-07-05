import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph"; // CHANGED: Added MemorySaver
import { InvestmentState } from "./state.js";

// Import all 5 of our workers
import { fundamentalsNode } from "./nodes/fundamentals.js";
import { newsNode } from "./nodes/news.js";
import { bullNode } from "./nodes/bull.js";
import { bearNode } from "./nodes/bear.js";
import { judgeNode } from "./nodes/judge.js";

// 1. Initialize the Graph Blueprint
const workflow = new StateGraph(InvestmentState);

// 2. Register all workers into the system
workflow.addNode("fundamentals", fundamentalsNode);
workflow.addNode("news", newsNode);
workflow.addNode("bull", bullNode);
workflow.addNode("bear", bearNode);
workflow.addNode("judge", judgeNode);

// 3. Draw the execution arrows (The Workflow)
workflow.addEdge(START, "fundamentals");
workflow.addEdge("fundamentals", "news");
workflow.addEdge("news", "bull");
workflow.addEdge("bull", "bear");
workflow.addEdge("bear", "judge");
workflow.addEdge("judge", END);

// ADDED: Initialize an in-memory checkpointer to persist agent state between steps
const memory = new MemorySaver();

// 4. Compile into a live engine with a persistent checkpoint interruption
export const researchGraph = workflow.compile({
  checkpointer: memory,
  interruptBefore: ["judge"] // Tells the graph engine to freeze state right before invoking the judge
});