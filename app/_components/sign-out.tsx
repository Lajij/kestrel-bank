"use client";

import { useRouter } from "next/navigation";

export function SignOut() {
  const router = useRouter();
  async function onClick() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/10"
    >
      Sign out
    </button>
  );
}
