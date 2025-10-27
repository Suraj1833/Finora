import TransactionList from '../TransactionList';

export default function TransactionListExample() {
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
  ];

  return (
    <div className="max-w-md">
      <TransactionList transactions={mockTransactions} />
    </div>
  );
}
