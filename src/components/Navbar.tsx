"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/meters/add", label: "+ Add Meter" },
  { href: "/about", label: "About" },
];

export default function Navbar({ email }: { email: string }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 font-semibold text-gray-900 shrink-0"
        >
          <span className="text-blue-600 text-lg">⚡</span>
          <span className="hidden sm:inline">DESCO Dashboard</span>
          <span className="sm:hidden">DESCO</span>
        </Link>

        {/* Nav links — md+ */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Quick-action buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Helpline call button */}
          <a
            href="tel:16120"
            title="DESCO Helpline 16120"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-3.5 h-3.5 shrink-0" fill="currentColor">
              <path d="M449.366,89.648l-.685-.428L362.088,46.559,268.625,171.176l43,57.337a88.529,88.529,0,0,1-83.115,83.114l-57.336-43L46.558,362.088l42.306,85.869.356.725.429.684a25.085,25.085,0,0,0,21.393,11.857h22.344A327.836,327.836,0,0,0,461.222,133.386V111.041A25.084,25.084,0,0,0,449.366,89.648Zm-20.144,43.738c0,163.125-132.712,295.837-295.836,295.837h-18.08L87,371.76l84.18-63.135,46.867,35.149h5.333a120.535,120.535,0,0,0,120.4-120.4v-5.333l-35.149-46.866L371.759,87l57.463,28.311Z"/>
            </svg>
            <span className="hidden sm:inline">16120</span>
          </a>

          {/* DESCO consumer portal */}
          <a
            href="https://prepaid.desco.org.bd/customer/#/customer-login"
            target="_blank"
            rel="noopener noreferrer"
            title="DESCO Prepaid Customer Portal"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="hidden sm:inline">DESCO Portal</span>
          </a>

          <div className="w-px h-4 bg-gray-200 hidden sm:block" />

          {/* User email + sign out */}
          <span className="text-xs text-gray-400 hidden lg:block max-w-[140px] truncate">{email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
