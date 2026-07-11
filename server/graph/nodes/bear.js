import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function bearNode(state) {
  const { companyName, fundamentalData, newsData } = state;
  console.log(`[Node: Bear] Constructing negative risk analysis for ${companyName}...`);

  // CHANGED: Initializing the Gemini model instead of OpenAI
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.5 
  });

  const prompt = `You are a ruthless Short-Seller. Review this data for ${companyName}:
  Financials: ${fundamentalData}
  News: ${newsData}
  Write a brutal argument for why this company is a TERRIBLE investment. Highlight the risks.`;

  const response = await model.invoke(prompt);
  
  return { bearCase: response.content };
}
