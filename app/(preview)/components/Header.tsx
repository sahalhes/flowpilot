import Image from "next/image";
import { GitHubIcon, HelpIcon, VercelIcon } from "@/components/icons";

export function Header() {
  return (
    <header className="w-full py-6 px-4 md:px-0 flex-none">
      <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <a href="https://picaos.com" target="_blank" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logo-white.svg"
              alt="Pica Logo"
              width={90}
              height={24}
              className="h-6 w-auto"
            />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/picahq/pica"
            target="_blank"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <GitHubIcon size={18} />
            <span className="hidden sm:inline">picahq/pica</span>
          </a>
          <a
            href="https://docs.picaos.com/sdk/vercel-ai"
            target="_blank"
            className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors text-sm bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40 hover:border-emerald-700/40"
          >
            <HelpIcon size={16} />
            <span>Docs</span>
          </a>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto w-full mt-6">
        <div className="h-px w-full bg-white/10" />
        <div className="flex items-center justify-between mt-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Join our community of</span>
            <a
              href="https://www.picaos.com/community"
              target="_blank"
              className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              passionate developers
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Powered by</span>
            <a
              href="https://sdk.vercel.ai"
              target="_blank"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <VercelIcon size={14} />
              <span className="text-sm">AI SDK</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}