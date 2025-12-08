import { Shield, Key, Cpu, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  title: string;
  desc: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  { title: 'Client-Side ZK Proofs', desc: 'All proofs generated locally', icon: Shield },
  { title: 'SDKey Identities', desc: 'Programmable private identities', icon: Key },
  { title: 'PoW 2.0 Settlement', desc: 'Useful work for batch verification', icon: Cpu },
  { title: 'PARTH Scalability', desc: 'Million+ TPS architecture', icon: Layers }
];

export const PsyFeatures = () => {
  return (
    <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-border rounded-2xl">
      <h3 className="font-semibold text-lg mb-2">Built on Psy Protocol</h3>
      <p className="text-muted-foreground mb-6">
        This interface demonstrates how Cloak Protocol leverages Psy's core features:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div key={feature.title} className="p-4 bg-card border border-border rounded-xl">
            <feature.icon className="h-5 w-5 text-primary mb-2" />
            <div className="font-medium">{feature.title}</div>
            <div className="text-sm text-muted-foreground">{feature.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
