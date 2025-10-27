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

    // Safety check - ensure user object exists
    if (!user) {
      return;
    }

    // For root path, check if user should be redirected
    if (location === "/" || location === "/signup") {
      // If returning user (completed onboarding), go to dashboard
      if (!user.isFirstTime && user.hasSetBudget) {
        setLocation("/dashboard");
        return;
      }
      // Otherwise, let new users see signup page
      return;
    }

    // Skip onboarding flow logic for these paths
    const excludedPaths = ["/connect", "/setup-budget", "/signin"];
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
