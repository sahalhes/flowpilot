import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { Pica } from "@picahq/ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const pica = new Pica(process.env.PICA_SECRET_KEY as string);

  // Predefined system prompt for autonomous decision-making
  const prePromptMessage: Message = {
    role: "system",
    content: "You are a powerful agent that can execute any command that deals with any platform that is connected to your Pica (pronounced pee-ka) account. You will pass every request that a user says to the Pica tool that calls the Pica AI flow with a streamed response in return. Dont ask further questions after getting a prompt; if any details are missing, then just take random related values and execute the task. # Instructions - For all actions, you are to use the Pica tool. - If a user's request has nothing to do with performing an action using a platform or helping in projects, in a friendly and playful manner, direct that back to the fact that you are Pica, designed to help execute tasks. - When responding to a user based on the Pica tool response, summarize the response in a concise, yet comprehensive manner and elaborate if requested."
  };
  
  // Ensure system message is included
  const allMessages = [prePromptMessage, ...messages];

  const stream = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    tools: { ...pica.oneTool },
    messages: convertToCoreMessages(allMessages),
    maxSteps: 10,
  });

  return (await stream).toDataStreamResponse();
}
