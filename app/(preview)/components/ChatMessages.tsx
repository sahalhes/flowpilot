import { Message } from "@/components/message";
import { motion } from "framer-motion";
import { ColorfulLoadingAnimation } from "@/components/loading-spinner";
import { Message as MessageType } from "ai";
import { suggestedActions } from "../constants/suggestedActions";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: MessageType[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only scroll when a new user message is added
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col gap-6 w-full md:w-[800px] items-center overflow-y-auto mx-auto md:px-0 custom-scrollbar h-[calc(100vh-300px)]"
    >
      {messages.length === 0 && (
        <motion.div 
          className="h-[350px] px-4 w-full md:w-[800px] md:px-0 pt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center justify-center gap-8 text-center">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                FlowPilot
              </h1>
              <div className="absolute -inset-1 blur-xl bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 -z-10" />
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-6 max-w-[600px] mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-1xl font-medium bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                Use your PICA connections as well as your custom agentic workflow easily
              </p>
              <p className="text-base text-gray-400 leading-relaxed">
                Build powerful integrations and automate workflows instantly.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
              toolInvocations={message.toolInvocations}
            />
          );
        }

        // For assistant messages, render if there's content or tool invocations
        if (
          message.role === "assistant" &&
          (message.content ||
            (message.toolInvocations && message.toolInvocations.length > 0))
        ) {
          return (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
              toolInvocations={message.toolInvocations}
            />
          );
        }

        return null;
      })}

      {isLoading && (
        <>
          <div className="w-full md:px-0">
            <div className="flex items-center gap-2 px-4 py-3">
              <ColorfulLoadingAnimation
                scale={0.5}
                colorScheme="picaGreen"
                animationPattern="default"
              />
              <span className="text-sm text-gray-400 font-light">
                AI is thinking...
              </span>
            </div>
          </div>
        </>
      )}
      
      {messages.length > 0 && (
        <div
          ref={messagesEndRef}
          className="relative flex items-center justify-center w-full h-[500px] min-h-[500px]"
        />
      )}
    </div>
  );
}