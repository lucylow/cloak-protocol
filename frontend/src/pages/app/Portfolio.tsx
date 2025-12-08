import { BarChart3, ShieldCheck, TrendingUp, TrendingDown, Eye, EyeOff, Lock, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PrivacyBadge, InfoTooltip, EducationalCallout } from '@/components/ui/privacy-indicators';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const mockPositions = [
  { id: 1, asset: 'RWA-PrivateCredit', amount: '125.4', value: '$125,400', change: '+5.2%', privacy: 'ZK Shielded', trend: 'up' as const },
  { id: 2, asset: 'RWA-RealEstate', amount: '2.1', value: '$2,100,000', change: '+12.8%', privacy: 'ZK Shielded', trend: 'up' as const },
  { id: 3, asset: 'RWA-CarbonCredit', amount: '847', value: '$8,470', change: '-2.1%', privacy: 'ZK Shielded', trend: 'down' as const },
];

const PortfolioPage = () => {
  const totalValue = '$2,233,870';
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [hoveringId, setHoveringId] = useState<number | null>(null);

  const toggleReveal = (id: number) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedIds(newRevealed);
  };

  const generateAuditProof = () => {
    toast({
      title: "Generating Portfolio Audit Proof",
      description: "Creating a ZK proof that verifies your total holdings without revealing individual positions. Perfect for compliance or counterparty verification.",
    });
  };

  const isAnyRevealed = revealedIds.size > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-gradient-primary rounded-xl flex items-center justify-center">
            <BarChart3 className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              Private Portfolio
              <InfoTooltip 
                title="Private Portfolio"
                content="Your portfolio is encrypted and only visible to you. Hover over values to peek, or click the eye icon to keep them visible."
              />
            </h1>
            <p className="text-muted-foreground">ZK-shielded positions. Only you see the details.</p>
          </div>
        </div>
        <Button variant="outline" onClick={generateAuditProof}>
          <FileCheck className="h-4 w-4 mr-2" />
          Generate Audit Proof
        </Button>
      </div>

      {/* Total Value Card */}
      <Card className="bg-gradient-primary border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <CardContent className="py-8 relative">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-primary-foreground/80 mb-2">
              <Lock className="h-4 w-4" />
              <span>Total Portfolio Value</span>
              <PrivacyBadge type="private" size="sm" />
            </div>
            <h2 className="text-5xl font-bold text-primary-foreground font-mono">
              {isAnyRevealed ? totalValue : '$•,•••,•••'}
            </h2>
            <p className="text-primary-foreground/60 mt-3 flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>+8.4% this month</span>
            </p>
            {!isAnyRevealed && (
              <p className="text-primary-foreground/50 text-xs mt-2">
                Reveal individual positions to see total
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Educational Note */}
      <EducationalCallout
        variant="privacy"
        title="Privacy-First Portfolio View"
        description="Your balances are hidden by default to protect your financial privacy. Hover over any position to peek at the value, or click the eye icon to keep it visible. This data never leaves your device."
      />

      {/* Position Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPositions.map((position) => {
          const isRevealed = revealedIds.has(position.id);
          const isHovering = hoveringId === position.id;
          const showValue = isRevealed || isHovering;

          return (
            <motion.div
              key={position.id}
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveringId(position.id)}
              onMouseLeave={() => setHoveringId(null)}
            >
              <Card 
                className="bg-card border-border group hover:border-accent/50 transition-all duration-300 cursor-pointer h-full"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-foreground">
                      {position.asset}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReveal(position.id);
                        }}
                      >
                        {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      Value <Lock className="h-3 w-3" />
                    </div>
                    {showValue ? (
                      <motion.div 
                        className="text-2xl font-bold text-foreground font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {position.value}
                      </motion.div>
                    ) : (
                      <div className="text-2xl font-mono text-muted-foreground">$••••••</div>
                    )}
                    <div className="text-sm text-muted-foreground mt-1">
                      {showValue ? `${position.amount} units` : '••• units'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      position.trend === 'up' ? 'text-accent' : 'text-destructive'
                    }`}>
                      {position.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {position.change}
                    </div>
                    <PrivacyBadge type="private" size="sm" showLabel={false} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Privacy Notice */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          All positions are fully private via zero-knowledge proofs
        </p>
      </div>
    </div>
  );
};

export default PortfolioPage;
