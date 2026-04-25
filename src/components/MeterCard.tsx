import Link from "next/link";
import { getBalance, getCustomerInfo, getRechargeHistory } from "@/lib/desco";
import { Meter } from "@/generated/prisma/client";

function todayStr() { return new Date().toISOString().slice(0, 10); }
function daysAgoStr(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

type RawRecharge = { totalAmount: number; rechargeDate: string; rechargeOperator: string };

const OPERATOR_LABELS: Record<string, string> = {
  bkash: "bKash", opupay: "uPay", nagad: "Nagad", rocket: "Rocket",
};

export default async function MeterCard({ meter }: { meter: Meter }) {
  const [infoRes, balRes, rechargeRes] = await Promise.allSettled([
    getCustomerInfo(meter.accountNo, meter.meterNo),
    getBalance(meter.accountNo, meter.meterNo),
    getRechargeHistory(meter.accountNo, daysAgoStr(90), todayStr()),
  ]);

  const info = infoRes.status === "fulfilled" ? infoRes.value?.data : null;
  const bal = balRes.status === "fulfilled" ? balRes.value?.data : null;
  const recharges = rechargeRes.status === "fulfilled"
    ? (rechargeRes.value?.data ?? []) as RawRecharge[]
    : [];

  const lastRecharge = recharges[0] ?? null;

  const balance = bal?.balance ?? null;
  const lowBalance = balance !== null && balance < 50;
  const mediumBalance = balance !== null && balance >= 50 && balance < 100;
  const balanceColor = lowBalance ? "text-red-600" : mediumBalance ? "text-orange-500" : "text-green-600";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-gray-900 text-lg leading-tight">
            {meter.nickname ?? info?.customerName ?? "Meter"}
          </h2>
          {meter.nickname && info?.customerName && (
            <p className="text-xs text-gray-400 mt-0.5">{info.customerName}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Account: {meter.accountNo} · Meter: {meter.meterNo}
          </p>
        </div>
        {lowBalance && (
          <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ml-2">
            Low Balance
          </span>
        )}
        {mediumBalance && (
          <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ml-2">
            Recharge Soon
          </span>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-500 mb-1">Remaining Balance</p>
        <p className={`text-xl font-bold ${balanceColor}`}>
          {balance !== null ? `৳ ${balance.toFixed(2)}` : "—"}
        </p>
      </div>

      {/* Last recharge */}
      <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-600 mb-0.5">Last Recharge</p>
          {lastRecharge ? (
            <p className="text-base font-bold text-blue-800">
              ৳ {lastRecharge.totalAmount.toFixed(2)}
            </p>
          ) : (
            <p className="text-base font-bold text-blue-400">—</p>
          )}
        </div>
        {lastRecharge && (
          <div className="text-right">
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {OPERATOR_LABELS[lastRecharge.rechargeOperator.toLowerCase()] ?? lastRecharge.rechargeOperator}
            </span>
            <p className="text-xs text-blue-500 mt-1">
              {lastRecharge.rechargeDate.slice(0, 10)}
            </p>
          </div>
        )}
      </div>

      {info && (
        <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
          <span>{info.tariffSolution}</span>
          <span>Load: {info.sanctionLoad} kW</span>
          <span>{info.SDName}</span>
        </div>
      )}

      {bal?.readingTime && (
        <p className="text-xs text-gray-400">Updated: {bal.readingTime}</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2">
        <Link
          href={`/meters/${meter.id}`}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          View details →
        </Link>
        <a
          href="https://ekpay.gov.bd/#/dedicated-biller/desco-prepaid"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          ⚡ Recharge
        </a>
      </div>
    </div>
  );
}
