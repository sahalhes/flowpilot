import { motion } from "framer-motion";
import { FormEvent, RefObject } from "react";
import { suggestedActions } from "../constants/suggestedActions";
import { ChatRequestOptions } from "ai";
import { CreateMessage, Message } from "ai";

interface ChatInputProps {
  inputRef: RefObject<HTMLTextAreaElement>;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
  isLoading: boolean;
  status: string;
  stop: () => void;
  messages: Message[];
}

export function ChatInput({
  inputRef,
  input,
  handleInputChange,
  handleSubmit,
  append,
  isLoading,
  status,
  stop,
  messages,
}: ChatInputProps) {
  const wrappedHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <div className="mt-auto w-full max-w-3xl mx-auto pb-4">
      <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mb-4">
        {messages.length === 0 &&
          suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              key={index}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <button
                onClick={async () => {
                  append({
                    role: "user",
                    content: suggestedAction.action,
                  });
                }}
                className="w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-3 transition-all duration-200 flex flex-col gap-1"
              >
                <span className="font-medium text-white text-sm">
                  {suggestedAction.title}
                </span>
                <span className="text-gray-400 text-xs">
                  {suggestedAction.label}
                </span>
              </button>
            </motion.div>
          ))}
      </div>
      
      <form
        className="flex flex-col gap-2 items-center px-4 md:px-0"
        onSubmit={wrappedHandleSubmit}
      >
        <div className="relative flex items-center w-full">
          <textarea
            ref={inputRef}
            rows={2}
            className="w-full resize-none rounded-lg bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
            placeholder={isLoading ? "Waiting for response..." : "Message Flow Pilot..."}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            disabled={isLoading}
          />
          {(status === "submitted" || status === "streaming") && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-gray-700 border border-gray-600 text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 text-sm"
              onClick={stop}
            >
              Stop
            </motion.button>
          )}
        </div>
        
        <div className="flex gap-3 w-full justify-center">
          {messages.length > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 text-sm"
              onClick={() => window.location.reload()}
            >
              Clear chat
            </motion.button>
          )}
          <motion.a
            href="https://app.picaos.com/connections"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200 text-sm"
          >
            + New Connection
          </motion.a>
        </div>
      </form>
    </div>
  );
}
