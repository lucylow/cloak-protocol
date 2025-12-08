import { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, TrendingUp, TrendingDown, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PrivacyBadge, InfoTooltip, EducationalCallout } from '@/components/ui/privacy-indicators';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import type { PrivateBalance } from '@/types/zk';

const MOCK_PORTFOLIO: (PrivateBalance & { change: string; trend: 'up' | 'down' })[] = [
  {
    assetId: 'rwa-us-tbill-2025',
    commitment: '0x1a2b3c4d5e6f7890abcdef1234567890',
    revealedAmount: '50,000',
    change: '+2.4%',
    trend: 'up',
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
    change: '+8.7%',
    trend: 'up',
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
    change: '-1.2%',
    trend: 'down',
    assetMetadata: {
      name: 'Carbon Credit Tokens',
      symbol: 'zk-CCT',
      isRWA: true,
      complianceRequired: false
    }
  }
];

export const EnhancedPrivatePortfolio = () => {
  const [revealedBalances, setRevealedBalances] = useState<Set<string>>(new Set());
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [showAllValues, setShowAllValues] = useState(false);

  const toggleReveal = (assetId: string) => {
    const newRevealed = new Set(revealedBalances);
    if (newRevealed.has(assetId)) {
      newRevealed.delete(assetId);
    } else {
      newRevealed.add(assetId);
    }
    setRevealedBalances(newRevealed);
  };

  const toggleAll = () => {
    if (showAllValues) {
      setRevealedBalances(new Set());
    } else {
      setRevealedBalances(new Set(MOCK_PORTFOLIO.map(a => a.assetId)));
    }
    setShowAllValues(!showAllValues);
  };

  const generateProofOfHoldings = () => {
    toast({
      title: "Generating ZK Proof of Holdings",
      description: "Creating a shareable proof that verifies your holdings without revealing exact amounts. Perfect for auditors or counterparties.",
    });
  };

  const totalValue = MOCK_PORTFOLIO.reduce((acc, asset) => {
    return acc + parseInt(asset.revealedAmount.replace(',', ''));
  }, 0);

  const isAnyRevealed = revealedBalances.size > 0;

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Lock className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>Private Portfolio</span>
            <InfoTooltip 
              title="Private Portfolio"
              content="Your balances are encrypted and only visible to you. Click the eye icon to reveal values, or hover over a balance to peek."
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleAll}
              className="text-xs"
            >
              {showAllValues ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              {showAllValues ? 'Hide All' : 'Show All'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateProofOfHoldings}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Audit Proof
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Value */}
        <div className="p-4 bg-secondary/30 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                Total Portfolio Value
                <Lock className="h-3 w-3" />
              </div>
              <div className="text-2xl font-bold font-mono mt-1">
                {isAnyRevealed ? (
                  `$${totalValue.toLocaleString()}`
                ) : (
                  <span className="text-muted-foreground">$•••,•••</span>
                )}
              </div>
            </div>
            <PrivacyBadge type="private" size="md" />
          </div>
        </div>

        {/* Asset List */}
        {MOCK_PORTFOLIO.map((asset) => {
          const isRevealed = revealedBalances.has(asset.assetId);
          const isHovered = isHovering === asset.assetId;
          const showValue = isRevealed || isHovered;
          
          return (
            <motion.div 
              key={asset.assetId} 
              className="p-4 bg-secondary/30 border border-border rounded-xl hover:border-primary/30 transition-all cursor-pointer group"
              onMouseEnter={() => setIsHovering(asset.assetId)}
              onMouseLeave={() => setIsHovering(null)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{asset.assetMetadata.name}</h4>
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
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReveal(asset.assetId);
                    }}
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
                <div>
                  <span className="text-xs text-muted-foreground">Balance:</span>
                  <div className="flex items-center gap-2 mt-1">
                    {showValue ? (
                      <motion.span 
                        className="font-mono font-bold text-xl text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        ${asset.revealedAmount}
                      </motion.span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl text-muted-foreground">$••••••</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          Hover to peek
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  asset.trend === 'up' ? 'text-accent' : 'text-destructive'
                }`}>
                  {asset.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {asset.change}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span className="font-mono">Commitment: {asset.commitment.substring(0, 12)}...</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Educational Note */}
        <EducationalCallout
          variant="privacy"
          title="Your data, your control"
          description="Balances are hidden by default. Hover to peek, or click the eye icon to lock a value as visible. Only you can see your actual holdings."
        />
      </CardContent>
    </Card>
  );
};
