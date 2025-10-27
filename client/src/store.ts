// Client-side state store with localStorage persistence
import { categorize, type Category } from "./categorize";

export interface Account {
  id: string;
  type: "bank" | "upi" | "wallet" | "card" | "crypto";
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  merchant: string;
  amount: number;
  dateISO: string;
  category: Category;
  notes?: string;
}

export interface DerivedState {
  totalSpentThisMonth: number;
  spendByCategory: Map<string, number>;
  monthlyBudget: number;
  spentPercent: number;
  upcomingRecurring: Array<{ merchant: string; avgAmount: number; lastDate: string }>;
}

interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  derived: DerivedState;
}

const STORAGE_KEY = "autotrack_state";

// Initialize with mock data
const initialState: AppState = {
  accounts: [
    { id: "acc1", type: "bank", name: "HDFC Savings", balance: 45230 },
    { id: "acc2", type: "upi", name: "Google Pay", balance: 3420 },
    { id: "acc3", type: "wallet", name: "Paytm Wallet", balance: 1250 },
    { id: "acc4", type: "card", name: "ICICI Credit Card", balance: 12800 },
  ],
  transactions: [
    { id: "tx1", accountId: "acc2", merchant: "Swiggy", amount: 450, dateISO: "2025-10-27T14:30:00Z", category: "Food" },
    { id: "tx2", accountId: "acc2", merchant: "Uber", amount: 230, dateISO: "2025-10-27T11:00:00Z", category: "Travel" },
    { id: "tx3", accountId: "acc4", merchant: "Amazon", amount: 2499, dateISO: "2025-10-26T16:20:00Z", category: "Shopping" },
    { id: "tx4", accountId: "acc2", merchant: "Zomato", amount: 680, dateISO: "2025-10-26T20:15:00Z", category: "Food" },
    { id: "tx5", accountId: "acc4", merchant: "BookMyShow", amount: 600, dateISO: "2025-10-25T19:00:00Z", category: "Entertainment" },
    { id: "tx6", accountId: "acc1", merchant: "Swiggy", amount: 520, dateISO: "2025-10-24T13:45:00Z", category: "Food" },
    { id: "tx7", accountId: "acc3", merchant: "Uber", amount: 180, dateISO: "2025-10-24T09:30:00Z", category: "Travel" },
    { id: "tx8", accountId: "acc4", merchant: "Flipkart", amount: 1899, dateISO: "2025-10-23T15:10:00Z", category: "Shopping" },
    { id: "tx9", accountId: "acc2", merchant: "Starbucks", amount: 350, dateISO: "2025-10-23T11:00:00Z", category: "Food" },
    { id: "tx10", accountId: "acc4", merchant: "Netflix", amount: 649, dateISO: "2025-10-22T00:00:00Z", category: "Entertainment" },
    { id: "tx11", accountId: "acc1", merchant: "Zomato", amount: 890, dateISO: "2025-10-21T20:30:00Z", category: "Food" },
    { id: "tx12", accountId: "acc2", merchant: "Ola", amount: 145, dateISO: "2025-10-21T08:15:00Z", category: "Travel" },
    { id: "tx13", accountId: "acc4", merchant: "Amazon", amount: 3200, dateISO: "2025-10-20T14:00:00Z", category: "Shopping" },
    { id: "tx14", accountId: "acc3", merchant: "Swiggy", amount: 620, dateISO: "2025-10-19T19:45:00Z", category: "Food" },
    { id: "tx15", accountId: "acc2", merchant: "BookMyShow", amount: 450, dateISO: "2025-10-18T18:30:00Z", category: "Entertainment" },
    { id: "tx16", accountId: "acc1", merchant: "BigBasket", amount: 1850, dateISO: "2025-10-17T10:00:00Z", category: "Shopping" },
    { id: "tx17", accountId: "acc2", merchant: "Spotify", amount: 119, dateISO: "2025-10-15T00:00:00Z", category: "Entertainment" },
    { id: "tx18", accountId: "acc4", merchant: "Zomato", amount: 750, dateISO: "2025-10-14T21:00:00Z", category: "Food" },
  ],
  derived: {
    totalSpentThisMonth: 0,
    spendByCategory: new Map(),
    monthlyBudget: 40000,
    spentPercent: 0,
    upcomingRecurring: [],
  },
};

