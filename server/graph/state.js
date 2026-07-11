import { Annotation } from "@langchain/langgraph";
import { z } from "zod";

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


export const InvestmentState = Annotation.Root({
  companyName: Annotation,

  fundamentalData: Annotation,
  newsData: Annotation,

  bullCase: Annotation,
  bearCase: Annotation,

  humanOverride: Annotation,

  finalVerdict: Annotation
});
