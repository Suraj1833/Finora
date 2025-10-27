import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface AlertCardProps {
  message: string;
  variant?: "warning" | "info" | "error";
}

export default function AlertCard({ message, variant = "warning" }: AlertCardProps) {
  const variantStyles = {
    warning: "bg-primary/10 border-primary/20 text-primary-foreground",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
    error: "bg-destructive/10 border-destructive/20 text-destructive",
  };

  return (
    <Card className={`border-2 ${variantStyles[variant]}`}>
      <CardContent className="p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium" data-testid="text-alert-message">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
