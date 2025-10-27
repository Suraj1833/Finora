// AI Budget Planner - Analyzes spending patterns and provides intelligent budget recommendations

import { getState } from "./store";
import type { Transaction } from "./store";
import type { Category } from "./categorize";

export interface AIBudgetInsights {
  suggestedTotalBudget: number;
  categoryBudgets: Record<Category, number>;
  categoryAverages: Record<Category, number>;
  projectedSpend: Record<Category, number>;
  totalProjectedSpend: number;
  projectedSavings: number;
  overspendingCategories: Array<{
    category: Category;
    amount: number;
    percentage: number;
  }>;
  lastUpdated: string;
}

const STORAGE_KEY = "autotrack_ai_insights";

// Calculate days elapsed in current month
function getDaysElapsedInMonth(): number {
  const now = new Date();
  return now.getDate();
}

// Calculate total days in current month
function getDaysInMonth(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

// Get transactions from last 30 days
function getLast30DaysTransactions(transactions: Transaction[]): Transaction[] {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return transactions.filter(tx => {
    const txDate = new Date(tx.dateISO);
    return txDate >= thirtyDaysAgo;
  });
}

// Calculate average spending per category for last 30 days
function calculateCategoryAverages(transactions: Transaction[]): Record<Category, number> {
  const last30Days = getLast30DaysTransactions(transactions);
  const categoryTotals: Partial<Record<Category, number>> = {};
  
  last30Days.forEach(tx => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });
  
  // Convert to daily average, then to monthly (30 days)
  const averages: Partial<Record<Category, number>> = {};
  Object.entries(categoryTotals).forEach(([category, total]) => {
    averages[category as Category] = (total / 30) * 30; // 30-day average
  });
  
  return averages as Record<Category, number>;
}

// Predict month-end spend based on current pace
function predictMonthEndSpend(transactions: Transaction[]): Record<Category, number> {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Get transactions for current month
  const currentMonthTxs = transactions.filter(tx => {
    const txDate = new Date(tx.dateISO);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });
  
  const categoryTotals: Partial<Record<Category, number>> = {};
  currentMonthTxs.forEach(tx => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });
  
  const daysElapsed = getDaysElapsedInMonth();
  const daysInMonth = getDaysInMonth();
  const daysRemaining = daysInMonth - daysElapsed;
  
  // Project based on current pace
  const projected: Partial<Record<Category, number>> = {};
  Object.entries(categoryTotals).forEach(([category, total]) => {
    const dailyAverage = total / daysElapsed;
    const projectedTotal = total + (dailyAverage * daysRemaining);
    projected[category as Category] = projectedTotal;
  });
  
  return projected as Record<Category, number>;
}

// Calculate suggested budgets (20% above average spend)
function calculateSuggestedBudgets(averages: Record<Category, number>): Record<Category, number> {
  const suggested: Partial<Record<Category, number>> = {};
  
  Object.entries(averages).forEach(([category, average]) => {
    // 20% buffer above average
    suggested[category as Category] = Math.round(average * 1.2);
  });
  
  return suggested as Record<Category, number>;
}

// Identify overspending categories
function identifyOverspending(
  projected: Record<Category, number>,
  budgets: Record<Category, number>
): Array<{ category: Category; amount: number; percentage: number }> {
  const overspending: Array<{ category: Category; amount: number; percentage: number }> = [];
  
  Object.entries(projected).forEach(([category, projectedAmount]) => {
    const budget = budgets[category as Category] || 0;
    if (projectedAmount > budget) {
      const overAmount = projectedAmount - budget;
      const percentage = ((overAmount / budget) * 100);
      overspending.push({
        category: category as Category,
        amount: overAmount,
        percentage,
      });
    }
  });
  
  // Sort by amount descending
  overspending.sort((a, b) => b.amount - a.amount);
  
  return overspending;
}

// Main function to recalculate AI insights with fresh data
export function recalcAIInsights(): AIBudgetInsights {
  // Always fetch fresh data from store
  const { transactions, derived } = getState();
  
  console.log('AI Insights updated');
  
  // Calculate metrics using fresh transaction data
  const categoryAverages = calculateCategoryAverages(transactions);
  const categoryBudgets = calculateSuggestedBudgets(categoryAverages);
  const projectedSpend = predictMonthEndSpend(transactions);
  
  // Calculate totals
  const suggestedTotalBudget = Object.values(categoryBudgets).reduce((sum, val) => sum + (val || 0), 0);
  const totalProjectedSpend = Object.values(projectedSpend).reduce((sum, val) => sum + (val || 0), 0);
  const projectedSavings = suggestedTotalBudget - totalProjectedSpend;
  
  // Identify overspending
  const overspendingCategories = identifyOverspending(projectedSpend, categoryBudgets);
  
  const insights: AIBudgetInsights = {
    suggestedTotalBudget: Math.round(suggestedTotalBudget),
    categoryBudgets,
    categoryAverages,
    projectedSpend,
    totalProjectedSpend: Math.round(totalProjectedSpend),
    projectedSavings: Math.round(projectedSavings),
    overspendingCategories,
    lastUpdated: new Date().toISOString(),
  };
  
  // Save to localStorage after calculation
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(insights));
  } catch (error) {
    console.error("Failed to save AI insights:", error);
  }
  
  return insights;
}

// Get AI insights - always recalculates with fresh data
export function getAIInsights(): AIBudgetInsights {
  return recalcAIInsights();
}
