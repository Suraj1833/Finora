import AppNavbar from "@/components/AppNavbar";
import BudgetProgress from "@/components/BudgetProgress";
import CategorySpendingChart from "@/components/CategorySpendingChart";
import TransactionList from "@/components/TransactionList";
import AlertCard from "@/components/AlertCard";
import AIInsightsCard from "@/components/AIInsightsCard";
import { useLocation } from "wouter";
import { getState, updateTransactionCategory } from "@/store";
import { updateMerchantCategory, type Category } from "@/categorize";
import { generateAIInsights } from "@/aiBudgetPlanner";
import { useState, useEffect } from "react";

const categoryColors: Record<string, string> = {
  Food: "#8b5cf6",
  Shopping: "#ec4899",
  Travel: "#3b82f6",
  Entertainment: "#10b981",
  Wallet: "#f59e0b",
  Other: "#64748b",
};

const categoryIcons: Record<string, "food" | "shopping" | "travel" | "entertainment" | "wallet" | "other"> = {
  Food: "food",
  Shopping: "shopping",
  Travel: "travel",
  Entertainment: "entertainment",
  Wallet: "wallet",
  Other: "other",
};

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `Today, ${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export default function FinanceDashboardPage() {
  const [, setLocation] = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);
  const state = getState();

  useEffect(() => {
    // Initial load - no action needed
  }, []);

  const { derived, transactions } = state;

  // Prepare category data for chart
  const categoryData = Array.from(derived.spendByCategory.entries()).map(([name, value]) => ({
    name,
    value,
    color: categoryColors[name] || categoryColors.Other,
  }));

  // Prepare recent transactions (latest 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
    .slice(0, 5)
    .map((tx) => ({
      id: tx.id,
      merchant: tx.merchant,
      category: tx.category,
      amount: tx.amount,
      date: formatRelativeDate(tx.dateISO),
      icon: categoryIcons[tx.category] || "other",
    }));

  // Check if nearing budget limit for any category
  const shoppingSpent = derived.spendByCategory.get("Shopping") || 0;
  const showShoppingAlert = shoppingSpent > 4000;

  const handleLogout = () => {
    console.log('Logging out...');
    setLocation("/");
  };

  const handleCategoryChange = (txId: string, newCategory: Category) => {
    // Find the transaction to get its merchant name
    const tx = transactions.find(t => t.id === txId);
    if (tx) {
      // Update the transaction category
      updateTransactionCategory(txId, newCategory);
      
      // Update the merchant mapping for future auto-categorization
      updateMerchantCategory(tx.merchant, newCategory);
      
      // Regenerate AI insights after category change
      generateAIInsights();
      
      // Force re-render by updating refresh key
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar userName="John Doe" onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your spending and stay on budget
          </p>
        </div>

        <BudgetProgress total={derived.monthlyBudget} spent={derived.totalSpentThisMonth} />

        <AIInsightsCard key={refreshKey} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategorySpendingChart data={categoryData} />
          <TransactionList 
            transactions={recentTransactions} 
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {showShoppingAlert && (
          <AlertCard 
            message="You are nearing your shopping budget limit."
            variant="warning"
          />
        )}

        {/* TODO: Upcoming features placeholders - Multi-Account Integration, Smart Expense Categorization, AI Budget Planner, Predictive Alerts & Smart Nudges, AI Chat Assistant, Insight Dashboard, Data Security & Privacy */}
      </div>
    </div>
  );
}
