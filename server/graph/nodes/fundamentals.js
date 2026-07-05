import { ChatOpenAI } from "@langchain/openai";
import { webSearchTool } from "../../tools/tavily.js";

export async function fundamentalsNode(state) {
  const { companyName } = state;
  console.log(`[Node: Fundamentals Analyst] Analyzing financial structure for ${companyName}...`);

  // 1. Initialize our brain model
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0, // 0 means ultra-deterministic and analytical (no creative fluff)
  });

  // 2. Formulate a highly specific search query for financial metrics
  const searchQuery = `${companyName} financial metrics income statement balance sheet revenue growth P/E ratio valuation`;
  
  // 3. Force execute our search tool manually to pull raw web data
  const rawData = await webSearchTool.invoke({ query: searchQuery });

  // 4. Pass the raw data to the LLM to filter out the noise and distill the hard metrics
  const prompt = `You are an elite Fundamental Financial Analyst. 
  Your job is to read the raw search data below and extract the core financial metrics for ${companyName}.
  Focus strictly on: Revenue trends, P/E ratio, Net Profit Margins, Debt levels, and Cash flow.

  Raw Search Data:
  ${rawData}

  Provide a clean, bulleted synthesis of the company's financial strength. If certain metrics are missing, state it clearly.`;

  const response = await model.invoke(prompt);

  // 5. Return ONLY the partial update. LangGraph automatically saves this inside 'fundamentalData'
  return {
    fundamentalData: response.content
  };
}