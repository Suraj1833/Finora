import { useEffect } from "react";
import { useLocation } from "wouter";
import { getState } from "@/store";

export default function OnboardingFlow({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const state = getState();
    const { user, accounts } = state;

    // Skip onboarding flow logic for login/signup paths
    const authPaths = ["/", "/login", "/signup"];
    if (authPaths.includes(location)) {
      // If returning user (completed onboarding), redirect to dashboard
      if (user && !user.isFirstTime && user.hasSetBudget && user.hasConnectedAccounts) {
        setLocation("/dashboard");
        return;
      }
      // Otherwise, let users see login/signup page
      return;
    }

    // Safety check - ensure user object exists for protected routes
    if (!user || (user.isFirstTime && !user.hasConnectedAccounts)) {
      setLocation("/login");
      return;
    }

    // Skip onboarding flow logic for these paths
    const excludedPaths = ["/connect", "/setup-budget"];
    if (excludedPaths.includes(location)) {
      return;
    }

    // Onboarding flow logic for dashboard and other pages
    if (user.isFirstTime) {
      // New user - go through onboarding
      if (!user.hasConnectedAccounts && accounts.length === 0) {
        setLocation("/connect");
      } else if (!user.hasSetBudget) {
        setLocation("/setup-budget");
      }
    } else {
      // Returning user - ensure they've completed setup
      if (!user.hasConnectedAccounts && accounts.length === 0) {
        setLocation("/connect");
      } else if (!user.hasSetBudget) {
        setLocation("/setup-budget");
      }
    }
  }, [location, setLocation]);

  return <>{children}</>;
}
