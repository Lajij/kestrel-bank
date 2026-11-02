import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAccountById } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/session";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const account = getAccountById(id);
  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json({
    account: {
      id: account.id,
      name: account.name,
      bsb: account.bsb,
      number: account.number,
      balance: account.balance,
    },
    transactions: account.transactions,
  });
}
