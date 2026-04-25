"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Recharge = {
  orderID: string;
  token: string;
  sequence: string;
  totalAmount: number;
  energyAmount: number;
  chargeAmount: number;
  vat: number;
  rebate: number;
  date: string;
  operator: string;
  status: string;
};

const PAGE_SIZE = 20;

function today() { return new Date().toISOString().slice(0, 10); }
function daysAgoStr(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const OPERATOR_COLORS: Record<string, string> = {
  bKash: "bg-pink-100 text-pink-700",
  uPay: "bg-green-100 text-green-700",
  Nagad: "bg-orange-100 text-orange-700",
  Rocket: "bg-purple-100 text-purple-700",
};
function operatorBadge(op: string) {
  return OPERATOR_COLORS[op] ?? "bg-gray-100 text-gray-700";
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button onClick={handleCopy} className="ml-1.5 text-gray-400 hover:text-gray-600 transition-colors" title="Copy token">
      {copied ? (
        <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

export default function RechargeHistory({
  meterId,
  meterLabel,
}: {
  meterId: number;
  meterLabel: string;
}) {
  const [from, setFrom] = useState(daysAgoStr(90));
  const [to, setTo] = useState(today());
  const [data, setData] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    setPage(1);
    try {
      const res = await fetch(`/api/meters/${meterId}/recharges?from=${from}&to=${to}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load");
      setData(json.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load recharge history");
    } finally {
      setLoading(false);
    }
  }, [meterId, from, to]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const pageData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRecharged = data.reduce((s, r) => s + r.totalAmount, 0);
  const totalEnergy = data.reduce((s, r) => s + r.energyAmount, 0);
  const totalVat = data.reduce((s, r) => s + r.vat, 0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-800">← Dashboard</Link>
        <span className="text-gray-300">/</span>
        <Link href={`/meters/${meterId}`} className="text-gray-500 hover:text-gray-800">{meterLabel}</Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-700">Recharge History</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Recharge History</h1>

      {/* Date range controls */}
      <div className="flex flex-wrap items-end gap-4 bg-white border border-gray-200 rounded-2xl p-4 mb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={to}
            min={from}
            max={today()}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          {[
            { label: "30d", days: 30 },
            { label: "90d", days: 90 },
            { label: "180d", days: 180 },
            { label: "1yr", days: 365 },
          ].map(({ label, days }) => (
            <button
              key={label}
              onClick={() => { setFrom(daysAgoStr(days)); setTo(today()); }}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-500">
          <p className="mb-3">{error}</p>
          <button onClick={fetchData} className="text-blue-600 hover:underline">Retry</button>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-400">
          No recharges found in this period
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Total Recharged</p>
              <p className="font-semibold text-gray-900">৳ {totalRecharged.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Total Energy</p>
              <p className="font-semibold text-gray-900">৳ {totalEnergy.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Total VAT</p>
              <p className="font-semibold text-gray-900">৳ {totalVat.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Transactions</p>
              <p className="font-semibold text-gray-900">{data.length}</p>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden space-y-3 mb-4">
            {pageData.map((r) => (
              <div key={r.orderID} className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">৳ {r.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.date.slice(0, 10)} · {r.date.slice(11, 16)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${operatorBadge(r.operator)}`}>
                      {r.operator}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "Execution Successful" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {r.status === "Execution Successful" ? "OK" : "Fail"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-400">Energy</p>
                    <p className="font-medium text-green-700">৳ {r.energyAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Charges</p>
                    <p className="font-medium text-gray-600">৳ {r.chargeAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">VAT</p>
                    <p className="font-medium text-gray-600">৳ {r.vat.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                  <p className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{r.token}</p>
                  <CopyButton text={r.token} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Token</th>
                    <th className="px-4 py-3 font-medium">Operator</th>
                    <th className="px-4 py-3 font-medium text-right">Total (৳)</th>
                    <th className="px-4 py-3 font-medium text-right">Energy (৳)</th>
                    <th className="px-4 py-3 font-medium text-right">Charges (৳)</th>
                    <th className="px-4 py-3 font-medium text-right">VAT (৳)</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((r) => (
                    <tr key={r.orderID} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">{r.sequence}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        <div>{r.date.slice(0, 10)}</div>
                        <div className="text-xs text-gray-400">{r.date.slice(11, 16)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center font-mono text-xs text-gray-700">
                          <span className="truncate max-w-[140px]">{r.token}</span>
                          <CopyButton text={r.token} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${operatorBadge(r.operator)}`}>
                          {r.operator}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {r.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-green-700">
                        {r.energyAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {r.chargeAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {r.vat.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.status === "Execution Successful"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {r.status === "Execution Successful" ? "Success" : r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Pagination — shared between mobile cards and desktop table */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-3 mt-2">
              <p className="text-xs text-gray-500">
                Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, data.length)} of {data.length}
              </p>
              <div className="flex gap-1 flex-wrap justify-end">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-white bg-white transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                      p === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 bg-white transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-8">
        {[60, 90, 160, 70, 60, 60, 60, 60, 70].map((w, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border-b border-gray-50 px-4 py-3.5 flex gap-8 items-center">
          {[30, 70, 140, 50, 55, 55, 55, 55, 60].map((w, j) => (
            <div key={j} className="h-3 bg-gray-100 rounded" style={{ width: w }} />
          ))}
        </div>
      ))}
    </div>
  );
}
