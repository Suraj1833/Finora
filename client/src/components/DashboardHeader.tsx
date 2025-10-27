import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  totalBalance: number;
  currency?: string;
  onAddAccount?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function DashboardHeader({
  totalBalance,
  currency = "₹",
  onAddAccount,
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Dashboard</h1>
          <p className="text-muted-foreground">Track all your financial accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="default"
            onClick={onRefresh}
            disabled={isRefreshing}
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={onAddAccount}
            data-testid="button-add-account"
          >
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-card-border p-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
        <p className="text-5xl font-bold font-mono" data-testid="text-total-balance">
          {currency}{formatBalance(totalBalance)}
        </p>
        <p className="text-sm text-muted-foreground mt-2">Across all accounts</p>
      </div>
    </div>
  );
}
