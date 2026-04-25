"use client";

import { useState, useEffect, useCallback } from "react";
import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

type DailyEntry = { date: string; kWh: number; taka: number };
type MonthlyEntry = { month: string; kWh: number; taka: number; maxDemand: number | null; apf: number | null };

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgoStr(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function monthsAgoStr(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function currentMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const CustomTooltipDaily = ({ active, payload, label }: {active?: boolean; payload?: {value: number; name: string; color: string}[]; label?: string}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-700 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "kWh" ? `${p.value} kWh` : `৳ ${p.value}`}
        </p>
      ))}
    </div>
  );
};

const CustomTooltipMonthly = ({ active, payload, label }: {active?: boolean; payload?: {value: number; name: string; color: string}[]; label?: string}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-700 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "kWh" ? `${p.value} kWh` : `৳ ${p.value}`}
        </p>
      ))}
    </div>
  );
};

export default function ConsumptionCharts({
  meterId,
  meterLabel,
}: {
  meterId: number;
  meterLabel: string;
}) {
  const [tab, setTab] = useState<"daily" | "monthly">("daily");

  // Daily state
  const [dailyFrom, setDailyFrom] = useState(daysAgoStr(30));
  const [dailyTo, setDailyTo] = useState(todayStr());
  const [dailyData, setDailyData] = useState<DailyEntry[]>([]);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyError, setDailyError] = useState("");

  // Monthly state
  const [monthFrom, setMonthFrom] = useState(monthsAgoStr(12));
  const [monthTo, setMonthTo] = useState(currentMonthStr());
  const [monthlyData, setMonthlyData] = useState<MonthlyEntry[]>([]);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyError, setMonthlyError] = useState("");

  const fetchDaily = useCallback(async () => {
    setDailyLoading(true);
    setDailyError("");
    try {
      const res = await fetch(`/api/meters/${meterId}/daily?from=${dailyFrom}&to=${dailyTo}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load");
      setDailyData(json.data);
    } catch (e: unknown) {
      setDailyError(e instanceof Error ? e.message : "Failed to load daily data");
    } finally {
      setDailyLoading(false);
    }
  }, [meterId, dailyFrom, dailyTo]);

  const fetchMonthly = useCallback(async () => {
    setMonthlyLoading(true);
    setMonthlyError("");
    try {
      const res = await fetch(`/api/meters/${meterId}/monthly?from=${monthFrom}&to=${monthTo}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load");
      setMonthlyData(json.data);
    } catch (e: unknown) {
      setMonthlyError(e instanceof Error ? e.message : "Failed to load monthly data");
    } finally {
      setMonthlyLoading(false);
    }
  }, [meterId, monthFrom, monthTo]);

  useEffect(() => { fetchDaily(); }, [fetchDaily]);
  useEffect(() => { fetchMonthly(); }, [fetchMonthly]);

  const dailyTotalKwh = dailyData.reduce((s, d) => s + d.kWh, 0).toFixed(2);
  const dailyTotalTaka = dailyData.reduce((s, d) => s + d.taka, 0).toFixed(2);
  const monthlyTotalKwh = monthlyData.reduce((s, d) => s + d.kWh, 0).toFixed(2);
  const monthlyTotalTaka = monthlyData.reduce((s, d) => s + d.taka, 0).toFixed(2);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-800">← Dashboard</Link>
        <span className="text-gray-300">/</span>
        <Link href={`/meters/${meterId}`} className="text-gray-500 hover:text-gray-800">{meterLabel}</Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-700">Consumption</span>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Consumption</h1>

      {/* Tab toggle */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
        {(["daily", "monthly"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "daily" ? "Daily" : "Monthly"}
          </button>
        ))}
      </div>

      {/* ── DAILY TAB ── */}
      {tab === "daily" && (
        <div className="space-y-6">
          {/* Date range */}
          <div className="flex flex-wrap items-end gap-4 bg-white border border-gray-200 rounded-2xl p-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={dailyFrom}
                max={dailyTo}
                onChange={(e) => setDailyFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={dailyTo}
                min={dailyFrom}
                max={todayStr()}
                onChange={(e) => setDailyTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 ml-auto">
              {[7, 14, 30].map((n) => (
                <button
                  key={n}
                  onClick={() => { setDailyFrom(daysAgoStr(n)); setDailyTo(todayStr()); }}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {n}d
                </button>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          {!dailyLoading && dailyData.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Total Units" value={`${dailyTotalKwh} kWh`} />
              <StatCard label="Total Cost" value={`৳ ${dailyTotalTaka}`} />
              <StatCard label="Avg / Day" value={`${(Number(dailyTotalKwh) / dailyData.length).toFixed(2)} kWh`} />
              <StatCard label="Days" value={String(dailyData.length)} />
            </div>
          )}

          {/* Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Daily Usage</h2>
            {dailyLoading ? (
              <ChartSkeleton />
            ) : dailyError ? (
              <ErrorMsg msg={dailyError} onRetry={fetchDaily} />
            ) : dailyData.length === 0 ? (
              <EmptyMsg />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={dailyData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v.slice(5)}
                    interval="preserveStartEnd"
                  />
                  <YAxis yAxisId="kwh" orientation="left" tick={{ fontSize: 11 }} unit=" kWh" width={65} />
                  <YAxis yAxisId="taka" orientation="right" tick={{ fontSize: 11 }} unit=" ৳" width={60} />
                  <Tooltip content={<CustomTooltipDaily />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar yAxisId="kwh" dataKey="kWh" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={24} />
                  <Line yAxisId="taka" type="monotone" dataKey="taka" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* ── MONTHLY TAB ── */}
      {tab === "monthly" && (
        <div className="space-y-6">
          {/* Month range */}
          <div className="flex flex-wrap items-end gap-4 bg-white border border-gray-200 rounded-2xl p-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="month"
                value={monthFrom}
                max={monthTo}
                onChange={(e) => setMonthFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="month"
                value={monthTo}
                min={monthFrom}
                max={currentMonthStr()}
                onChange={(e) => setMonthTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 ml-auto">
              {[3, 6, 12].map((n) => (
                <button
                  key={n}
                  onClick={() => { setMonthFrom(monthsAgoStr(n)); setMonthTo(currentMonthStr()); }}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {n}mo
                </button>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          {!monthlyLoading && monthlyData.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Total Units" value={`${monthlyTotalKwh} kWh`} />
              <StatCard label="Total Cost" value={`৳ ${monthlyTotalTaka}`} />
              <StatCard label="Avg / Month" value={`${(Number(monthlyTotalKwh) / monthlyData.length).toFixed(0)} kWh`} />
              <StatCard label="Months" value={String(monthlyData.length)} />
            </div>
          )}

          {/* Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Monthly Usage</h2>
            {monthlyLoading ? (
              <ChartSkeleton />
            ) : monthlyError ? (
              <ErrorMsg msg={monthlyError} onRetry={fetchMonthly} />
            ) : monthlyData.length === 0 ? (
              <EmptyMsg />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis yAxisId="kwh" orientation="left" tick={{ fontSize: 11 }} unit=" kWh" width={65} />
                  <YAxis yAxisId="taka" orientation="right" tick={{ fontSize: 11 }} unit=" ৳" width={72} />
                  <Tooltip content={<CustomTooltipMonthly />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar yAxisId="kwh" dataKey="kWh" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Line yAxisId="taka" type="monotone" dataKey="taka" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b" }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Max demand table */}
          {!monthlyLoading && monthlyData.some((d) => d.maxDemand !== null) && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Max Demand & Power Factor</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                      <th className="pb-2 font-medium">Month</th>
                      <th className="pb-2 font-medium text-right">kWh</th>
                      <th className="pb-2 font-medium text-right">Cost (৳)</th>
                      <th className="pb-2 font-medium text-right">Max Demand (kW)</th>
                      <th className="pb-2 font-medium text-right">APF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...monthlyData].reverse().map((row) => (
                      <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 text-gray-700">{row.month}</td>
                        <td className="py-2 text-right font-medium">{row.kWh}</td>
                        <td className="py-2 text-right">৳ {row.taka.toLocaleString()}</td>
                        <td className="py-2 text-right">{row.maxDemand ?? "—"}</td>
                        <td className="py-2 text-right">{row.apf ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[300px] flex items-end gap-1 animate-pulse px-2">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-200 rounded-t"
          style={{ height: `${30 + Math.random() * 60}%` }}
        />
      ))}
    </div>
  );
}

function ErrorMsg({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-sm text-gray-500">
      <p>{msg}</p>
      <button onClick={onRetry} className="text-blue-600 hover:underline">Retry</button>
    </div>
  );
}

function EmptyMsg() {
  return (
    <div className="h-[300px] flex items-center justify-center text-sm text-gray-400">
      No data for this period
    </div>
  );
}
