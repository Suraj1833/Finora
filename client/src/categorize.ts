// Smart merchant categorization with localStorage persistence

export type Category = "Food" | "Travel" | "Shopping" | "Entertainment" | "Wallet" | "Other";

export const CATEGORIES: Category[] = ["Food", "Travel", "Shopping", "Entertainment", "Wallet", "Other"];

interface MerchantMapping {
  [merchant: string]: Category;
}

const STORAGE_KEY = "autotrack_merchant_categories";

// Default merchant categorization rules
const defaultMerchantMapping: MerchantMapping = {
  // Food
  "Swiggy": "Food",
  "Zomato": "Food",
  "Starbucks": "Food",
  "Dunkin": "Food",
  "McDonald's": "Food",
  "Domino's": "Food",
  "KFC": "Food",
  "Subway": "Food",
  
  // Travel
  "Uber": "Travel",
  "Ola": "Travel",
  "Rapido": "Travel",
  "Bounce": "Travel",
  "MakeMyTrip": "Travel",
  "Goibibo": "Travel",
  
  // Shopping
  "Amazon": "Shopping",
  "Flipkart": "Shopping",
  "Myntra": "Shopping",
  "Ajio": "Shopping",
  "BigBasket": "Shopping",
  "Grofers": "Shopping",
  "Blinkit": "Shopping",
  "Nykaa": "Shopping",
  
  // Entertainment
  "BookMyShow": "Entertainment",
  "Netflix": "Entertainment",
  "Prime Video": "Entertainment",
  "Spotify": "Entertainment",
  "YouTube": "Entertainment",
  "Hotstar": "Entertainment",
  "Zee5": "Entertainment",
  
  // Wallet
  "Paytm": "Wallet",
  "PhonePe": "Wallet",
  "GooglePay": "Wallet",
  "Mobikwik": "Wallet",
};

// Load merchant mapping from localStorage
let merchantMapping: MerchantMapping = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load merchant mapping from localStorage:", error);
  }
  return { ...defaultMerchantMapping };
})();

// Persist merchant mapping to localStorage
function persistMapping() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merchantMapping));
  } catch (error) {
    console.error("Failed to persist merchant mapping:", error);
  }
}

// Get category for a merchant (with fuzzy matching)
export function categorize(merchant: string): Category {
  // Exact match (case-insensitive)
  const normalizedMerchant = merchant.trim();
  const exactMatch = Object.keys(merchantMapping).find(
    key => key.toLowerCase() === normalizedMerchant.toLowerCase()
  );
  
  if (exactMatch) {
    return merchantMapping[exactMatch];
  }
  
  // Partial match (if merchant contains a known merchant name)
  const partialMatch = Object.keys(merchantMapping).find(
    key => normalizedMerchant.toLowerCase().includes(key.toLowerCase())
  );
  
  if (partialMatch) {
    return merchantMapping[partialMatch];
  }
  
  // Default to "Other"
  return "Other";
}

// Update category for a specific merchant
export function updateMerchantCategory(merchant: string, category: Category) {
  merchantMapping[merchant.trim()] = category;
  persistMapping();
}

// Get all merchant mappings
export function getAllMappings(): MerchantMapping {
  return { ...merchantMapping };
}

// Reset to defaults
export function resetToDefaults() {
  merchantMapping = { ...defaultMerchantMapping };
  persistMapping();
}

// Get merchant mapping for a specific merchant
export function getMerchantCategory(merchant: string): Category | undefined {
  return merchantMapping[merchant.trim()];
}
