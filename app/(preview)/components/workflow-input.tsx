import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { toast } from "sonner";

export default function WorkflowChat() {
  const [messages, setMessages] = useState<{ 
    id: string; 
    role: "user" | "assistant" | "data" | "system"; 
    content: string 
  }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get config from localStorage
  const getConfig = () => {
    const savedConfig = localStorage.getItem('flowpilot-config');
    return savedConfig ? JSON.parse(savedConfig) : null;
  };

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

    // Get workflow URL from localStorage
    const config = getConfig();
    const workflowUrl = config?.workflowUrl;

    if (!workflowUrl) {
      toast.error("Please configure the Workflow URL in Settings");
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
        headers: { 
          "Content-Type": "application/json",
          // Add secret key if available
          ...(config.picaSecretKey && { 
            'Authorization': `Bearer ${config.picaSecretKey}` 
          })
        },
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
      
      // Show error toast
      toast.error("Failed to connect to workflow. Check your settings.");
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