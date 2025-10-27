import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetProgressProps {
  total: number;
  spent: number;
  currency?: string;
}

export default function BudgetProgress({ total, spent, currency = "₹" }: BudgetProgressProps) {
  const percentage = (spent / total) * 100;
  const remaining = total - spent;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Monthly Budget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline">
          <div>
            <p className="text-3xl font-bold font-mono" data-testid="text-spent-amount">
              {currency}{formatAmount(spent)}
            </p>
            <p className="text-sm text-muted-foreground">of {currency}{formatAmount(total)}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold font-mono text-muted-foreground">
              {currency}{formatAmount(remaining)}
            </p>
            <p className="text-xs text-muted-foreground">remaining</p>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={percentage} className="h-3" data-testid="progress-budget" />
          <p className="text-xs text-muted-foreground text-right">
            {percentage.toFixed(1)}% used
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
