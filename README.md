This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Admin order updates

Before using manual order add/edit/delete and planner response timing, run
`supabase/migrations/202609170001_admin_order_updates.sql` in your Supabase
project's SQL Editor (or apply it with your existing Supabase migration workflow).
It adds nullable `orders.address` and `planner_logs.duration_ms` columns and can
be run again safely. Existing orders and planner logs are preserved.

The existing database policies must allow authenticated admins to select,
insert, update, and delete orders, and read planner logs. Keep these permissions
restricted to admins; the browser's page guard does not replace database RLS.
The planner API also needs its existing permission to insert planner logs.

The dashboard averages recorded server-side planner execution times, excluding
old logs without timing data. This measures AI response time, not user session
length. Failed order saves retain the form contents and display an error.

Local development requires `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` in `.env.local`.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
