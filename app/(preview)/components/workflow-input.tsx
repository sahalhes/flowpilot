import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FormEvent } from "react"

interface WorkflowInputProps {
  workflowUrl: string
  setWorkflowUrl: (url: string) => void
  onSubmit: (e: FormEvent) => void
}

export function WorkflowInput({ workflowUrl, setWorkflowUrl, onSubmit }: WorkflowInputProps) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-3xl mx-auto px-4 md:px-0">
      <div className="flex flex-col gap-4">
        <Input
          type="url"
          placeholder="Enter n8n workflow URL"
          value={workflowUrl}
          onChange={(e) => setWorkflowUrl(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
        />
        <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
          Connect Workflow
        </Button>
      </div>
    </form>
  )
}

