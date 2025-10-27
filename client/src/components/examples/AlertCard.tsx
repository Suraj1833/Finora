import AlertCard from '../AlertCard';

export default function AlertCardExample() {
  return (
    <div className="max-w-md space-y-4">
      <AlertCard
        message="You are nearing your shopping budget limit."
        variant="warning"
      />
      <AlertCard
        message="Your monthly savings goal has been updated."
        variant="info"
      />
      <AlertCard
        message="Payment failed for your subscription."
        variant="error"
      />
    </div>
  );
}
