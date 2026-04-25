import https from "https";

const BASE = "https://prepaid.desco.org.bd/api";

// DESCO's server has an untrusted cert chain — bypass only for this dedicated agent
const agent = new https.Agent({ rejectUnauthorized: false });

function descoGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  return new Promise((resolve, reject) => {
    https.get(url.toString(), { agent }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`DESCO API error ${res.statusCode}`));
          return;
        }
        try {
          resolve(JSON.parse(body) as T);
        } catch {
          reject(new Error("Invalid JSON from DESCO API"));
        }
      });
    }).on("error", reject);
  });
}

export type CustomerInfoResponse = {
  code: number;
  desc: string;
  data?: {
    customerName: string;
    accountNo: string;
    meterNo: string;
    tariffSolution: string;
    sanctionLoad: number;
    SDName: string;
    feederName?: string;
    installationAddress?: string;
    installationDate?: string;
    phaseType?: string;
    meterModel?: string;
    transformer?: string;
    contactNo?: string;
  };
};

export type BalanceResponse = {
  data?: {
    balance: number;
    currentMonthConsumption: number;
    readingTime: string;
  };
};

export async function getCustomerInfo(accountNo: string, meterNo: string) {
  return descoGet<CustomerInfoResponse>("/unified/customer/getCustomerInfo", {
    accountNo,
    meterNo,
  });
}

export async function getBalance(accountNo: string, meterNo: string) {
  return descoGet<BalanceResponse>("/unified/customer/getBalance", {
    accountNo,
    meterNo,
  });
}

export async function getCustomerLocation(accountNo: string) {
  return descoGet<{ code: number; data?: { zone: string; block: string; route: string } }>(
    "/common/getCustomerLocation",
    { accountNo }
  );
}

export async function getDailyConsumption(accountNo: string, dateFrom: string, dateTo: string) {
  return descoGet<{ data?: unknown[] }>(
    "/unified/customer/getCustomerDailyConsumption",
    { accountNo, dateFrom, dateTo }
  );
}

export async function getMonthlyConsumption(accountNo: string, monthFrom: string, monthTo: string) {
  return descoGet<{ data?: unknown[] }>(
    "/unified/customer/getCustomerMonthlyConsumption",
    { accountNo, monthFrom, monthTo }
  );
}

export async function getRechargeHistory(accountNo: string, dateFrom: string, dateTo: string) {
  return descoGet<{ data?: unknown[] }>(
    "/unified/customer/getRechargeHistory",
    { accountNo, dateFrom, dateTo }
  );
}
