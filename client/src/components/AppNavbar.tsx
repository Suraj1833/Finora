import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Moon, Sun, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { resetState } from "@/store";

interface AppNavbarProps {
  userName?: string;
  onLogout?: () => void;
}

export default function AppNavbar({ userName, onLogout }: AppNavbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    resetState();
    
    setShowLogoutDialog(false);
    
    toast({
      title: "You've been logged out.",
      description: "Sign in again to access your dashboard.",
    });
    
    if (onLogout) {
      onLogout();
    } else {
      setLocation("/login");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground font-mono">F</span>
            </div>
            <span className="text-xl font-bold" data-testid="text-app-name">Finora</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            {userName && (
              <Button
                variant="ghost"
                className="gap-2"
                onClick={handleLogoutClick}
                data-testid="button-user-menu"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{userName}</span>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent data-testid="dialog-logout-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="text-logout-title">Log out of Finora?</AlertDialogTitle>
            <AlertDialogDescription data-testid="text-logout-description">
              Are you sure you want to log out? You'll need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-logout">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              className="bg-destructive text-destructive-foreground hover-elevate"
              data-testid="button-confirm-logout"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
