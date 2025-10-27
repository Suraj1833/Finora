import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AccountConnectionCard from "@/components/AccountConnectionCard";
import AppNavbar from "@/components/AppNavbar";
import { ArrowRight } from "lucide-react";
import { updateUserOnboarding } from "@/store";

export default function ConnectAccountsPage() {
  const [, setLocation] = useLocation();
  const [connectedAccounts, setConnectedAccounts] = useState<{
    bank: boolean;
    upi: boolean;
    wallet: boolean;
    "credit-card": boolean;
  }>({
    bank: false,
    upi: false,
    wallet: false,
    "credit-card": false,
  });

  const handleConnect = (type: "bank" | "upi" | "wallet" | "credit-card") => {
    console.log(`Connecting ${type}`);
    setConnectedAccounts(prev => ({
      ...prev,
      [type]: true,
    }));
  };

  const hasAnyConnection = Object.values(connectedAccounts).some(Boolean);

  const handleContinue = () => {
    // Mark accounts as connected in onboarding state
    updateUserOnboarding({ hasConnectedAccounts: true });
    
    // Navigate to setup budget or dashboard
    setLocation("/setup-budget");
  };

  const handleSkip = () => {
    // User skipped account connection
    updateUserOnboarding({ hasConnectedAccounts: false });
    setLocation("/setup-budget");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar userName="John Doe" />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">
            Connect Your Accounts
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Link your financial accounts to get started. You can add more accounts anytime from your dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AccountConnectionCard
            type="bank"
            title="Bank Account"
            description="Connect your bank for automatic transaction tracking"
            connected={connectedAccounts.bank}
            onConnect={() => handleConnect("bank")}
          />
          <AccountConnectionCard
            type="upi"
            title="UPI"
            description="Link your UPI ID for payment tracking"
            connected={connectedAccounts.upi}
            onConnect={() => handleConnect("upi")}
          />
          <AccountConnectionCard
            type="wallet"
            title="Digital Wallet"
            description="Sync wallet balance and transactions"
            connected={connectedAccounts.wallet}
            onConnect={() => handleConnect("wallet")}
          />
          <AccountConnectionCard
            type="credit-card"
            title="Credit Card"
            description="Track credit card spending and payments"
            connected={connectedAccounts["credit-card"]}
            onConnect={() => handleConnect("credit-card")}
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleSkip}
            data-testid="button-skip"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!hasAnyConnection}
            className="gap-2"
            data-testid="button-continue"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
