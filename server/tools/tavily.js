import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const webSearchTool = tool(
  async ({ query }) => {
    console.log(`[Tool: Web Search] Executing query: "${query}"`);
    
    try {
      const response = await tvly.search(query, {
        searchDepth: "advanced",
        maxResults: 4,
      });

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
    name: "web_search",
    description: "Use this tool to search the live internet for current financial data, news, competitive analysis, and market sentiment about a specific company.",
    schema: z.object({
      query: z.string().describe("The exact search query to look up on the internet. Be specific."),
    }),
  }
);
