import { Wallet, Copy, ExternalLink, Shield, Key, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const WalletPage = () => {
  const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f8cD12';
  const mockBalance = '12.458 ETH';
  
  const copyAddress = () => {
    navigator.clipboard.writeText(mockAddress);
    toast({
      title: 'Address copied',
      description: 'Wallet address copied to clipboard',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Wallet className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground">Manage your connected wallet and keys</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connected Wallet */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
              Connected Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Address</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-secondary px-3 py-2 rounded-lg text-foreground truncate">
                  {mockAddress}
                </code>
                <Button variant="ghost" size="icon" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-1">Balance</div>
              <div className="text-3xl font-bold text-foreground">{mockBalance}</div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
              <Button variant="outline" size="icon">
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SDKey Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Psy SDKey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Key className="h-5 w-5 text-accent" />
                <span className="font-medium text-foreground">Identity Active</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your SDKey is ready for private transactions. All trades will use ZK proofs automatically.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Key Type</div>
                <div className="font-medium text-foreground">BLS12-381</div>
              </div>
              <div>
                <div className="text-muted-foreground">Security Level</div>
                <div className="font-medium text-foreground">128-bit</div>
              </div>
              <div>
                <div className="text-muted-foreground">Created</div>
                <div className="font-medium text-foreground">Just now</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium text-accent">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;
