import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Utensils, Car, Film, MoreHorizontal } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  icon?: "food" | "shopping" | "travel" | "entertainment" | "other";
}

interface TransactionListProps {
  transactions: Transaction[];
  currency?: string;
}

const iconMap: Record<string, LucideIcon> = {
  food: Utensils,
  shopping: ShoppingBag,
  travel: Car,
  entertainment: Film,
  other: MoreHorizontal,
};

const categoryColors: Record<string, string> = {
  Food: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Shopping: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  Travel: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Entertainment: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
};

export default function TransactionList({ transactions, currency = "₹" }: TransactionListProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const Icon = iconMap[transaction.icon || "other"];
            return (
              <div 
                key={transaction.id}
                className="flex items-center gap-3 p-3 rounded-lg hover-elevate"
                data-testid={`transaction-${transaction.id}`}
              >
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" data-testid={`text-merchant-${transaction.id}`}>
                    {transaction.merchant}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${categoryColors[transaction.category] || categoryColors.Other}`}
                    >
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
                <p className="font-semibold font-mono text-destructive" data-testid={`text-amount-${transaction.id}`}>
                  -{currency}{formatAmount(transaction.amount)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
