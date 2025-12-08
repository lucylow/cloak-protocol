import { useState } from 'react';
import { SDKeyManager } from '@/components/wallet/SDKeyManager';
import { EnhancedPrivatePortfolio } from '@/components/portfolio/EnhancedPrivatePortfolio';
import { DualViewTransactionHistory } from '@/components/dashboard/DualViewHistory';
import { MarketStats } from '@/components/dashboard/MarketStats';
import { PrivacyStatusVisualizer } from '@/components/status/PrivacyStatus';
import { TPSVisualizer } from '@/components/visualization/TPSVisualizer';
import { Lock, Shield, Zap, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EducationalCallout } from '@/components/ui/privacy-indicators';
import type { PsySDKey } from '@/types/zk';

interface DashboardContentProps {
  sdKey: PsySDKey | null;
  onConnect: (key: PsySDKey) => void;
}

const DashboardContent = ({ sdKey, onConnect }: DashboardContentProps) => {
  if (!sdKey) {
    return (
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome to Cloak Protocol</h1>
          <p className="text-muted-foreground">
            Initialize your private identity to start trading RWAs with complete confidentiality
          </p>
        </div>
        
        <SDKeyManager onIdentityReady={onConnect} />
        
        <EducationalCallout
          variant="info"
          title="What is a Private Identity?"
          description="Your SDKey is like a private financial passport. It lets you prove you're authorized to trade without revealing your actual identity or holdings. All data stays on your device."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/app/trade" className="group">
          <div className="bg-card hover:bg-card/80 p-6 rounded-xl border border-border hover:border-accent/50 transition-all h-full">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow transition-shadow shrink-0">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  Quick Trade
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground">Private RWA/USDC swaps with step-by-step guidance</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/app/privacy" className="group">
          <div className="bg-card hover:bg-card/80 p-6 rounded-xl border border-border hover:border-accent/50 transition-all h-full">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                <Shield className="h-6 w-6 text-muted-foreground group-hover:text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  Generate Proof
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground">Create ZK proofs for auditors or counterparties</p>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/app/portfolio" className="group">
          <div className="bg-card hover:bg-card/80 p-6 rounded-xl border border-border hover:border-accent/50 transition-all h-full">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
                <BarChart3 className="h-6 w-6 text-muted-foreground group-hover:text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  View Portfolio
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground">Private positions with reveal-on-hover</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Privacy & Performance Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PrivacyStatusVisualizer />
        <TPSVisualizer />
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <EnhancedPrivatePortfolio />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <DualViewTransactionHistory />
          <MarketStats />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
