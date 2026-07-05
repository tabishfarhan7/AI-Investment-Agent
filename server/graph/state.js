import { Annotation } from "@langchain/langgraph";
import { z } from "zod";

// ==========================================
// 1. THE ZOD SCHEMAS (The Bouncers)
// ==========================================

// We use this schema to force our Final Judge AI to output a strict, predictable JSON object.
// We attach .describe() to each field because LangChain actually reads these descriptions 
// and feeds them to the LLM as instructions!
export const VerdictSchema = z.object({
  decision: z.enum(["INVEST", "PASS"])
    .describe("The definitive final decision. Must be exactly 'INVEST' or 'PASS'."),
  confidence: z.number().min(0).max(100)
    .describe("A confidence score for the decision, ranging from 0 to 100."),
  reasoning: z.string()
    .describe("A comprehensive, professional explanation of why this decision was made."),
  sources: z.array(z.string())
    .describe("A list of URLs or search queries that informed this decision.")
});


// ==========================================
// 2. THE LANGGRAPH STATE (The Shared Memory)
// ==========================================

// This is the global object that gets passed from agent to agent.
// When an agent finishes its job, it updates its specific piece of this state.
export const InvestmentState = Annotation.Root({
  // The input from the user
  companyName: Annotation,

  // Populated by our Data Gathering Agents
  fundamentalData: Annotation,
  newsData: Annotation,

  // Populated by our Debating Agents
  bullCase: Annotation,
  bearCase: Annotation,

  // ADDED: Populated by human feedback during graph interruption
  humanOverride: Annotation,

  // Populated by the Final Judge Agent (after passing the Zod bouncer above)
  finalVerdict: Annotation
});