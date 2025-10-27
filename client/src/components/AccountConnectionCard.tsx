import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Smartphone, Wallet, CheckCircle2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type AccountType = "bank" | "upi" | "wallet";

export interface AccountConnectionCardProps {
  type: AccountType;
  title: string;
  description: string;
  connected?: boolean;
  onConnect?: () => void;
}

const iconMap: Record<AccountType, LucideIcon> = {
  bank: Building2,
  upi: Smartphone,
  wallet: Wallet,
};

export default function AccountConnectionCard({
  type,
  title,
  description,
  connected = false,
  onConnect,
}: AccountConnectionCardProps) {
  const Icon = iconMap[type];

  return (
    <Card className="hover-elevate">
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
        <div className={`h-16 w-16 rounded-lg flex items-center justify-center ${
          connected ? 'bg-primary/10' : 'bg-muted'
        }`}>
          <Icon className={`h-8 w-8 ${connected ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold" data-testid={`text-${type}-title`}>{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {connected ? (
          <Badge variant="secondary" className="gap-1.5 h-9 px-4">
            <CheckCircle2 className="h-4 w-4" />
            Connected
          </Badge>
        ) : (
          <Button 
            onClick={onConnect} 
            className="w-full"
            data-testid={`button-connect-${type}`}
          >
            Connect
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
