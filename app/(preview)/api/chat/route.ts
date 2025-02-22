import { mistral } from "@ai-sdk/mistral";
import { convertToCoreMessages, streamText, Message } from "ai";
import { Pica } from "@picahq/ai";

// Validate Mistral API key
const validateMistralApiKey = () => {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY is not set in environment variables');
  }
  // Log first few characters of API key for debugging (safe to show prefix)
  console.log('API Key prefix:', apiKey.substring(0, 4));
  if (!apiKey.startsWith('DxI')) {
    throw new Error('Invalid MISTRAL_API_KEY format - should start with DxI');
  }
  return apiKey;
};

export async function POST(request: Request) {
  try {
    // Log environment variables availability (without exposing values)
    console.log('Environment variables check:', {
      hasMistralKey: !!process.env.MISTRAL_API_KEY,
      hasPicaKey: !!process.env.PICA_SECRET_KEY
    });

    // Validate API key first
    validateMistralApiKey();

    const { messages }: { messages: Message[] } = await request.json();
    console.log("Received messages:", messages);

    const pica = new Pica(process.env.PICA_SECRET_KEY as string);
    const system = await pica.generateSystemPrompt();
    console.log("Generated system prompt");

    // Create stream using Mistral through AI SDK
    console.log("Creating Mistral stream...");
    const stream = streamText({
      model: mistral("mistral-small"),
      system,
      tools: {
        ...pica.oneTool,
      },
      messages: convertToCoreMessages(messages),
      maxSteps: 20,
    });

    console.log("Stream created, sending response...");
    const response = (await stream).toDataStreamResponse();
    console.log("Response sent");
    return response;

  } catch (error: unknown) {
    console.error("Detailed error in chat route:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
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