// Load state from localStorage or use initial state
let currentState: AppState = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert spendByCategory back to Map
      parsed.derived.spendByCategory = new Map(Object.entries(parsed.derived.spendByCategory || {}));
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to load state from localStorage:", error);
  }
  return initialState;
})();

// Persist state to localStorage
function persistState() {
  try {
    // Convert Map to object for JSON serialization
    const stateToSave = {
      ...currentState,
      derived: {
        ...currentState.derived,
        spendByCategory: Object.fromEntries(currentState.derived.spendByCategory),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error("Failed to persist state:", error);
  }
}

// Get current state
export function getState(): AppState {
  return currentState;
}

// Update state with a patch
export function setState(patch: Partial<AppState>) {
  currentState = { ...currentState, ...patch };
  persistState();
}

// Add a new account
export function addAccount(account: Omit<Account, "id">): Account {
  const newAccount: Account = {
    ...account,
    id: `acc${Date.now()}`,
  };
  currentState.accounts.push(newAccount);
  persistState();
  return newAccount;
}

// Remove an account
export function removeAccount(id: string): boolean {
  const initialLength = currentState.accounts.length;
  currentState.accounts = currentState.accounts.filter((acc) => acc.id !== id);
  const removed = currentState.accounts.length < initialLength;
  if (removed) {
    persistState();
  }
  return removed;
}

// Add a new transaction
export function addTx(tx: Omit<Transaction, "id" | "category"> & { category?: Category }): Transaction {
  const newTx: Transaction = {
    ...tx,
    id: `tx${Date.now()}`,
    category: tx.category || categorize(tx.merchant),
  };
  currentState.transactions.push(newTx);
  persistState();
  recalcDerived();
  return newTx;
}

// Update transaction category
export function updateTransactionCategory(txId: string, category: Category): boolean {
  const tx = currentState.transactions.find(t => t.id === txId);
  if (tx) {
    tx.category = category;
    persistState();
    recalcDerived();
    return true;
  }
  return false;
}

// Recalculate derived state
export function recalcDerived() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter transactions for current month
  const thisMonthTxs = currentState.transactions.filter((tx) => {
    const txDate = new Date(tx.dateISO);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  // Calculate total spent this month
  const totalSpentThisMonth = thisMonthTxs.reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate spend by category
  const spendByCategory = new Map<string, number>();
  thisMonthTxs.forEach((tx) => {
    const current = spendByCategory.get(tx.category) || 0;
    spendByCategory.set(tx.category, current + tx.amount);
  });

  // Monthly budget
  const monthlyBudget = 40000;

  // Spent percentage
  const spentPercent = (totalSpentThisMonth / monthlyBudget) * 100;

  // Detect recurring transactions (merchants appearing multiple times)
  const merchantFrequency = new Map<string, Transaction[]>();
  currentState.transactions.forEach((tx) => {
    const txs = merchantFrequency.get(tx.merchant) || [];
    txs.push(tx);
    merchantFrequency.set(tx.merchant, txs);
  });

  const upcomingRecurring: Array<{ merchant: string; avgAmount: number; lastDate: string }> = [];
  merchantFrequency.forEach((txs, merchant) => {
    if (txs.length >= 2) {
      // Appears at least twice, consider it recurring
      const avgAmount = txs.reduce((sum, tx) => sum + tx.amount, 0) / txs.length;
      const lastDate = txs.sort((a, b) => 
        new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
      )[0].dateISO;
      
      upcomingRecurring.push({ merchant, avgAmount, lastDate });
    }
  });

  // Sort by last date (most recent first)
  upcomingRecurring.sort((a, b) => 
    new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime()
  );

  currentState.derived = {
    totalSpentThisMonth,
    spendByCategory,
    monthlyBudget,
    spentPercent,
    upcomingRecurring,
  };

  persistState();
}

// Initialize derived state on load
recalcDerived();
