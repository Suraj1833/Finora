import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SignupPage from "@/pages/signup";
import ConnectAccountsPage from "@/pages/connect-accounts";
import DashboardPage from "@/pages/dashboard";
import FinanceDashboardPage from "@/pages/finance-dashboard";
import SetupBudgetPage from "@/pages/setup-budget";
import OnboardingFlow from "@/components/OnboardingFlow";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <OnboardingFlow>
      <Switch>
        <Route path="/" component={SignupPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/connect" component={ConnectAccountsPage} />
        <Route path="/setup-budget" component={SetupBudgetPage} />
        <Route path="/dashboard" component={FinanceDashboardPage} />
        <Route path="/finance-dashboard" component={FinanceDashboardPage} />
        <Route path="/accounts" component={DashboardPage} />
        <Route component={NotFound} />
      </Switch>
    </OnboardingFlow>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
