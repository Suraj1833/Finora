import AppNavbar from "@/components/AppNavbar";
import BudgetProgress from "@/components/BudgetProgress";
import CategorySpendingChart from "@/components/CategorySpendingChart";
import TransactionList from "@/components/TransactionList";
import AlertCard from "@/components/AlertCard";
import { useLocation } from "wouter";

export default function FinanceDashboardPage() {
  const [, setLocation] = useLocation();

  const mockCategoryData = [
    { name: "Food", value: 5200, color: "#8b5cf6" },
    { name: "Shopping", value: 4800, color: "#ec4899" },
    { name: "Entertainment", value: 2900, color: "#3b82f6" },
    { name: "Other", value: 2000, color: "#10b981" },
  ];

  const mockTransactions = [
    {
      id: "1",
      merchant: "Swiggy",
      category: "Food",
      amount: 450,
      date: "Today, 2:30 PM",
      icon: "food" as const,
    },
    {
      id: "2",
      merchant: "Uber",
      category: "Travel",
      amount: 230,
      date: "Today, 11:00 AM",
      icon: "travel" as const,
    },
    {
      id: "3",
      merchant: "Amazon",
      category: "Shopping",
      amount: 2499,
      date: "Yesterday",
      icon: "shopping" as const,
    },
    {
      id: "4",
      merchant: "Zomato",
      category: "Food",
      amount: 680,
      date: "Yesterday",
      icon: "food" as const,
    },
    {
      id: "5",
      merchant: "BookMyShow",
      category: "Entertainment",
      amount: 600,
      date: "2 days ago",
      icon: "entertainment" as const,
    },
  ];

  const handleLogout = () => {
    console.log('Logging out...');
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar userName="John Doe" onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your spending and stay on budget
          </p>
        </div>

        <BudgetProgress total={40000} spent={14900} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategorySpendingChart data={mockCategoryData} />
          <TransactionList transactions={mockTransactions} />
        </div>

        <AlertCard 
          message="You are nearing your shopping budget limit."
          variant="warning"
        />

        {/* TODO: Upcoming features placeholders - Multi-Account Integration, Smart Expense Categorization, AI Budget Planner, Predictive Alerts & Smart Nudges, AI Chat Assistant, Insight Dashboard, Data Security & Privacy */}
      </div>
    </div>
  );
}
