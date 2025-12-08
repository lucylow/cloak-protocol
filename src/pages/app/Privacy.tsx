import { Shield, Lock, Key, Cpu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const privacyFeatures = [
  {
    icon: Lock,
    title: 'Client-Side Proving',
    description: 'Data never leaves your device. Groth16 circuits prove validity locally.',
  },
  {
    icon: Key,
    title: 'SDKey Identity',
    description: 'Programmable identities with embedded compliance. No KYC graphs exposed.',
  },
  {
    icon: Shield,
    title: 'Battle-Tested Crypto',
    description: 'BLS12-381 curves, Poseidon hashes, audited ZK circuits. 128-bit security.',
  },
];

const PrivacyPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-primary opacity-80">
          <Shield className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">End-to-End ZK Privacy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your trades, balances, and strategies stay private. Only mathematical proofs hit the chain.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {privacyFeatures.map((feature, i) => (
          <Card key={i} className="bg-card border-border text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate Proof CTA */}
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Generate Your First Proof</h2>
          <Button 
            size="lg" 
            className="bg-gradient-primary text-primary-foreground font-bold px-12 py-6 text-lg hover:shadow-glow-lg transition-all"
          >
            <Zap className="w-5 h-5 mr-2" />
            Prove Private Balance → 180ms
          </Button>
          <p className="text-muted-foreground font-mono text-sm">
            1.2M constraints | RTX 4090 optimized | 288 bytes proof size
          </p>
        </CardContent>
      </Card>

      {/* Technical Specs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Proof Time', value: '180ms' },
          { label: 'Constraints', value: '1.2M' },
          { label: 'Proof Size', value: '288 bytes' },
          { label: 'Security', value: '128-bit' },
        ].map((stat, i) => (
          <Card key={i} className="bg-secondary border-border">
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPage;
