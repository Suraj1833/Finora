import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Smartphone, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type AccountType = "bank" | "upi" | "wallet";

export interface AccountSummaryCardProps {
  type: AccountType;
  name: string;
  accountNumber: string;
  balance: number;
  currency?: string;
  trend?: "up" | "down";
  trendAmount?: number;
  lastUpdated?: string;
  onClick?: () => void;
}

const iconMap: Record<AccountType, LucideIcon> = {
  bank: Building2,
  upi: Smartphone,
  wallet: Wallet,
};

const typeLabels: Record<AccountType, string> = {
  bank: "Bank",
  upi: "UPI",
  wallet: "Wallet",
};

export default function AccountSummaryCard({
  type,
  name,
  accountNumber,
  balance,
  currency = "₹",
  trend,
  trendAmount,
  lastUpdated,
  onClick,
}: AccountSummaryCardProps) {
  const Icon = iconMap[type];
  
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card 
      className="hover-elevate cursor-pointer" 
      onClick={onClick}
      data-testid={`card-account-${accountNumber}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <Badge variant="secondary" className="gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          {typeLabels[type]}
        </Badge>
        {trend && trendAmount && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span className="font-mono text-xs">{formatBalance(trendAmount)}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg" data-testid={`text-account-name-${accountNumber}`}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground font-mono">
            {accountNumber}
          </p>
        </div>
        <div>
          <p className="text-3xl font-bold font-mono" data-testid={`text-balance-${accountNumber}`}>
            {currency}{formatBalance(balance)}
          </p>
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Updated {lastUpdated}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
