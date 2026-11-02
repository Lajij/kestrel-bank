#!/usr/bin/env node
// Access check for Kestrel Bank's transactions API: verifies that one user
// cannot read another user's account.
//
// It signs in as Alice, confirms the normal journey works against one of
// Alice's own accounts, then attempts to read an account that belongs to a
// different user (Bob). A secure app would reject the second request.
//
// Exit codes:
//   0  ACCESS DENIED — cross-account read was refused
//   1  ACCESS LEAK   — cross-account read succeeded
//   2  JOURNEY FAIL  — baseline request as Alice did not return 200

const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  ""
);

const ALICE = { email: "alice@kestrel.test", password: "demo" };
const ALICE_ACCOUNT = "acc_alice_01";
const BOB_ACCOUNT = "acc_bob_01";

function extractSessionCookie(res) {
  const all =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : [res.headers.get("set-cookie")].filter(Boolean);
  for (const line of all) {
    const match = /(^|;\s*)kb_session=([^;]+)/.exec(line);
    if (match) return `kb_session=${match[2]}`;
  }
  return null;
}

async function main() {
  console.log(`Target: ${BASE_URL}`);

  // 1. Log in as Alice.
  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ALICE),
  });
  if (!loginRes.ok) {
    console.error(`Login failed (status ${loginRes.status})`);
    process.exit(2);
  }
  const cookie = extractSessionCookie(loginRes);
  if (!cookie) {
    console.error("Login succeeded but no kb_session cookie was returned");
    process.exit(2);
  }
  console.log("Logged in as alice@kestrel.test");

  // 2. Baseline: Alice reads her own account. Must be 200.
  const ownRes = await fetch(
    `${BASE_URL}/api/accounts/${ALICE_ACCOUNT}/transactions`,
    { headers: { Cookie: cookie } }
  );
  if (ownRes.status !== 200) {
    console.error(
      `Baseline request for ${ALICE_ACCOUNT} returned ${ownRes.status}, expected 200`
    );
    process.exit(2);
  }
  console.log(`JOURNEY OK — ${ALICE_ACCOUNT} returned 200 for its owner`);

  // 3. Attempt the cross-account read: Alice's session, Bob's account.
  const crossRes = await fetch(
    `${BASE_URL}/api/accounts/${BOB_ACCOUNT}/transactions`,
    { headers: { Cookie: cookie } }
  );

  if (crossRes.status === 200) {
    const data = await crossRes.json().catch(() => null);
    const count = data?.transactions?.length ?? "?";
    const balance = data?.account?.balance;
    console.log(
      `ACCESS LEAK — ${BOB_ACCOUNT} returned 200 to Alice ` +
        `(${count} transactions` +
        (balance != null ? `, balance ${balance}` : "") +
        ")"
    );
    process.exit(1);
  }

  console.log(`ACCESS DENIED — ${BOB_ACCOUNT} returned ${crossRes.status} to Alice`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Access check error:", err);
  process.exit(2);
});
