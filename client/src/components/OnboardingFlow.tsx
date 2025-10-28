import { useEffect } from "react";
import { useLocation } from "wouter";
import { getState } from "@/store";

export default function OnboardingFlow({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const { isAuthenticated, user } = getState();

    const AUTH_PAGES = ["/", "/login", "/signup"];
    const FLOW_PAGES = ["/connect", "/setup-budget"];
    const PROTECTED_PAGES = ["/dashboard", "/finance-dashboard", "/accounts"];

    // Not authenticated: only allow auth pages
    if (!isAuthenticated) {
      if (!AUTH_PAGES.includes(location)) {
        setLocation("/login");
      }
      return;
    }

    // Authenticated: compute next required step
    const needsAccounts = !user?.hasConnectedAccounts;
    const needsBudget = !user?.hasSetBudget;

    const nextStep = needsAccounts ? "/connect" : needsBudget ? "/setup-budget" : null;

    // If user is on an auth page but already authenticated, push them into the flow
    if (AUTH_PAGES.includes(location)) {
      setLocation(nextStep ?? "/dashboard");
      return;
    }

    // If onboarding incomplete and user tries to access ANY protected page, enforce next step
    if (nextStep && (PROTECTED_PAGES.includes(location) || (!FLOW_PAGES.includes(location) && !AUTH_PAGES.includes(location)))) {
      setLocation(nextStep);
      return;
    }

    // If both complete and user tries to access flow pages, send to dashboard
    if (!nextStep && FLOW_PAGES.includes(location)) {
      setLocation("/dashboard");
      return;
    }
  }, [location, setLocation]);

  return <>{children}</>;
}
