import { useState } from 'react';
import { Shield, Key, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PsySDKey } from '@/types/zk';

interface SDKeyManagerProps {
  onIdentityReady: (sdKey: PsySDKey) => void;
}

export const SDKeyManager = ({ onIdentityReady }: SDKeyManagerProps) => {
  const [localProofStatus, setLocalProofStatus] = useState<'idle' | 'generating' | 'ready'>('idle');

  const generateLocalProof = async () => {
    setLocalProofStatus('generating');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSDKey: PsySDKey = {
      publicKey: new Uint8Array(32).fill(Math.floor(Math.random() * 255)),
      metadata: {
        creationTime: Date.now(),
        lastUsed: Date.now(),
        credentialProofs: []
      }
    };
    
    setLocalProofStatus('ready');
    onIdentityReady(mockSDKey);
  };

  const { data: testnetStatus } = useQuery({
    queryKey: ['psy-testnet'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { connected: true, blockHeight: 1234567 };
    }
  });

  return (
    <Card className="border-primary/20 shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Key className="h-5 w-5 text-primary-foreground" />
          </div>
          Psy Identity Manager
        </CardTitle>
        <CardDescription>
          Manage your programmable identity (SDKey) for private RWA trading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {testnetStatus?.connected && (
          <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">
              Connected to Psy Testnet (Block #{testnetStatus.blockHeight.toLocaleString()})
            </span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Client-Side Proof Generation</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate ZK proofs locally on your device. Your private data never leaves your browser.
          </p>
          
          <Button
            variant="gradient"
            onClick={generateLocalProof}
            disabled={localProofStatus === 'generating'}
            className="w-full"
            size="lg"
          >
            {localProofStatus === 'idle' && 'Initialize Private Identity'}
            {localProofStatus === 'generating' && 'Generating ZK Proof Locally...'}
            {localProofStatus === 'ready' && 'Identity Ready'}
          </Button>

          {localProofStatus === 'generating' && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg animate-pulse">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
                <span>Generating zero-knowledge proof on your device...</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                This demonstrates Psy's "local proofing" - all computation happens in your browser.
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="font-semibold mb-3">Private Credentials</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm">Accredited Investor Proof</span>
              <Button size="sm" variant="outline">Generate ZK Proof</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Credentials are stored locally and proven via ZK when accessing permissioned pools
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
