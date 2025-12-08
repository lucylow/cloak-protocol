import { useState, lazy, Suspense, useCallback, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { PsySDKey } from '@/types/zk';

// Lazy load all route components for code splitting
const DashboardContent = lazy(() => import('./app/DashboardContent'));
const TradePage = lazy(() => import('./app/Trade'));
const PortfolioPage = lazy(() => import('./app/Portfolio'));
const PrivacyPage = lazy(() => import('./app/Privacy'));
const WalletPage = lazy(() => import('./app/Wallet'));
const DocsPage = lazy(() => import('./app/Docs'));
const SettingsPage = lazy(() => import('./app/Settings'));
const GovernancePage = lazy(() => import('./app/Governance'));
const DexDemo = lazy(() => import('./app/DexDemo'));
const RwaMarket = lazy(() => import('./app/RwaMarket'));
const AnalyticsPage = lazy(() => import('./app/Analytics'));
const ActivityPage = lazy(() => import('./app/Activity'));
const HelpPage = lazy(() => import('./app/Help'));
const SecurityPage = lazy(() => import('./app/Security'));
const BridgePage = lazy(() => import('./app/Bridge'));
const StakingPage = lazy(() => import('./app/Staking'));

// Loading fallback for route components
const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner />
  </div>
);

const AppRoutes = () => {
  const [sdKey, setSdKey] = useState<PsySDKey | null>(null);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleConnect = useCallback((key: PsySDKey) => {
    setSdKey(key);
  }, []);

  const handleDisconnect = useCallback(() => {
    setSdKey(null);
  }, []);

  // Memoize layout props
  const layoutProps = useMemo(() => ({
    sdKey,
    onDisconnect: handleDisconnect,
  }), [sdKey, handleDisconnect]);

  return (
    <AppLayout {...layoutProps}>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route 
            path="/" 
            element={<DashboardContent sdKey={sdKey} onConnect={handleConnect} />} 
          />
          <Route path="/trade" element={<TradePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/demo/dex" element={<DexDemo />} />
          <Route path="/demo/rwa" element={<RwaMarket />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/bridge" element={<BridgePage />} />
          <Route path="/staking" element={<StakingPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
};

export default AppRoutes;
