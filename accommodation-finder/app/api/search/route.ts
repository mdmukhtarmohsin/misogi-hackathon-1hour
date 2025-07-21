import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";
import { SearchResult } from "@/lib/types";
import { tavily } from "@tavily/core";

// Debug: Check if API keys are loaded
console.log("OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
console.log("Tavily API Key exists:", !!process.env.TAVILY_API_KEY);

export async function POST(req: NextRequest) {
  const { message, conversationHistory } = await req.json();

  // Initialize Tavily client inside the function
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  console.log("Tavily API Key length:", tavilyApiKey?.length);
  console.log("Tavily API Key starts with:", tavilyApiKey?.substring(0, 10));

  if (!tavilyApiKey) {
    throw new Error("Tavily API key is missing");
  }

  const tavilyClient = tavily({
    apiKey: tavilyApiKey,
  });

  const systemPrompt = `You are an accommodation search assistant. Your job:

1. If user preferences are incomplete, ask ONE clarifying question. You need location, budget, and type of accommodation (PG, flat, or hostel).
2. If you have enough info (location + budget + type), perform a web search to find real-time accommodation listings.
3. Present results in a structured format.
4. Never make up listings - only show real search results.

Current conversation:
${conversationHistory
  .map((msg: any) => `${msg.isUser ? "User" : "Assistant"}: ${msg.text}`)
  .join("\n")}

User preferences collected:
- Location:
- Budget:
- Type:
`;

  try {
    console.log("Starting OpenAI API call...");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "search_accommodations",
            description: "Search for accommodations based on user criteria",
            parameters: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "The city or area to search in",
                },
                budget: { type: "string", description: "The monthly budget" },
                type: {
                  type: "string",
                  description:
                    "The type of accommodation (e.g., PG, flat, hostel)",
                },
              },
              required: ["location", "budget", "type"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    console.log("OpenAI API call successful");
    const responseMessage = completion.choices[0].message;

    if (responseMessage.tool_calls) {
      console.log("Tool call detected, starting Tavily search...");
      const toolCall = responseMessage.tool_calls[0];
      const functionArgs = JSON.parse(toolCall.function.arguments);

      const searchQuery = `${functionArgs.type} for rent in ${functionArgs.location} under ${functionArgs.budget}`;
      console.log("Search query:", searchQuery);

      let searchResponse;
      try {
        // Test with a simpler search first
        searchResponse = await tavilyClient.search(searchQuery, {
          maxResults: 3,
        });

        console.log(
          "Tavily search successful, results count:",
          searchResponse.results?.length || 0
        );
      } catch (tavilyError) {
        console.error("Tavily API Error:", tavilyError);
        throw new Error(
          `Tavily API Error: ${
            tavilyError instanceof Error ? tavilyError.message : "Unknown error"
          }`
        );
      }

      const results: SearchResult[] = searchResponse.results.map(
        (result: any) => ({
          title: result.title,
          price: "N/A", // Tavily doesn't directly provide price in its search results
          location: functionArgs.location,
          source: new URL(result.url).hostname,
          link: result.url,
          description: result.content,
        })
      );

      return NextResponse.json({
        response: `Searching for ${functionArgs.type} in ${functionArgs.location} under ${functionArgs.budget}...`,
        results: results,
        searchComplete: true,
      });
    } else {
      return NextResponse.json({
        response: responseMessage.content,
        results: [],
        searchComplete: false,
      });
    }
  } catch (error) {
    console.error("Error with OpenAI or Tavily API:", error);

    // More specific error handling
    if (error instanceof Error) {
      if (
        error.message.includes("Unauthorized") ||
        error.message.includes("API key")
      ) {
        return NextResponse.json(
          {
            error:
              "API key configuration error. Please check your environment variables.",
          },
          { status: 401 }
        );
      }
      if (
        error.message.includes("rate limit") ||
        error.message.includes("quota")
      ) {
        return NextResponse.json(
          {
            error: "API rate limit exceeded. Please try again later.",
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to process request. Please try again.",
      },
      { status: 500 }
    );
  }
}
