import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { webSearchTool } from "../../tools/tavily.js";

export async function fundamentalsNode(state) {
  const { companyName } = state;
  console.log(`[Node: Fundamentals Analyst] Analyzing financial structure for ${companyName}...`);

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0,
  });

  const searchQuery = `${companyName} financial metrics income statement balance sheet revenue growth P/E ratio valuation`;
  
  const rawData = await webSearchTool.invoke({ query: searchQuery });

  const prompt = `You are an elite Fundamental Financial Analyst. 
  Your job is to read the raw search data below and extract the core financial metrics for ${companyName}.
  Focus strictly on: Revenue trends, P/E ratio, Net Profit Margins, Debt levels, and Cash flow.

  Raw Search Data:
  ${rawData}

  Provide a clean, bulleted synthesis of the company's financial strength. If certain metrics are missing, state it clearly.`;

  const response = await model.invoke(prompt);

  return {
    fundamentalData: response.content
  };
}
