import { useLocation } from "wouter";
import SignupCard from "@/components/SignupCard";
import { updateUserOnboarding } from "@/store";

export default function SignupPage() {
  const [, setLocation] = useLocation();

  const handleSignup = () => {
    // Mark as first-time user on signup
    updateUserOnboarding({ isFirstTime: true, hasConnectedAccounts: false, hasSetBudget: false });
    setLocation("/connect");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <SignupCard 
        onGoogleSignup={handleSignup}
        onPhoneSignup={handleSignup}
      />
    </div>
  );
}
