import { Copy, ExternalLink, Shield, Key, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { Badge } from '@/components/ui/badge';

// Phantom wallet icon SVG
const PhantomIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" rx="26.8387" fill="url(#phantom-gradient-page)"/>
    <path d="M110.584 64.9142H99.142C99.142 42.7651 81.173 24.7966 58.9878 24.7966C37.2007 24.7966 19.4685 42.1723 18.8507 63.7728C18.2086 86.2298 37.6807 106.043 60.1508 106.043H63.5765C83.5874 106.043 110.584 85.3429 110.584 64.9142Z" fill="url(#phantom-gradient-page-2)"/>
    <path d="M76.9457 64.4098C76.9457 68.4674 73.6544 71.7587 69.5968 71.7587C65.5392 71.7587 62.2479 68.4674 62.2479 64.4098C62.2479 60.3522 65.5392 57.0609 69.5968 57.0609C73.6544 57.0609 76.9457 60.3522 76.9457 64.4098Z" fill="#FFF"/>
    <path d="M52.2788 64.4098C52.2788 68.4674 48.9875 71.7587 44.9299 71.7587C40.8723 71.7587 37.581 68.4674 37.581 64.4098C37.581 60.3522 40.8723 57.0609 44.9299 57.0609C48.9875 57.0609 52.2788 60.3522 52.2788 64.4098Z" fill="#FFF"/>
    <defs>
      <linearGradient id="phantom-gradient-page" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
        <stop stopColor="#534BB1"/>
        <stop offset="1" stopColor="#551BF9"/>
      </linearGradient>
      <linearGradient id="phantom-gradient-page-2" x1="64.7014" y1="24.7966" x2="64.7014" y2="106.043" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF"/>
        <stop offset="1" stopColor="#FFF" stopOpacity="0.82"/>
      </linearGradient>
    </defs>
  </svg>
);

const WalletPage = () => {
  const { isConnected, address, balance, walletType, chainName, formatAddress, isPhantomInstalled } = useWallet();
  
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: 'Address copied',
        description: 'Wallet address copied to clipboard',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-xl flex items-center justify-center">
          <PhantomIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground">Manage your Solana wallet connection</p>
        </div>
      </div>

      {!isConnected ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 flex flex-col items-center justify-center space-y-6">
            <div className="h-20 w-20 bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 rounded-2xl flex items-center justify-center">
              <PhantomIcon className="h-12 w-12" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Connect Your Wallet</h2>
              <p className="text-muted-foreground max-w-md">
                {isPhantomInstalled 
                  ? 'Connect your Phantom wallet to access private trading features and manage your portfolio.'
                  : 'Install Phantom wallet or connect with a demo wallet to explore the platform.'}
              </p>
            </div>
            <WalletConnectButton />
            {!isPhantomInstalled && (
              <a 
                href="https://phantom.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-[#9945FF] transition-colors"
              >
                Get Phantom Wallet →
              </a>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connected Wallet */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#14F195] rounded-full animate-pulse" />
                Connected Wallet
                {walletType === 'mock' && (
                  <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/50">
                    Demo Mode
                  </Badge>
                )}
                {walletType === 'phantom' && (
                  <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/50">
                    Phantom
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Address</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-secondary px-3 py-2 rounded-lg text-foreground truncate">
                    {address}
                  </code>
                  <Button variant="ghost" size="icon" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Network</div>
                <div className="text-lg font-medium text-foreground">{chainName}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">SOL Balance</div>
                  <div className="text-2xl font-bold text-foreground">{balance.SOL.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">USDC Balance</div>
                  <div className="text-2xl font-bold text-foreground">${balance.USDC.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`https://solscan.io/account/${address}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Solscan
                  </a>
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
                <Shield className="h-5 w-5 text-[#14F195]" />
                Psy SDKey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-[#14F195]/10 border border-[#14F195]/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Key className="h-5 w-5 text-[#14F195]" />
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
                  <div className="font-medium text-[#14F195]">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
