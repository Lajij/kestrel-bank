// In-memory seed data for Kestrel Bank (a fictional bank).
// This is demo data only — no real people, accounts, or money.

export type User = {
  id: string;
  email: string;
  password: string; // plaintext here purely because this is a throwaway demo seed
  name: string;
};

export type Transaction = {
  id: string;
  date: string; // ISO date
  description: string;
  amount: number; // AUD; negative = debit, positive = credit
};

export type Account = {
  id: string;
  ownerId: string;
  name: string;
  bsb: string;
  number: string;
  balance: number; // AUD
  transactions: Transaction[];
};

export const users: User[] = [
  {
    id: "usr_alice",
    email: "alice@kestrel.test",
    password: "demo",
    name: "Alice Nguyen",
  },
  {
    id: "usr_bob",
    email: "bob@kestrel.test",
    password: "demo",
    name: "Bob Thompson",
  },
];

export const accounts: Account[] = [
  {
    id: "acc_alice_01",
    ownerId: "usr_alice",
    name: "Everyday Access",
    bsb: "062-000",
    number: "1024 8831",
    balance: 4820.55,
    transactions: [
      { id: "txn_a1_1", date: "2026-10-31", description: "Woolworths Metro — Surry Hills", amount: -42.8 },
      { id: "txn_a1_2", date: "2026-10-30", description: "Salary — Nimbus Pty Ltd", amount: 3200.0 },
      { id: "txn_a1_3", date: "2026-10-29", description: "Opal Travel top-up", amount: -40.0 },
      { id: "txn_a1_4", date: "2026-10-28", description: "Telstra postpaid", amount: -65.0 },
      { id: "txn_a1_5", date: "2026-10-27", description: "Transfer to Bonus Saver", amount: -500.0 },
      { id: "txn_a1_6", date: "2026-10-26", description: "Dan Murphy's — Newtown", amount: -53.95 },
      { id: "txn_a1_7", date: "2026-10-25", description: "Bunnings Warehouse", amount: -118.2 },
      { id: "txn_a1_8", date: "2026-10-24", description: "Coles — Broadway", amount: -88.65 },
    ],
  },
  {
    id: "acc_alice_02",
    ownerId: "usr_alice",
    name: "Bonus Saver",
    bsb: "062-000",
    number: "1024 9907",
    balance: 28750.1,
    transactions: [
      { id: "txn_a2_1", date: "2026-10-31", description: "Interest paid", amount: 61.32 },
      { id: "txn_a2_2", date: "2026-10-27", description: "Transfer from Everyday Access", amount: 500.0 },
      { id: "txn_a2_3", date: "2026-09-30", description: "Interest paid", amount: 58.9 },
      { id: "txn_a2_4", date: "2026-09-27", description: "Transfer from Everyday Access", amount: 500.0 },
      { id: "txn_a2_5", date: "2026-09-15", description: "ATO tax refund", amount: 1840.0 },
      { id: "txn_a2_6", date: "2026-08-31", description: "Interest paid", amount: 55.14 },
      { id: "txn_a2_7", date: "2026-08-27", description: "Transfer from Everyday Access", amount: 500.0 },
      { id: "txn_a2_8", date: "2026-08-02", description: "Term deposit maturity", amount: 10000.0 },
    ],
  },
  {
    id: "acc_bob_01",
    ownerId: "usr_bob",
    name: "Everyday Access",
    bsb: "063-115",
    number: "2290 4471",
    balance: 1290.33,
    transactions: [
      { id: "txn_b1_1", date: "2026-10-31", description: "ALDI — Marrickville", amount: -73.49 },
      { id: "txn_b1_2", date: "2026-10-30", description: "Salary — Harbourline Logistics", amount: 2650.0 },
      { id: "txn_b1_3", date: "2026-10-29", description: "Origin Energy", amount: -142.6 },
      { id: "txn_b1_4", date: "2026-10-28", description: "JB Hi-Fi", amount: -299.0 },
      { id: "txn_b1_5", date: "2026-10-27", description: "Afterpay instalment", amount: -46.25 },
      { id: "txn_b1_6", date: "2026-10-26", description: "Uber Eats", amount: -38.9 },
      { id: "txn_b1_7", date: "2026-10-25", description: "Rent — Ray White", amount: -720.0 },
      { id: "txn_b1_8", date: "2026-10-24", description: "Kmart — Broadway", amount: -51.0 },
    ],
  },
];

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getAccountsByOwner(ownerId: string): Account[] {
  return accounts.filter((a) => a.ownerId === ownerId);
}

export function getAccountById(id: string): Account | undefined {
  return accounts.find((a) => a.id === id);
}
