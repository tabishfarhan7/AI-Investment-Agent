import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function bullNode(state) {
  const { companyName, fundamentalData, newsData } = state;
  console.log(`[Node: Bull] Constructing positive investment thesis for ${companyName}...`);

  // CHANGED: Initializing the Gemini model with your API key
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.5 
  });

  const prompt = `You are a highly optimistic Bull Market Investor. Review this data for ${companyName}:
  Financials: ${fundamentalData}
  News: ${newsData}
  Write a strong argument for why we MUST INVEST. Focus on growth potential.`;

  const response = await model.invoke(prompt);
  
  return { bullCase: response.content };
}
