# DESCO Meter Dashboard

An unofficial personal dashboard for monitoring DESCO prepaid electricity meters in Bangladesh. Track live balance, consumption trends, and recharge history — all in one place.

## Features

- **Live balance** — remaining balance fetched directly from DESCO on every load
- **Consumption charts** — daily and monthly kWh charts with cost breakdown and date range filters
- **Recharge history** — full transaction log with token numbers, operators, VAT, and service charges
- **Multiple meters** — register and monitor as many meters as you need under one account
- **Auth** — email/password login with JWT sessions stored in httpOnly cookies

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL via Prisma 7 |
| ORM adapter | `@prisma/adapter-pg` |
| Auth | JWT + bcryptjs |
| Charts | Recharts |
| Styling | Tailwind CSS 4 |

## Local Development

### Prerequisites

- Node.js 20+
- A PostgreSQL database (Neon free tier works great)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env file and fill in your values
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="your-long-random-secret"
```

```bash
# 3. Apply database migrations
npx prisma migrate deploy

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT session tokens — use a long random string in production |

## Deployment (Vercel + Neon)

1. Create a free PostgreSQL database at [neon.tech](https://neon.tech)
2. Push this repo to GitHub
3. Import the repo on [vercel.com](https://vercel.com) — set the **Root Directory** to `disco-app`
4. Add `DATABASE_URL` and `JWT_SECRET` as environment variables in the Vercel project settings
5. Deploy — Vercel runs `npm run build` which auto-generates the Prisma client

## Disclaimer

This is an unofficial personal tool. It reads publicly accessible data from the DESCO prepaid API on your behalf. It is not affiliated with or endorsed by DESCO. For official support call **16120**.
