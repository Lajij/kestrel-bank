import { cookies } from "next/headers";
import { findUserById, type User } from "./db";

export const SESSION_COOKIE = "kb_session";

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return findUserById(id) ?? null;
}
