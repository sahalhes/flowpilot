import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { Pica } from "@picahq/ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const pica = new Pica(process.env.PICA_SECRET_KEY as string);

  // Predefined system prompt for autonomous decision-making
  const systemPrompt = `
    You are an intelligent AI assistant with access to Pica, a powerful tool for generating system-level insights.
    Your goal is to autonomously analyze user queries, determine the best approach to respond, and utilize Pica's capabilities when necessary.

    Follow these principles:
    1. **Autonomy** – Make decisions based on the conversation context without relying on explicit user instructions.
    2. **Efficiency** – Minimize unnecessary API calls while ensuring the best possible response.
    3. **Context Awareness** – Maintain context from previous interactions to provide coherent and relevant responses.
    4. **Tool Utilization** – Use Pica when it enhances your response, such as generating structured outputs, summaries, or system-level insights.
    5. **Clarity & Accuracy** – Ensure responses are clear, accurate, and actionable.

    When engaging with users:
    - If the request requires structured insights or deeper context understanding, use Pica to generate a system-level response before proceeding.
    - If direct AI responses suffice, process them independently.
    - Prioritize user intent and adapt dynamically to the conversation flow.
  `;

  const stream = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    tools: { ...pica.oneTool },
    messages: convertToCoreMessages(messages),
    maxSteps: 10,
  });

  return (await stream).toDataStreamResponse();
}
