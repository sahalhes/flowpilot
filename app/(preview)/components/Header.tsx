import { GitHubIcon } from "@/components/icons";
import Image from "next/image";

export function Header() {
  return (
    <header className="w-full py-4 px-6 bg-black">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <a href="/" className="hover:opacity-80 transition-opacity">
          <Image src="/logo-white.svg" alt="Logo" width={100} height={100} />
        </a>
        <a
            href="https://github.com/sahalhes/flowpilot"
            target="_blank"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <GitHubIcon size={18} />
            <span className="hidden sm:inline">sahalhes/flowpilot</span>
          </a>
      </div>
    </header>
  );
}

          
      