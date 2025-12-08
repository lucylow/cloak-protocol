import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import type { PsySDKey } from '@/types/zk';

interface AppLayoutProps {
  children: ReactNode;
  sdKey: PsySDKey | null;
  onDisconnect: () => void;
}

export function AppLayout({ children, sdKey, onDisconnect }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-lg font-semibold text-foreground">Cloak Protocol</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* SD Key indicator */}
              {sdKey && (
                <div className="hidden md:flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-muted-foreground">
                    SDKey: {Array.from(sdKey.publicKey.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('')}...
                  </span>
                </div>
              )}
              
              {/* Wallet Connect Button */}
              <WalletConnectButton />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
