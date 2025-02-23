import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export function WorkflowChat() {
  useEffect(() => {
    createChat({
      webhookUrl: process.env.NEXT_PUBLIC_WORFLOW
    });
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0 text-center">
      <h2 className="text-white text-lg mb-4">Chat Integration</h2>
      <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
        Chat is Ready
      </Button>
    </div>
  );
}
