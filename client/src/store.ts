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

export interface UserOnboardingState {
  isFirstTime: boolean;
  hasConnectedAccounts: boolean;
  hasSetBudget: boolean;
}

interface AppState {
  isAuthenticated: boolean;
  accounts: Account[];
  transactions: Transaction[];
  derived: DerivedState;
  user: UserOnboardingState;
}

const STORAGE_KEY = "autotrack_state";

// Counter for ensuring unique IDs
let idCounter = 0;

const DEMO_ACCOUNTS: Account[] = [
  { id: "acc1", type: "bank", name: "HDFC Savings", balance: 45230 },
  { id: "acc2", type: "upi", name: "Google Pay", balance: 3420 },
  { id: "acc3", type: "wallet", name: "Paytm Wallet", balance: 1250 },
  { id: "acc4", type: "card", name: "ICICI Credit Card", balance: 12800 },
];

type DemoTransactionTemplate = Omit<Transaction, "id" | "dateISO"> & { daysAgo: number };

const DEMO_TRANSACTION_TEMPLATES: DemoTransactionTemplate[] = [
  { accountId: "acc2", merchant: "Swiggy", amount: 450, daysAgo: 3, category: "Food" },
  { accountId: "acc2", merchant: "Uber", amount: 230, daysAgo: 3, category: "Travel" },
  { accountId: "acc4", merchant: "Amazon", amount: 2499, daysAgo: 4, category: "Shopping" },
  { accountId: "acc2", merchant: "Zomato", amount: 680, daysAgo: 4, category: "Food" },
  { accountId: "acc4", merchant: "BookMyShow", amount: 600, daysAgo: 5, category: "Entertainment" },
  { accountId: "acc1", merchant: "Swiggy", amount: 520, daysAgo: 6, category: "Food" },
  { accountId: "acc3", merchant: "Uber", amount: 180, daysAgo: 6, category: "Travel" },
  { accountId: "acc4", merchant: "Flipkart", amount: 1899, daysAgo: 7, category: "Shopping" },
  { accountId: "acc2", merchant: "Starbucks", amount: 350, daysAgo: 7, category: "Food" },
  { accountId: "acc4", merchant: "Netflix", amount: 649, daysAgo: 8, category: "Entertainment" },
  { accountId: "acc1", merchant: "Zomato", amount: 890, daysAgo: 9, category: "Food" },
  { accountId: "acc2", merchant: "Ola", amount: 145, daysAgo: 9, category: "Travel" },
  { accountId: "acc4", merchant: "Amazon", amount: 3200, daysAgo: 10, category: "Shopping" },
  { accountId: "acc3", merchant: "Swiggy", amount: 620, daysAgo: 11, category: "Food" },
  { accountId: "acc2", merchant: "BookMyShow", amount: 450, daysAgo: 12, category: "Entertainment" },
  { accountId: "acc1", merchant: "BigBasket", amount: 1850, daysAgo: 13, category: "Shopping" },
  { accountId: "acc2", merchant: "Spotify", amount: 119, daysAgo: 15, category: "Entertainment" },
  { accountId: "acc4", merchant: "Zomato", amount: 750, daysAgo: 16, category: "Food" },
];

