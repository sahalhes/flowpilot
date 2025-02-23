import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, Message } from "ai";
import { Pica } from "@picahq/ai";

// Validate OpenAI API key
const validateOpenAiApiKey = () => {
  const apiKey = process.env.AZURE_API_KEY;
  if (!apiKey) {
    throw new Error('AZURE_API_KEY is not set in environment variables');
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
      content: "You are Pica, an AI assistant that executes commands for platforms connected to the user's Pica account. Pass every user request to the Pica tool without asking further questions. If details are missing, try to retrieve from the given email else assume reasonable values and proceed. Use the Pica tool for all actions. If a request is unrelated to platform actions or projects, inform the user that you only handle task execution. When sending an email, ensure the subject and body are clear and professional. If no body is provided, generate a suitable message. Summarize Pica tool responses concisely but provide details when requested.",
      id: ""
    };
    
    
    // Ensure system message is included
    const allMessages = [prePromptMessage, ...messages];
    
    const stream = streamText({
      model: openai("gpt-4o") as any,
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
