import AccountConnectionCard from '../AccountConnectionCard';

export default function AccountConnectionCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
      <AccountConnectionCard
        type="bank"
        title="Bank Account"
        description="Connect your bank for automatic transaction tracking"
        onConnect={() => console.log('Connect bank triggered')}
      />
      <AccountConnectionCard
        type="upi"
        title="UPI"
        description="Link your UPI ID for payment tracking"
        connected={true}
      />
      <AccountConnectionCard
        type="wallet"
        title="Digital Wallet"
        description="Sync wallet balance and transactions"
        onConnect={() => console.log('Connect wallet triggered')}
      />
    </div>
  );
}
