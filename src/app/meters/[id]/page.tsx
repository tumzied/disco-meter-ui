import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCustomerInfo, getCustomerLocation, getBalance } from "@/lib/desco";
import Navbar from "@/components/Navbar";
import RefreshButton from "@/components/RefreshButton";
import DeleteMeterButton from "@/components/DeleteMeterButton";

export default async function MeterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const meter = await db.meter.findFirst({
    where: { id: parseInt(id, 10), userId: session.userId },
  });
  if (!meter) notFound();

  const [infoRes, locRes, balRes] = await Promise.allSettled([
    getCustomerInfo(meter.accountNo, meter.meterNo),
    getCustomerLocation(meter.accountNo),
    getBalance(meter.accountNo, meter.meterNo),
  ]);

  const info = infoRes.status === "fulfilled" ? infoRes.value?.data : null;
  const loc = locRes.status === "fulfilled" ? locRes.value?.data : null;
  const bal = balRes.status === "fulfilled" ? balRes.value?.data : null;

  const balance = bal?.balance ?? null;
  const lowBalance = balance !== null && balance < 50;
  const mediumBalance = balance !== null && balance >= 50 && balance < 100;
  const balanceColor = lowBalance ? "text-red-600" : mediumBalance ? "text-orange-500" : "text-green-600";

  return (
    <>
      <Navbar email={session.email} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 text-sm">
            ← Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-700">
            {meter.nickname ?? info?.customerName ?? `Meter ${meter.meterNo}`}
          </span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {meter.nickname ?? info?.customerName ?? "Meter"}
            </h1>
            {meter.nickname && info?.customerName && (
              <p className="text-sm text-gray-400">{info.customerName}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://ekpay.gov.bd/#/dedicated-biller/desco-prepaid"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ⚡ Recharge
            </a>
            <RefreshButton />
            <DeleteMeterButton meterId={meter.id} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">Remaining Balance</p>
            <p className={`text-3xl font-bold ${balanceColor}`}>
              {balance !== null ? `৳ ${balance.toFixed(2)}` : "—"}
            </p>
            {lowBalance && (
              <p className="text-xs text-red-500 mt-1">Balance is low — please recharge soon</p>
            )}
            {mediumBalance && (
              <p className="text-xs text-orange-500 mt-1">Balance is running low — consider recharging</p>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">Current Month Usage</p>
            <p className="text-3xl font-bold text-gray-800">
              {bal?.currentMonthConsumption != null
                ? `${bal.currentMonthConsumption.toFixed(2)} kWh`
                : "—"}
            </p>
            {bal?.readingTime && (
              <p className="text-xs text-gray-400 mt-1">Last updated: {bal.readingTime}</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <h2 className="font-medium text-gray-900 mb-4">Account Details</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Account No.</dt>
              <dd className="font-medium text-gray-900">{meter.accountNo}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Meter No.</dt>
              <dd className="font-medium text-gray-900">{meter.meterNo}</dd>
            </div>
            {info && (
              <>
                <div>
                  <dt className="text-gray-500">Tariff</dt>
                  <dd className="font-medium text-gray-900">{info.tariffSolution}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Sanction Load</dt>
                  <dd className="font-medium text-gray-900">{info.sanctionLoad} kW</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Phase</dt>
                  <dd className="font-medium text-gray-900">{info.phaseType ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Sub-Division</dt>
                  <dd className="font-medium text-gray-900">{info.SDName}</dd>
                </div>
                {info.feederName && (
                  <div>
                    <dt className="text-gray-500">Feeder</dt>
                    <dd className="font-medium text-gray-900">{info.feederName}</dd>
                  </div>
                )}
                {info.transformer && (
                  <div>
                    <dt className="text-gray-500">Transformer</dt>
                    <dd className="font-medium text-gray-900">{info.transformer}</dd>
                  </div>
                )}
                {info.meterModel && (
                  <div>
                    <dt className="text-gray-500">Meter Model</dt>
                    <dd className="font-medium text-gray-900">{info.meterModel}</dd>
                  </div>
                )}
                {info.installationDate && (
                  <div>
                    <dt className="text-gray-500">Installed</dt>
                    <dd className="font-medium text-gray-900">{info.installationDate}</dd>
                  </div>
                )}
              </>
            )}
            {loc && (
              <>
                <div>
                  <dt className="text-gray-500">Zone</dt>
                  <dd className="font-medium text-gray-900">{loc.zone}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Block</dt>
                  <dd className="font-medium text-gray-900">{loc.block}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Route</dt>
                  <dd className="font-medium text-gray-900">{loc.route}</dd>
                </div>
              </>
            )}
            {info?.installationAddress && (
              <div className="col-span-2">
                <dt className="text-gray-500">Address</dt>
                <dd className="font-medium text-gray-900 text-xs leading-relaxed">
                  {info.installationAddress}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/meters/${meter.id}/consumption`}
            className="flex-1 text-center py-2.5 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Consumption
          </Link>
          <Link
            href={`/meters/${meter.id}/recharges`}
            className="flex-1 text-center py-2.5 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Recharge History
          </Link>
        </div>
      </main>
    </>
  );
}
