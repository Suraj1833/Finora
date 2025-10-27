import BudgetProgress from '../BudgetProgress';

export default function BudgetProgressExample() {
  return (
    <div className="max-w-md">
      <BudgetProgress
        total={40000}
        spent={14900}
      />
    </div>
  );
}
