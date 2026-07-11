import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { webSearchTool } from "../../tools/tavily.js";

export async function fundamentalsNode(state) {
  const { companyName } = state;
  console.log(`[Node: Fundamentals Analyst] Analyzing financial structure for ${companyName}...`);

  // CHANGED: Initialize Gemini model with your API key
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.0-pro",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0, // Keep it at 0 for deterministic financial analysis
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
