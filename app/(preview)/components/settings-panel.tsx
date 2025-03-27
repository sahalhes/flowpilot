"use client"

import { useState } from "react"
import { X, Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export type ConfigValues = {
  workflowUrl: string
  picaSecretKey: string
  azureApiKey: string
  [key: string]: string
}

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  onSave: (values: ConfigValues) => void
  initialValues: ConfigValues
}

export function SettingsPanel({ isOpen, onClose, onSave, initialValues }: SettingsPanelProps) {
  const [values, setValues] = useState<ConfigValues>(initialValues)
  const [showSecrets, setShowSecrets] = useState(false)

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(values)
    toast.success("Settings saved successfully")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-zinc-900 border-l border-zinc-800 shadow-xl z-50 overflow-y-auto">
      <div className="p-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-zinc-400" />
          <h2 className="text-lg font-semibold">Configuration</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-secrets" className="text-sm">
            Show Secret Values
          </Label>
          <Switch id="show-secrets" checked={showSecrets} onCheckedChange={setShowSecrets} />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-400">Workflow Settings</h3>

          <div className="space-y-2">
            <Label htmlFor="workflow-url">Workflow URL</Label>
            <Input
              id="workflow-url"
              value={values.workflowUrl}
              onChange={(e) => handleChange("workflowUrl", e.target.value)}
              placeholder="https://your-workflow-url.com/api/workflow"
              className="bg-zinc-950 border-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pica-key">Pica Secret Key</Label>
            <Input
              id="pica-key"
              value={values.picaSecretKey}
              onChange={(e) => handleChange("picaSecretKey", e.target.value)}
              type={showSecrets ? "text" : "password"}
              placeholder="pica_sk_..."
              className="bg-zinc-950 border-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="azure-key">Azure API Key</Label>
            <Input
              id="azure-key"
              value={values.azureApiKey}
              onChange={(e) => handleChange("azureApiKey", e.target.value)}
              type={showSecrets ? "text" : "password"}
              placeholder="azure_key_..."
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
        </div>

        <Button className="w-full mt-4" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  )
}

