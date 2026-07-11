import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; 
import { VerdictSchema } from "../state.js"; 

export async function judgeNode(state) {
  // Extract humanOverride from the state notebook
  const { companyName, fundamentalData, newsData, bullCase, bearCase, humanOverride } = state;
  console.log(`[Node: Judge] Making final decision for ${companyName}...`);

  // Initializing the Gemini model with your API key
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash", 
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.1 // Keeping it low for strict, logical judgment
  });
  
  const structuredModel = model.withStructuredOutput(VerdictSchema);

  // Updated prompt to force the Judge to process human context
  const prompt = `You are the Lead Investment Judge making a final decision on ${companyName}.
  
  Raw Evidence Gathered:
  - Financials: ${fundamentalData}
  - News/Sentiment: ${newsData}
  
  Debate Arguments:
  - Pro-Invest (Bull Thesis): ${bullCase}
  - Anti-Invest (Bear Thesis): ${bearCase}
  
  ⚠️ CRITICAL HUMAN INVESTOR CONSTRAINT:
  The human investor running this pipeline has added a mandatory parameter or operational thesis that you MUST incorporate:
  "${humanOverride || "No custom conditions provided. Judge purely on the objective facts above."}"
  
  Weigh the arguments, factor in the raw data, and explicitly account for the human's condition. 
  Make a final decision to either "INVEST" or "PASS". Provide a confidence score and a highly detailed reasoning block.`;

  const response = await structuredModel.invoke(prompt);
  
  return { finalVerdict: response };
}
