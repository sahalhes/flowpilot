"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useAuthKit } from "@picahq/authkit";
import { Header } from "./components/Header";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function Home() {
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

  const {
    messages,
    handleSubmit,
    input,
    handleInputChange,
    append,
    isLoading,
    stop,
    status,
  } = useChat({
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

  useEffect(() => {
    createChat({
      webhookUrl: process.env.NEXT_PUBLIC_WORFLOW
    });
  }, []);
  

  return (
    <div className="flex flex-col justify-between h-dvh">
      <div className="flex flex-col h-full">
        <Header />
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
      <elevenlabs-convai agent-id="WR8FJywOWW2B9SK3HeCg"></elevenlabs-convai>
      <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
    </div>
  );
}
