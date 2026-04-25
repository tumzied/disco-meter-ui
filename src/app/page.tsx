import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://desco-meter.vercel.app";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
  openGraph: { url: siteUrl },
};

export default async function LandingPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const features = [
    {
      icon: "⚡",
      title: "Live Balance",
      desc: "See your remaining prepaid balance the moment you open the dashboard — no refresh needed.",
    },
    {
      icon: "📊",
      title: "Consumption Charts",
      desc: "Daily and monthly kWh charts with cost breakdown and flexible date range filters.",
    },
    {
      icon: "🔄",
      title: "Recharge History",
      desc: "Full transaction log with token numbers, operators, VAT, and service charges.",
    },
    {
      icon: "🏠",
      title: "Multiple Meters",
      desc: "Register and monitor as many meters as you need — all under one account.",
    },
  ];

  const steps = [
    {
      n: "1",
      title: "Create an account",
      desc: "Register with your email and a password. Your credentials are stored locally — nothing is shared with third parties.",
    },
    {
      n: "2",
      title: "Add your meter",
      desc: "Enter your DESCO account number and meter number. The app verifies them against DESCO before saving.",
    },
    {
      n: "3",
      title: "Monitor in real time",
      desc: "Your dashboard fetches live data directly from DESCO every time you load or refresh — no stale cache.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DESCO Meter Dashboard",
    url: siteUrl,
    description:
      "A free personal dashboard to monitor DESCO prepaid electricity meters — live balance, consumption trends, and recharge history.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BDT" },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-gray-900">
            <span className="text-blue-600 text-lg">⚡</span>
            DESCO Dashboard
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-3xl mb-6 shadow-lg shadow-blue-200">
              ⚡
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Your DESCO meter,<br className="hidden sm:block" /> always in view
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
              A personal dashboard to monitor your DESCO prepaid electricity meters —
              live balance, consumption trends, and recharge history, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                Get started — it's free
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-3 divide-x divide-blue-500 text-center">
            {[
              { value: "Live", label: "Balance data" },
              { value: "Free", label: "No subscription" },
              { value: "Private", label: "Your data only" },
            ].map((s) => (
              <div key={s.label} className="px-4">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Everything you need</h2>
            <p className="text-gray-500">Stop logging into the DESCO portal just to check your balance.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex gap-4 hover:shadow-sm transition-shadow"
              >
                <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{f.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white border-y border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Up and running in minutes</h2>
              <p className="text-gray-500">No app to download. No complicated setup.</p>
            </div>
            <div className="space-y-4">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {s.n}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-0.5">{s.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to try it?</h2>
          <p className="text-gray-500 mb-6">Create a free account and add your first meter in under a minute.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            Get started free →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="text-blue-500">⚡</span>
            <span>DESCO Dashboard — unofficial personal tool</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:16120" className="hover:text-gray-600 transition-colors">Helpline 16120</a>
            <a
              href="https://prepaid.desco.org.bd/customer/#/customer-login"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              DESCO Portal
            </a>
            <Link href="/about" className="hover:text-gray-600 transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
