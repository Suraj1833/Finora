import DashboardHeader from '../DashboardHeader';
import { useState } from 'react';

export default function DashboardHeaderExample() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log('Refresh triggered');
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <DashboardHeader
      totalBalance={131998.75}
      onAddAccount={() => console.log('Add account triggered')}
      onRefresh={handleRefresh}
      isRefreshing={isRefreshing}
    />
  );
}
