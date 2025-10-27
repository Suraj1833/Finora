import CategorySpendingChart from '../CategorySpendingChart';

export default function CategorySpendingChartExample() {
  const mockData = [
    { name: "Food", value: 5200, color: "#8b5cf6" },
    { name: "Shopping", value: 4800, color: "#ec4899" },
    { name: "Entertainment", value: 2900, color: "#3b82f6" },
    { name: "Other", value: 2000, color: "#10b981" },
  ];

  return (
    <div className="max-w-md">
      <CategorySpendingChart data={mockData} />
    </div>
  );
}
