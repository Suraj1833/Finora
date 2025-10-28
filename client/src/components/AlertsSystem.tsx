import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";
import { getState, subscribe } from "@/store";

export interface Alert {
  id: string;
  type: "info" | "warning" | "danger";
  message: string;
  timestamp: number;
}

const ALERT_DURATION = 10000;
const MAX_ALERTS = 2;
const DISMISSED_ALERTS_KEY = "autotrack_dismissed_alerts";

interface DismissedAlerts {
  [key: string]: number;
}

function getDismissedAlerts(): DismissedAlerts {
  try {
    const stored = localStorage.getItem(DISMISSED_ALERTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function markAlertDismissed(alertId: string) {
  const dismissed = getDismissedAlerts();
  dismissed[alertId] = Date.now();
  localStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify(dismissed));
}

function shouldShowAlert(alertId: string): boolean {
  const dismissed = getDismissedAlerts();
  const dismissedTime = dismissed[alertId];
  
  if (!dismissedTime) return true;
  
  const ONE_HOUR = 60 * 60 * 1000;
  return Date.now() - dismissedTime > ONE_HOUR;
}

function generateAlerts(): Alert[] {
  const state = getState();
  const { derived } = state;
  const alerts: Alert[] = [];
  
  const { totalSpentThisMonth, monthlyBudget, spendByCategory } = derived;
  
  if (totalSpentThisMonth > monthlyBudget) {
    const excess = totalSpentThisMonth - monthlyBudget;
    const alertId = "budget-exceeded";
    if (shouldShowAlert(alertId)) {
      alerts.push({
        id: alertId,
        type: "danger",
        message: `You've exceeded your monthly budget by ₹${excess.toLocaleString('en-IN')}.`,
        timestamp: Date.now(),
      });
    }
  } else if (totalSpentThisMonth > 0.9 * monthlyBudget) {
    const alertId = "budget-90-percent";
    if (shouldShowAlert(alertId)) {
      alerts.push({
        id: alertId,
        type: "warning",
        message: "You've used over 90% of your monthly budget.",
        timestamp: Date.now(),
      });
    }
  }
  
  const categoryArray = Array.from(spendByCategory.entries());
  if (categoryArray.length > 0) {
    const avgCategorySpend = totalSpentThisMonth / categoryArray.length;
    const avgCategoryLimit = avgCategorySpend * 1.2;
    
    categoryArray.forEach(([category, amount]) => {
      if (amount > 0.85 * avgCategoryLimit) {
        const alertId = `category-${category}-limit`;
        if (shouldShowAlert(alertId)) {
          alerts.push({
            id: alertId,
            type: "info",
            message: `You're nearing your ${category} budget limit.`,
            timestamp: Date.now(),
          });
        }
      }
    });
  }
  
  return alerts.slice(0, MAX_ALERTS);
}

export default function AlertsSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [visibleAlerts, setVisibleAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const updateAlerts = () => {
      const newAlerts = generateAlerts();
      setAlerts(newAlerts);
      setVisibleAlerts(new Set(newAlerts.map((a) => a.id)));
    };

    updateAlerts();

    const unsubscribe = subscribe(() => {
      updateAlerts();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const timers = alerts.map((alert) => {
      return setTimeout(() => {
        handleDismiss(alert.id);
      }, ALERT_DURATION);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [alerts]);

  const handleDismiss = (alertId: string) => {
    setVisibleAlerts((prev) => {
      const next = new Set(prev);
      next.delete(alertId);
      return next;
    });
    markAlertDismissed(alertId);
    
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    }, 300);
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "info":
        return <Lightbulb className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "danger":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getAlertStyles = (type: Alert["type"]) => {
    switch (type) {
      case "info":
        return "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-primary/20";
      case "warning":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/20";
      case "danger":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400/20";
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none"
      style={{
        top: "72px",
        maxWidth: "600px",
        width: "calc(100vw - 2rem)",
      }}
      aria-live="polite"
      role="status"
      data-testid="alerts-container"
    >
      {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`pointer-events-auto ${getAlertStyles(alert.type)} shadow-lg rounded-xl px-6 py-3 transition-all duration-300 animate-slide-in ${
              visibleAlerts.has(alert.id)
                ? "opacity-100"
                : "opacity-0"
            }`}
            data-testid={`alert-${alert.type}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <p className="flex-1 text-sm leading-relaxed font-medium">
                {alert.message}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-6 w-6 -mr-2 -mt-1 hover:bg-white/20 no-default-hover-elevate no-default-active-elevate"
                onClick={() => handleDismiss(alert.id)}
                data-testid={`button-dismiss-${alert.id}`}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss alert</span>
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
