import { ChatOpenAI } from "@langchain/openai";
import { webSearchTool } from "../../tools/tavily.js";

export async function newsNode(state) {
  const { companyName } = state;
  console.log(`[Node: Sentiment Analyst] Scouting current market events for ${companyName}...`);

  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.2, // Slightly higher than 0 to allow the AI to read emotional market tones
  });

  // Query specifically tailored for recent news and public perception
  const searchQuery = `${companyName} latest news headlines market sentiment public opinion product controversies breaking updates`;
  
  const rawData = await webSearchTool.invoke({ query: searchQuery });

  const prompt = `You are a Market Sentiment and Macro News Analyst.
  Review the latest breaking news data for ${companyName} and evaluate consumer/investor sentiment.
  Identify recent major events, leadership shifts, product receptions, or regulatory challenges.

  Raw Search Data:
  ${rawData}

  Provide a clean, concise breakdown of current public and institutional market sentiment.`;

  const response = await model.invoke(prompt);

  return {
    newsData: response.content
  };
}