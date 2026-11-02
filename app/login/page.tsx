"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alice@kestrel.test");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Login failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <section className="hidden lg:flex flex-col justify-between bg-[var(--navy)] text-white p-12">
        <div className="flex items-center gap-3">
          <Mark />
          <span className="text-lg font-semibold tracking-tight">
            Kestrel Bank
          </span>
        </div>
        <div className="max-w-sm">
          <h1 className="text-3xl font-semibold leading-tight">
            Banking that stays out of your way.
          </h1>
          <p className="mt-4 text-white/70 text-sm leading-relaxed">
            Everyday accounts, savings, and instant transfers — built for
            Australians who&apos;d rather be doing something else.
          </p>
        </div>
        <p className="text-xs text-white/40">
          Demo environment · fictional institution · not a real bank
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8 text-[var(--navy)]">
            <Mark dark />
            <span className="text-lg font-semibold tracking-tight">
              Kestrel Bank
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-[var(--navy)]">Sign in</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Welcome back. Enter your details to continue.
          </p>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[var(--foreground)]">
                Email
              </span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--navy-500)] focus:ring-2 focus:ring-[var(--navy-500)]/15"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-[var(--foreground)]">
                Password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--navy-500)] focus:ring-2 focus:ring-[var(--navy-500)]/15"
              />
            </label>

            {error && (
              <p className="text-sm text-[var(--negative)]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--navy-700)] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-8 rounded-lg border border-dashed border-[var(--border)] bg-white/60 p-4 text-xs text-[var(--muted)]">
            <p className="font-medium text-[var(--foreground)]">Demo accounts</p>
            <p className="mt-1">
              alice@kestrel.test · bob@kestrel.test — password{" "}
              <code className="font-mono">demo</code>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Mark({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect
        width="32"
        height="32"
        rx="8"
        fill={dark ? "#0a1f44" : "#ffffff"}
        fillOpacity={dark ? 1 : 0.12}
      />
      <path
        d="M10 22V10l6 6 6-6v12"
        stroke={dark ? "#ffffff" : "#ffffff"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
