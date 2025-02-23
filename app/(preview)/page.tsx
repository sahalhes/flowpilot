"use client";

import type React from "react";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useAuthKit } from "@picahq/authkit";
import { Header } from "./components/Header";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { ModeToggle } from "./components/mode-toggle";
import ChatInterface from "./components/workflow-input";

export default function Home() {
  const [mode, setMode] = useState<"execute" | "workflow">("execute");

  const { open } = useAuthKit({
    token: {
      url: "http://localhost:3000/api/authkit",
      headers: {},
    },
    selectedConnection: "GitHub",
    onSuccess: (connection) => {},
    onError: (error) => {},
    onClose: () => {},
  });

  const { messages, handleSubmit, input, handleInputChange, append, isLoading, stop, status } =
    useChat({
      maxSteps: 20,
    });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col justify-between h-dvh">
      <div className="flex flex-col h-full">
        <Header />
        <ModeToggle mode={mode} setMode={setMode} />
        {mode === "execute" ? (
          <div className="flex flex-col h-full">
            <ChatMessages messages={messages} isLoading={isLoading} />
            <ChatInput
              inputRef={inputRef}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              status={status}
              stop={stop}
              messages={messages}
              append={append}
            />
          </div>
        ) : (
          <ChatInterface />
        )}
      </div>
      <elevenlabs-convai agent-id={process.env.NEXT_PUBLIC_AGENT_ID}></elevenlabs-convai>
      <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
    </div>
  );
}
