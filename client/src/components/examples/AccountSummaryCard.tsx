import AccountSummaryCard from '../AccountSummaryCard';

export default function AccountSummaryCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <AccountSummaryCard
        type="bank"
        name="HDFC Bank"
        accountNumber="****4532"
        balance={125430.50}
        trend="up"
        trendAmount={2340.00}
        lastUpdated="2 hours ago"
        onClick={() => console.log('View HDFC account details')}
      />
      <AccountSummaryCard
        type="upi"
        name="Google Pay"
        accountNumber="user@okaxis"
        balance={5678.25}
        trend="down"
        trendAmount={123.50}
        lastUpdated="1 hour ago"
        onClick={() => console.log('View UPI details')}
      />
      <AccountSummaryCard
        type="wallet"
        name="Paytm Wallet"
        accountNumber="9876543210"
        balance={890.00}
        lastUpdated="30 mins ago"
        onClick={() => console.log('View wallet details')}
      />
    </div>
  );
}
