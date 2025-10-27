import { useLocation } from "wouter";
import SignupCard from "@/components/SignupCard";

export default function SignupPage() {
  const [, setLocation] = useLocation();

  const handleSignup = () => {
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
