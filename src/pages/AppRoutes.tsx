import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardContent from './app/DashboardContent';
import TradePage from './app/Trade';
import PortfolioPage from './app/Portfolio';
import PrivacyPage from './app/Privacy';
import WalletPage from './app/Wallet';
import DocsPage from './app/Docs';
import SettingsPage from './app/Settings';
import GovernancePage from './app/Governance';
import type { PsySDKey } from '@/types/zk';

const AppRoutes = () => {
  const [sdKey, setSdKey] = useState<PsySDKey | null>(null);

  return (
    <AppLayout sdKey={sdKey} onDisconnect={() => setSdKey(null)}>
      <Routes>
        <Route path="/" element={<DashboardContent sdKey={sdKey} onConnect={setSdKey} />} />
        <Route path="/trade" element={<TradePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/governance" element={<GovernancePage />} />
      </Routes>
    </AppLayout>
  );
};

export default AppRoutes;
