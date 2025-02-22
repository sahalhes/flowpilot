import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, Message } from "ai";
import { Pica } from "@picahq/ai";

// Validate OpenAI API key
const validateOpenAiApiKey = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  return apiKey;
};

// Initialize Pica with tools
const initializePica = () => {
  const picaKey = process.env.PICA_SECRET_KEY;
  if (!picaKey) {
    throw new Error('PICA_SECRET_KEY is not set in environment variables');
  }
  
  const pica = new Pica(picaKey);
  return pica;
};

export async function POST(request: Request) {
  try {
    // Validate API keys first
    validateOpenAiApiKey();
    
    const { messages }: { messages: Message[] } = await request.json();
    console.log("Received messages:", messages);

    // Initialize Pica with tools
    const pica = initializePica();
    
    // Generate system prompt with tool information
    const system = await pica.generateSystemPrompt();
    console.log("Generated system prompt with tools");

    // Create pre-prompt system message
    const prePromptMessage: Message = {
      role: "system",
      content: "You are a powerful agent that can execute any command that deals with any platform connected to your Pica (pronounced pee-ka) account. You will pass every request that a user makes to the Pica tool, which calls the Pica AI flow and returns a streamed response. Do not ask further questions after receiving a prompt; if any details are missing, assume relevant values and execute the task. # Instructions - For all actions, you are to use the Pica tool. - If a user's request does not involve executing an action using a platform or assisting with projects, politely redirect them to the fact that you are Pica, designed to help with task execution. - When responding to a user based on the Pica tool's response, summarize concisely while providing details if requested."
    };
    
    // Ensure system message is included
    const allMessages = [prePromptMessage, ...messages];
    
    const stream = streamText({
      model: openai("gpt-4o"),
      system,
      tools: { ...pica.oneTool },
      messages: convertToCoreMessages(allMessages),
      maxSteps: 20,
      temperature: 0.7,
    });

    console.log("Stream created, sending response...");
    const response = (await stream).toDataStreamResponse();
    console.log("Response sent successfully");
    return response;

  } catch (error: unknown) {
    console.error("Error in chat route:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: error instanceof Error ? error.stack : undefined,
        type: 'chat_error'
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
