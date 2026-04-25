import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "DESCO Meter Dashboard",
  description: "Monitor your DESCO prepaid electricity meters",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-gray-200 bg-white mt-8">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-400">
            <span>⚡ DESCO Meter Dashboard</span>
            <span>Data sourced from prepaid.desco.org.bd</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
