import { useLocation } from "wouter";
import SignupCard from "@/components/SignupCard";
import { startSessionOnAuth } from "@/store";

export default function SignupPage() {
  const [, setLocation] = useLocation();

  const handleSignup = () => {
    startSessionOnAuth();
    setLocation("/connect");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <SignupCard onGoogleSignup={handleSignup} onPhoneSignup={handleSignup} />
    </div>
  );
}
