import EmptyState from '../EmptyState';
import { Wallet } from 'lucide-react';

export default function EmptyStateExample() {
  return (
    <EmptyState
      title="No accounts connected"
      description="Connect your first account to start tracking your finances automatically"
      actionLabel="Connect Account"
      onAction={() => console.log('Connect account triggered')}
      icon={<Wallet className="h-20 w-20 text-muted-foreground" />}
    />
  );
}
