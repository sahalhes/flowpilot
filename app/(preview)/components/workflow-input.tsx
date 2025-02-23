import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

export default function WorkflowChat() {
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant" | "data" | "system"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const workflowUrl = process.env.NEXT_PUBLIC_WORKFLOW_URL;
    if (!workflowUrl) {
      console.error("Workflow URL environment variable is not set");
      return;
    }
    
    // Add user message to chat
    const userMessage: { id: string; role: "user" | "assistant" | "data" | "system"; content: string } = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput(""); // Clear input after sending

    try {
      const res = await fetch(workflowUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage: { id: string; role: "user" | "assistant" | "data" | "system"; content: string } = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.length > 0 && data[0].output ? data[0].output : "No valid response received."
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in workflow request:", error);
      const errorMessage: { id: string; role: "user" | "assistant" | "data" | "system"; content: string } = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error connecting to workflow: ${(error as Error).message}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput
        inputRef={inputRef}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        status="idle"
        stop={() => {}}
        messages={messages}
        append={async () => undefined}
      />
    </div>
  );
}