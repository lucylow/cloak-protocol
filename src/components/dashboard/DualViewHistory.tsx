import { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, FileText, CheckCircle, ExternalLink, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrivacyBadge, InfoTooltip } from '@/components/ui/privacy-indicators';
import { toast } from '@/hooks/use-toast';

interface Settlement {
  id: number;
  batchId: string;
  status: 'settled' | 'pending';
  time: string;
  publicData: {
    timestamp: string;
    verifierContract: string;
    batchHash: string;
  };
  privateData: {
    asset: string;
    amount: string;
    counterparty: string;
    price: string;
  };
}

const MOCK_SETTLEMENTS: Settlement[] = [
  { 
    id: 1,
    batchId: '7823',
    status: 'settled', 
    time: '2 min ago',
    publicData: {
      timestamp: '2024-01-15 14:32:18 UTC',
      verifierContract: '0x7a23...f891',
      batchHash: '0xabc123...def456'
    },
    privateData: {
      asset: 'zk-TBILL',
      amount: '$50,000',
      counterparty: '0x89ab...cdef',
      price: '$0.9823'
    }
  },
  { 
    id: 2,
    batchId: '7822',
    status: 'settled', 
    time: '15 min ago',
    publicData: {
      timestamp: '2024-01-15 14:19:45 UTC',
      verifierContract: '0x7a23...f891',
      batchHash: '0x789abc...123def'
    },
    privateData: {
      asset: 'zk-REF',
      amount: '$125,000',
      counterparty: '0x1234...5678',
      price: '$12.45'
    }
  },
  { 
    id: 3,
    batchId: '7821',
    status: 'settled', 
    time: '1 hour ago',
    publicData: {
      timestamp: '2024-01-15 13:32:18 UTC',
      verifierContract: '0x7a23...f891',
      batchHash: '0xdef789...abc123'
    },
    privateData: {
      asset: 'zk-CCT',
      amount: '$10,000',
      counterparty: '0xfedc...ba98',
      price: '$11.82'
    }
  },
];

export const DualViewTransactionHistory = () => {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());

  const toggleReveal = (id: number) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedIds(newRevealed);
  };

  const generateAuditProof = (settlement: Settlement) => {
    toast({
      title: "Generating Audit Proof",
      description: `Creating ZK proof for Settlement Batch #${settlement.batchId} - shareable with auditors without revealing details.`,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Transaction History
            <InfoTooltip 
              title="Dual-View History"
              content="View your transactions from either a public perspective (what others see on-chain) or your private view (full details secured by your local proof)."
            />
          </div>
          <Tabs defaultValue="private" className="w-auto">
            <TabsList className="h-7">
              <TabsTrigger value="public" className="text-xs px-2 py-1 gap-1">
                <Globe className="h-3 w-3" />
                Public
              </TabsTrigger>
              <TabsTrigger value="private" className="text-xs px-2 py-1 gap-1">
                <Lock className="h-3 w-3" />
                Private
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {MOCK_SETTLEMENTS.map((settlement) => {
          const isRevealed = revealedIds.has(settlement.id);
          
          return (
            <div 
              key={settlement.id} 
              className="p-4 bg-secondary/30 rounded-xl border border-border hover:border-primary/20 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">
                    Settlement Batch #{settlement.batchId}
                  </span>
                  <PrivacyBadge type="private" size="sm" />
                </div>
                <div className="flex items-center gap-2 text-accent text-xs">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Verified
                </div>
              </div>

              {/* Public View (always visible) */}
              <div className="mb-3 pb-3 border-b border-border">
                <div className="flex items-center gap-1.5 text-xs text-blue-400 mb-2">
                  <Globe className="h-3 w-3" />
                  <span className="font-medium">Public View</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <span className="ml-2 font-mono text-foreground">{settlement.time}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Verifier:</span>
                    <button className="ml-2 font-mono text-blue-400 hover:underline inline-flex items-center gap-1">
                      {settlement.publicData.verifierContract}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Private View (toggle) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-accent">
                    <Lock className="h-3 w-3" />
                    <span className="font-medium">Private View</span>
                    <InfoTooltip 
                      content="These details are secured by your local proof and never stored on-chain. Only you can see them."
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => toggleReveal(settlement.id)}
                  >
                    {isRevealed ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                    {isRevealed ? 'Hide' : 'Reveal'}
                  </Button>
                </div>
                
                {isRevealed ? (
                  <div className="grid grid-cols-2 gap-2 text-xs bg-accent/5 p-3 rounded-lg border border-accent/10">
                    <div>
                      <span className="text-muted-foreground">Asset:</span>
                      <span className="ml-2 font-mono font-medium text-foreground">{settlement.privateData.asset}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="ml-2 font-mono font-bold text-foreground">{settlement.privateData.amount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <span className="ml-2 font-mono text-foreground">{settlement.privateData.price}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Counterparty:</span>
                      <span className="ml-2 font-mono text-foreground">{settlement.privateData.counterparty}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <Lock className="h-3 w-3" />
                    <span>Click "Reveal" to view your private trade details</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end mt-3 pt-3 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => generateAuditProof(settlement)}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Generate Audit Proof
                </Button>
              </div>
            </div>
          );
        })}
        
        <p className="text-xs text-muted-foreground text-center pt-2 flex items-center justify-center gap-2">
          <Shield className="h-3 w-3" />
          PoW 2.0 verified • Private details secured by ZK proofs
        </p>
      </CardContent>
    </Card>
  );
};
