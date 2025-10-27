import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon ? (
        <div className="mb-6">{icon}</div>
      ) : (
        <div className="mb-6 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <PlusCircle className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-2xl font-semibold mb-2" data-testid="text-empty-title">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      <Button onClick={onAction} data-testid="button-empty-action">
        {actionLabel}
      </Button>
    </div>
  );
}
