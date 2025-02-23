import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ModeToggleProps {
  mode: "execute" | "workflow"
  setMode: (mode: "execute" | "workflow") => void
}

export function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0 mb-6">
      <Tabs value={mode} onValueChange={(value) => setMode(value as "execute" | "workflow")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="execute"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-500"
          >
            Execute
          </TabsTrigger>
          <TabsTrigger
            value="workflow"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-500"
          >
            Workflow
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

