import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";

// Load environment variables so we can access TAVILY_API_KEY
dotenv.config();

// Initialize the official Tavily client
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

// ==========================================
// 1. THE LANGCHAIN TOOL WRAPPER
// ==========================================

export const webSearchTool = tool(
  // The actual function that runs when the AI decides to use this tool
  async ({ query }) => {
    console.log(`[Tool: Web Search] Executing query: "${query}"`);
    
    try {
      // Call the Tavily API with advanced depth for better financial data
      const response = await tvly.search(query, {
        searchDepth: "advanced",
        maxResults: 4, // Keep this low to save tokens and processing time
      });

      // Map over the results and format them into a clean, readable string for the LLM
      const formattedResults = response.results
        .map((r) => `Source: ${r.url}\nContent: ${r.content}`)
        .join("\n\n---\n\n");

      return formattedResults;
    } catch (error) {
      console.error("[Tool Error]", error.message);
      return "Error: Could not retrieve search results. Please try a different query.";
    }
  },
  {
    // These configurations are CRITICAL. The LLM reads these to understand HOW and WHEN to use the tool.
    name: "web_search",
    description: "Use this tool to search the live internet for current financial data, news, competitive analysis, and market sentiment about a specific company.",
    schema: z.object({
      query: z.string().describe("The exact search query to look up on the internet. Be specific."),
    }),
  }
);