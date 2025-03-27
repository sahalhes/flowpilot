import { useState } from "react";
import { GitHubIcon } from "@/components/icons";
import Image from "next/image";
import { Settings } from "lucide-react";
import { SettingsPanel, ConfigValues } from "./settings-panel";

export function Header() {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [config, setConfig] = useState<ConfigValues>(() => {
    // Try to load from localStorage on initial render
    const savedConfig = localStorage.getItem('flowpilot-config');
    return savedConfig ? JSON.parse(savedConfig) : {
      workflowUrl: process.env.NEXT_PUBLIC_WORKFLOW_URL || '',
      picaSecretKey: '',
      azureApiKey: ''
    };
  });

  const handleSaveSettings = (values: ConfigValues) => {
    setConfig(values);
    // Save to localStorage
    localStorage.setItem('flowpilot-config', JSON.stringify(values));
    setIsSettingsPanelOpen(false);
  };

  return (
    <>
      <header className="w-full py-4 px-6 bg-black relative">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <a href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/logo-white.svg" alt="Logo" width={100} height={100} />
          </a>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sahalhes/flowpilot"
              target="_blank"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <GitHubIcon size={18} />
              <span className="hidden sm:inline">sahalhes/flowpilot</span>
            </a>
            <button 
              onClick={() => setIsSettingsPanelOpen(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>
      <SettingsPanel 
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        onSave={handleSaveSettings}
        initialValues={config}
      />
    </>
  );
}