import { useState } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PrivateBalance } from '@/types/zk';
import { toast } from '@/hooks/use-toast';

const MOCK_PORTFOLIO: PrivateBalance[] = [
  {
    assetId: 'rwa-us-tbill-2025',
    commitment: '0x1a2b3c4d5e6f7890abcdef1234567890',
    revealedAmount: '50,000',
    assetMetadata: {
      name: 'US Treasury Bill Token',
      symbol: 'zk-TBILL',
      isRWA: true,
      complianceRequired: true
    }
  },
  {
    assetId: 'rwa-real-estate-fund',
    commitment: '0x9876543210fedcba0987654321abcdef',
    revealedAmount: '125,000',
    assetMetadata: {
      name: 'Prime Real Estate Fund',
      symbol: 'zk-REF',
      isRWA: true,
      complianceRequired: true
    }
  },
  {
    assetId: 'rwa-carbon-credits',
    commitment: '0xabcdef1234567890abcdef1234567890',
    revealedAmount: '10,000',
    assetMetadata: {
      name: 'Carbon Credit Tokens',
      symbol: 'zk-CCT',
      isRWA: true,
      complianceRequired: false
    }
  }
];

export const PrivatePortfolio = () => {
  const [revealedBalances, setRevealedBalances] = useState<Set<string>>(new Set());

  const toggleReveal = (assetId: string) => {
    const newRevealed = new Set(revealedBalances);
    if (newRevealed.has(assetId)) {
      newRevealed.delete(assetId);
    } else {
      newRevealed.add(assetId);
    }
    setRevealedBalances(newRevealed);
  };

  const generateProofOfHoldings = () => {
    toast({
      title: "Generating ZK Proof of Holdings",
      description: "This proof can be shared with auditors without revealing your portfolio details.",
    });
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <span>Private Portfolio</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateProofOfHoldings}
          >
            <Shield className="h-4 w-4 mr-2" />
            Audit Proof
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {MOCK_PORTFOLIO.map((asset) => {
          const isRevealed = revealedBalances.has(asset.assetId);
          
          return (
            <div 
              key={asset.assetId} 
              className="p-4 bg-secondary/30 border border-border rounded-xl hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{asset.assetMetadata.name}</h4>
                  <p className="text-sm text-muted-foreground">{asset.assetMetadata.symbol}</p>
                </div>
                <div className="flex items-center gap-2">
                  {asset.assetMetadata.complianceRequired && (
                    <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
                      Compliant
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleReveal(asset.assetId)}
                  >
                    {isRevealed ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Balance:</span>
                {isRevealed ? (
                  <span className="font-mono font-bold text-lg">
                    ${asset.revealedAmount}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                    <span className="text-xs text-muted-foreground">(hidden)</span>
                  </div>
                )}
              </div>
              
              <div className="mt-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span className="font-mono">{asset.commitment.substring(0, 18)}...</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