function daysAgoISO(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function createDemoTransactions(): Transaction[] {
  return DEMO_TRANSACTION_TEMPLATES.map((template, index) => {
    const { daysAgo, ...rest } = template;
    return {
      ...rest,
      id: `tx${index + 1}`,
      dateISO: daysAgoISO(daysAgo),
    };
  });
}

function migrateStaleTransactionDates(transactions: Transaction[]): Transaction[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const hasCurrentMonthTx = transactions.some((tx) => {
    const txDate = new Date(tx.dateISO);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  if (hasCurrentMonthTx) {
    return transactions;
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );
  const daysAgoById = new Map(sorted.map((tx, index) => [tx.id, index]));

  return transactions.map((tx) => ({
    ...tx,
    dateISO: daysAgoISO(daysAgoById.get(tx.id) ?? 0),
  }));
}

function seedDemoDataIfEmpty() {
  if (currentState.accounts.length === 0) {
    currentState.accounts = [...DEMO_ACCOUNTS];
  }
  if (currentState.transactions.length === 0) {
    currentState.transactions = createDemoTransactions();
  }
}

// Store subscribers - notify when state changes
type Subscriber = () => void;
const subscribers: Set<Subscriber> = new Set();

export function subscribe(callback: Subscriber): () => void {
  subscribers.add(callback);
  // Return unsubscribe function
  return () => {
    subscribers.delete(callback);
  };
}

function notifySubscribers() {
  subscribers.forEach(callback => callback());
}

// Initialize with mock data
const initialState: AppState = {
  isAuthenticated: false,
  accounts: [...DEMO_ACCOUNTS],
  transactions: createDemoTransactions(),
  derived: {
    totalSpentThisMonth: 0,
    spendByCategory: new Map(),
    monthlyBudget: 40000,
    spentPercent: 0,
    upcomingRecurring: [],
  },
  user: {
    isFirstTime: false,
    hasConnectedAccounts: true,
    hasSetBudget: true,
  },
};

// Load state from localStorage or use initial state
let currentState: AppState = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert spendByCategory back to Map
      if (parsed.derived) {
        parsed.derived.spendByCategory = new Map(Object.entries(parsed.derived.spendByCategory || {}));
      }
      if (parsed.transactions?.length > 0) {
        parsed.transactions = migrateStaleTransactionDates(parsed.transactions);
      } else if (parsed.user?.hasConnectedAccounts) {
        parsed.transactions = createDemoTransactions();
        if (!parsed.accounts?.length) {
          parsed.accounts = [...DEMO_ACCOUNTS];
        }
      }
      // Merge with initialState to ensure all required properties exist
      return {
        ...initialState,
        ...parsed,
        derived: {
          ...initialState.derived,
          ...(parsed.derived || {}),
          spendByCategory: parsed.derived?.spendByCategory || new Map(),
        },
        user: {
          ...initialState.user,
          ...(parsed.user || {}),
        },
      };
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

// Reset state to logged out (empty) state
export function resetState() {
  const emptyState: AppState = {
    isAuthenticated: false,
    accounts: [],
    transactions: [],
    derived: {
      totalSpentThisMonth: 0,
      spendByCategory: new Map(),
      monthlyBudget: 0,
      spentPercent: 0,
      upcomingRecurring: [],
    },
    user: {
      isFirstTime: true,
      hasConnectedAccounts: false,
      hasSetBudget: false,
    },
  };
  currentState = emptyState;
  
  // Persist empty state to localStorage to prevent reload from restoring mock data
  try {
    const stateToSave = {
      ...emptyState,
      derived: {
        ...emptyState.derived,
        spendByCategory: Object.fromEntries(emptyState.derived.spendByCategory),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error("Failed to persist logged out state:", error);
  }
  
  localStorage.removeItem('chatHistory');
  notifySubscribers();
}

// Add a new account
export function addAccount(account: Omit<Account, "id">): Account {
  const newAccount: Account = {
    ...account,
    id: `acc${Date.now()}_${idCounter++}`,
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
    id: `tx${Date.now()}_${idCounter++}`,
    category: tx.category || categorize(tx.merchant),
  };
  currentState.transactions.push(newTx);
  persistState();
  recalcDerived();
  notifySubscribers();
  return newTx;
}

// Update transaction category
export function updateTransactionCategory(txId: string, category: Category): boolean {
  const tx = currentState.transactions.find(t => t.id === txId);
  if (tx) {
    tx.category = category;
    persistState();
    recalcDerived();
    notifySubscribers();
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

  // Keep existing monthly budget (don't overwrite with hardcoded value)
  const monthlyBudget = currentState.derived.monthlyBudget;

  // Spent percentage
  const spentPercent = monthlyBudget > 0 ? (totalSpentThisMonth / monthlyBudget) * 100 : 0;

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

// User onboarding functions
export function updateUserOnboarding(updates: Partial<UserOnboardingState>) {
  currentState.user = { ...currentState.user, ...updates };
  persistState();
  notifySubscribers();
}

// Session management functions for strict onboarding flow
export function startSessionOnAuth() {
  currentState.isAuthenticated = true;
  currentState.user = {
    isFirstTime: true,
    hasConnectedAccounts: false,
    hasSetBudget: false,
  };
  persistState();
  notifySubscribers();
}

export function completeAccounts() {
  if (!currentState.user) return;
  seedDemoDataIfEmpty();
  currentState.user.hasConnectedAccounts = true;
  persistState();
  recalcDerived();
  notifySubscribers();
}

export function completeBudget() {
  if (!currentState.user) return;
  seedDemoDataIfEmpty();
  currentState.user.hasSetBudget = true;
  currentState.user.isFirstTime = false;
  persistState();
  recalcDerived();
  notifySubscribers();
}

export function resetSession() {
  resetState();
}

export function setMonthlyBudget(budget: number) {
  currentState.derived.monthlyBudget = budget;
  persistState();
  recalcDerived();
  notifySubscribers();
}

export function completeOnboarding() {
  currentState.user = {
    isFirstTime: false,
    hasConnectedAccounts: true,
    hasSetBudget: true,
  };
  persistState();
  notifySubscribers();
}

// Initialize derived state on load
recalcDerived();
