"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Workflow } from "lucide-react"

interface ModeToggleProps {
  mode: "execute" | "workflow"
  setMode: (mode: "execute" | "workflow") => void
}

export function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="flex justify-center my-4">
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as "execute" | "workflow")}
        className="w-full max-w-xs"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="execute" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>Execute</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            <span>Workflow</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

