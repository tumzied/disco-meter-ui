import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://desco-meter.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DESCO Meter Dashboard",
    template: "%s | DESCO Meter Dashboard",
  },
  description:
    "A free personal dashboard to monitor your DESCO prepaid electricity meters — live balance, consumption trends, and recharge history, all in one place.",
  keywords: [
    "DESCO meter",
    "prepaid electricity Bangladesh",
    "DESCO balance check",
    "electricity meter dashboard",
    "DESCO prepaid",
  ],
  authors: [{ name: "DESCO Meter Dashboard" }],
  creator: "DESCO Meter Dashboard",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "DESCO Meter Dashboard",
    title: "DESCO Meter Dashboard — Your meter, always in view",
    description:
      "Monitor your DESCO prepaid electricity meters for free. Live balance, consumption charts, and recharge history in one place.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DESCO Meter Dashboard — Your meter, always in view",
    description:
      "Monitor your DESCO prepaid electricity meters for free. Live balance, consumption charts, and recharge history in one place.",
  },
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
