import { mistral } from "@ai-sdk/mistral";
import { convertToCoreMessages, streamText, Message } from "ai";
import { Pica } from "@picahq/ai";

// Validate Mistral API key
const validateMistralApiKey = () => {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY is not set in environment variables');
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
    validateMistralApiKey();
    
    const { messages }: { messages: Message[] } = await request.json();
    console.log("Received messages:", messages);

    // Initialize Pica with tools
    const pica = initializePica();
    
    // Generate system prompt with tool information
    const system = await pica.generateSystemPrompt();
    console.log("Generated system prompt with tools");

    // Create stream using Mistral through AI SDK
    console.log("Creating Mistral stream with tools...");
    const stream = streamText({
      model: mistral("mistral-large-latest"),
      system,
      tools: {
        ...pica.oneTool,
      },
      messages: convertToCoreMessages(messages),
      maxSteps: 20,
      temperature: 0.7, // Add some creativity while keeping responses focused
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