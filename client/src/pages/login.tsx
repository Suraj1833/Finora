import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smartphone, Mail } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { startSessionOnAuth } from "@/store";

export default function LoginPage() {
  const [, setLocation] = useLocation();

  const handleAuth = () => {
    startSessionOnAuth();
    setLocation("/connect");
  };

  const handleGoToSignup = () => {
    setLocation("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground font-mono">
                F
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your financial dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 text-base gap-3"
            onClick={handleAuth}
            data-testid="button-google-login"
          >
            <SiGoogle className="h-5 w-5" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-base gap-3"
            onClick={handleAuth}
            data-testid="button-phone-login"
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
            onClick={handleAuth}
            data-testid="button-email-login"
          >
            <Mail className="h-5 w-5" />
            Continue with Email
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">
              Don't have an account?
            </span>
            <button
              className="text-primary font-semibold hover:underline"
              onClick={handleGoToSignup}
              data-testid="link-signup"
            >
              Sign up
            </button>
          </div>
          <p className="text-xs text-center text-muted-foreground px-8">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline hover:text-foreground"
              data-testid="link-terms"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline hover:text-foreground"
              data-testid="link-privacy"
            >
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
