import { Button } from "@/components/ui/button";
import { Moon, Sun, User } from "lucide-react";
import { useState, useEffect } from "react";

interface AppNavbarProps {
  userName?: string;
  onLogout?: () => void;
}

export default function AppNavbar({ userName, onLogout }: AppNavbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground font-mono">AT</span>
          </div>
          <span className="text-xl font-bold" data-testid="text-app-name">AutoTrack</span>
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
              onClick={onLogout}
              data-testid="button-user-menu"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{userName}</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
