import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smartphone, Mail } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import {
  updateUserOnboarding,
  addAccount,
  addTx,
  setMonthlyBudget,
  getState,
} from "@/store";

export default function LoginPage() {
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    // Restore user state
    updateUserOnboarding({
      isFirstTime: true,
      hasConnectedAccounts: true,
      hasSetBudget: true,
    });

    // Only restore sample data if accounts are empty (prevent duplicates on subsequent logins)
    const state = getState();
    if (state.accounts.length === 0) {
      // Restore sample accounts and capture their IDs
      const bankAccount = addAccount({
        type: "bank",
        name: "HDFC Savings",
        balance: 45230,
      });
      const upiAccount = addAccount({
        type: "upi",
        name: "Google Pay",
        balance: 3420,
      });
      const walletAccount = addAccount({
        type: "wallet",
        name: "Paytm Wallet",
        balance: 1250,
      });
      const cardAccount = addAccount({
        type: "card",
        name: "ICICI Credit Card",
        balance: 12800,
      });

      // Restore sample transactions using actual account IDs
      addTx({
        accountId: upiAccount.id,
        merchant: "Swiggy",
        amount: 450,
        dateISO: "2025-10-27T14:30:00Z",
        category: "Food",
      });
      addTx({
        accountId: cardAccount.id,
        merchant: "Amazon",
        amount: 2499,
        dateISO: "2025-10-26T16:20:00Z",
        category: "Shopping",
      });
      addTx({
        accountId: upiAccount.id,
        merchant: "Zomato",
        amount: 680,
        dateISO: "2025-10-26T20:15:00Z",
        category: "Food",
      });
      addTx({
        accountId: walletAccount.id,
        merchant: "BookMyShow",
        amount: 600,
        dateISO: "2025-10-25T19:00:00Z",
        category: "Entertainment",
      });
      addTx({
        accountId: upiAccount.id,
        merchant: "Uber",
        amount: 230,
        dateISO: "2025-10-27T11:00:00Z",
        category: "Travel",
      });

      // Set budget
      setMonthlyBudget(40000);
    }

    setLocation("/dashboard");
  };

  const handleGoToSignup = () => {
    setLocation("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground font-mono">
                F
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your financial dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 text-base gap-3"
            onClick={handleLogin}
            data-testid="button-google-login"
          >
            <SiGoogle className="h-5 w-5" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-base gap-3"
            onClick={handleLogin}
            data-testid="button-phone-login"
          >
            <Smartphone className="h-5 w-5" />
            Continue with Phone
          </Button>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          <Button
            variant="default"
            className="w-full h-12 text-base gap-3"
            onClick={handleLogin}
            data-testid="button-email-login"
          >
            <Mail className="h-5 w-5" />
            Continue with Email
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">
              Don't have an account?
            </span>
            <button
              className="text-primary font-semibold hover:underline"
              onClick={handleGoToSignup}
              data-testid="link-signup"
            >
              Sign up
            </button>
          </div>
          <p className="text-xs text-center text-muted-foreground px-8">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline hover:text-foreground"
              data-testid="link-terms"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline hover:text-foreground"
              data-testid="link-privacy"
            >
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
