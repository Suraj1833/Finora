import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Mail } from "lucide-react";
import { SiGoogle } from "react-icons/si";

interface SignupCardProps {
  onGoogleSignup?: () => void;
  onPhoneSignup?: () => void;
}

export default function SignupCard({ onGoogleSignup, onPhoneSignup }: SignupCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4 text-center pb-6">
        <div className="flex justify-center mb-2">
          <img
            src="/logo.png"
            alt="Finora Logo"
            className="h-14 w-14 object-contain rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl">Welcome to Finora</CardTitle>
          <CardDescription className="text-base">
            Connect all your accounts in one secure place
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full h-12 text-base gap-3"
          onClick={onGoogleSignup}
          data-testid="button-google-signup"
        >
          <SiGoogle className="h-5 w-5" />
          Continue with Google
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12 text-base gap-3"
          onClick={onPhoneSignup}
          data-testid="button-phone-signup"
        >
          <Smartphone className="h-5 w-5" />
          Continue with Phone
        </Button>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">OR</span>
          </div>
        </div>
        <Button 
          variant="default" 
          className="w-full h-12 text-base gap-3"
          onClick={onGoogleSignup}
          data-testid="button-email-signup"
        >
          <Mail className="h-5 w-5" />
          Continue with Email
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-2">
        <p className="text-xs text-center text-muted-foreground px-8">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground" data-testid="link-terms">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground" data-testid="link-privacy">
            Privacy Policy
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
