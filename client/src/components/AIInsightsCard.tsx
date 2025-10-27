import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { recalcAIInsights, type AIBudgetInsights } from "@/aiBudgetPlanner";
import { subscribe } from "@/store";

export default function AIInsightsCard() {
  const [insights, setInsights] = useState<AIBudgetInsights | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Always fetch fresh insights on mount
    const freshInsights = recalcAIInsights();
    setInsights(freshInsights);
    
    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Subscribe to store changes
    const unsubscribe = subscribe(() => {
      // Recalculate insights when transactions/categories change
      const updatedInsights = recalcAIInsights();
      setInsights(updatedInsights);
    });
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  if (!insights) {
    return null;
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const topOverspending = insights.overspendingCategories[0];
  const hasSavings = insights.projectedSavings > 0;

  return (
    <Card 
      className={`border-primary/20 bg-primary/5 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      data-testid="card-ai-insights"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg">AI Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <p className="text-sm" data-testid="text-suggested-budget">
            <span className="font-semibold">Suggested Budget:</span>{" "}
            <span className="font-mono">₹{formatAmount(insights.suggestedTotalBudget)}</span>
            <span className="text-muted-foreground"> (based on past spending)</span>
          </p>
          
          {topOverspending && (
            <p className="text-sm text-destructive" data-testid="text-overspending-warning">
              <span className="font-semibold">Warning:</span> You're likely to overspend{" "}
              <span className="font-mono">₹{formatAmount(topOverspending.amount)}</span> in{" "}
              <span className="font-semibold">{topOverspending.category}</span>.
            </p>
          )}
          
          {hasSavings ? (
            <p className="text-sm text-green-600 dark:text-green-400" data-testid="text-projected-savings">
              <span className="font-semibold">Projected Savings:</span>{" "}
              <span className="font-mono">₹{formatAmount(insights.projectedSavings)}</span>
            </p>
          ) : (
            <p className="text-sm text-destructive" data-testid="text-projected-deficit">
              <span className="font-semibold">Projected Deficit:</span>{" "}
              <span className="font-mono">₹{formatAmount(Math.abs(insights.projectedSavings))}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
