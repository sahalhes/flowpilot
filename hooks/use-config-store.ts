"use client"

import { useState, useEffect } from "react"

export type ConfigValues = {
  workflowUrl: string
  picaSecretKey: string
  azureApiKey: string
  [key: string]: string
}

const defaultConfig: ConfigValues = {
  workflowUrl: "",
  picaSecretKey: "",
  azureApiKey: "",
}

export function useConfigStore() {
  const [config, setConfig] = useState<ConfigValues>(defaultConfig)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const storedConfig = localStorage.getItem("workflow-config")
    if (storedConfig) {
      try {
        setConfig(JSON.parse(storedConfig))
      } catch (e) {
        console.error("Failed to parse stored config:", e)
      }
    }
    setIsLoaded(true)
  }, [])

  const updateConfig = (newConfig: ConfigValues) => {
    setConfig(newConfig)
    localStorage.setItem("workflow-config", JSON.stringify(newConfig))
  }

  return {
    config,
    updateConfig,
    isLoaded,
  }
}

