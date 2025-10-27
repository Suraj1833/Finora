import { useState } from "react";
import { useLocation } from "wouter";
import AppNavbar from "@/components/AppNavbar";
import DashboardHeader from "@/components/DashboardHeader";
import AccountSummaryCard from "@/components/AccountSummaryCard";
import EmptyState from "@/components/EmptyState";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const mockAccounts = [
    {
      type: "bank" as const,
      name: "HDFC Bank",
      accountNumber: "****4532",
      balance: 125430.50,
      trend: "up" as const,
      trendAmount: 2340.00,
      lastUpdated: "2 hours ago",
    },
    {
      type: "upi" as const,
      name: "Google Pay",
      accountNumber: "user@okaxis",
      balance: 5678.25,
      trend: "down" as const,
      trendAmount: 123.50,
      lastUpdated: "1 hour ago",
    },
    {
      type: "wallet" as const,
      name: "Paytm Wallet",
      accountNumber: "9876543210",
      balance: 890.00,
      lastUpdated: "30 mins ago",
    },
  ];

  const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log('Refreshing accounts...');
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Accounts refreshed');
    }, 2000);
  };

  const handleAddAccount = () => {
    setLocation("/connect");
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar userName="John Doe" onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader
          totalBalance={totalBalance}
          onAddAccount={handleAddAccount}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <div className="mt-8">
          {mockAccounts.length === 0 ? (
            <EmptyState
              title="No accounts connected"
              description="Connect your first account to start tracking your finances automatically"
              actionLabel="Connect Account"
              onAction={handleAddAccount}
            />
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6">Your Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAccounts.map((account) => (
                  <AccountSummaryCard
                    key={account.accountNumber}
                    {...account}
                    onClick={() => console.log(`View details for ${account.name}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
