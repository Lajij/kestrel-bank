import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getAccountsByOwner, type Transaction } from "@/lib/db";
import { SignOut } from "@/app/_components/sign-out";

const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

const shortDate = new Intl.DateTimeFormat("en-AU", {
  day: "2-digit",
  month: "short",
});

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const accounts = getAccountsByOwner(user.id);
  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  const feed: (Transaction & { accountName: string })[] = accounts
    .flatMap((a) => a.transactions.map((t) => ({ ...t, accountName: a.name })))
    .sort((x, y) => (x.date < y.date ? 1 : -1))
    .slice(0, 12);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="bg-[var(--navy)] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden>
              <rect width="32" height="32" rx="8" fill="#ffffff" fillOpacity="0.12" />
              <path
                d="M10 22V10l6 6 6-6v12"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-base font-semibold tracking-tight">
              Kestrel Bank
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/70 sm:inline">
              {user.name}
            </span>
            <SignOut />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Summary */}
        <section className="mb-8">
          <p className="text-sm text-[var(--muted)]">Total balance</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-[var(--navy)]">
            {aud.format(total)}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Across {accounts.length} account{accounts.length === 1 ? "" : "s"}
          </p>
        </section>

        {/* Account cards */}
        <section className="grid gap-4 sm:grid-cols-2">
          {accounts.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[var(--navy)]">
                    {a.name}
                  </h2>
                  <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">
                    BSB {a.bsb} · {a.number}
                  </p>
                </div>
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              </div>
              <p className="mt-6 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {aud.format(a.balance)}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">Available balance</p>
            </article>
          ))}
        </section>

        {/* Transactions */}
        <section className="mt-10">
          <h3 className="mb-3 text-sm font-semibold text-[var(--navy)]">
            Recent transactions
          </h3>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <ul className="divide-y divide-[var(--border)]">
              {feed.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 shrink-0 text-xs font-medium text-[var(--muted)]">
                      {shortDate.format(new Date(t.date))}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {t.description}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {t.accountName}
                      </p>
                    </div>
                  </div>
                  <span
                    className="font-mono text-sm font-semibold tabular-nums"
                    style={{
                      color:
                        t.amount >= 0 ? "var(--positive)" : "var(--foreground)",
                    }}
                  >
                    {t.amount >= 0 ? "+" : "−"}
                    {aud.format(Math.abs(t.amount)).replace("$", "$")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
