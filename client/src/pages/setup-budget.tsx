import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee } from "lucide-react";
import { setMonthlyBudget, updateUserOnboarding } from "@/store";

export default function SetupBudgetPage() {
  const [, setLocation] = useLocation();
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetAmount = parseFloat(budget);
    
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    // Update budget and mark as set
    setMonthlyBudget(budgetAmount);
    updateUserOnboarding({ hasSetBudget: true, isFirstTime: false });
    
    // Navigate to dashboard
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md" data-testid="card-setup-budget">
        <CardHeader>
          <CardTitle className="text-2xl" data-testid="heading-setup-budget">
            Set Your Monthly Budget
          </CardTitle>
          <CardDescription>
            Choose a comfortable monthly spending limit to help track your finances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="40000"
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    setError("");
                  }}
                  className="pl-9"
                  data-testid="input-budget"
                  min="0"
                  step="1"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-destructive" data-testid="text-error">
                  {error}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                We'll use this to help you stay on track with your spending
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              data-testid="button-continue-dashboard"
            >
              Continue to Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
