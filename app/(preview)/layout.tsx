import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/sahalhes/flowpilot"),
  title: "FlowPilot",
  description: "Unleash the Potential of Agentic AI",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-box.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className={`${GeistSans.className} flex min-h-screen bg-gradient-to-b from-zinc-900 to-black`}>
          <div className="max-w-6xl w-full mx-auto px-4 md:px-8">
            <Toaster position="top-center" richColors />
            {children}
          </div>       
        </div>
      </body>
    </html>
  );
}