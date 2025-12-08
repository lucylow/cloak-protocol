import { useState, useCallback, useEffect } from 'react';

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  balance: {
    ETH: number;
    USDC: number;
  };
  chainId: number;
  chainName: string;
}

const MOCK_ADDRESSES = [
  '0x742d35Cc6634C0532925a3b844Bc9e7595f8abE9',
  '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
  '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
  '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
];

const CHAINS = [
  { id: 1, name: 'Ethereum Mainnet' },
  { id: 137, name: 'Polygon' },
  { id: 42161, name: 'Arbitrum One' },
  { id: 10, name: 'Optimism' },
];

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    balance: { ETH: 0, USDC: 0 },
    chainId: 1,
    chainName: 'Ethereum Mainnet',
  });

  // Load wallet state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cloak-wallet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWallet(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Save wallet state to localStorage
  useEffect(() => {
    if (wallet.isConnected) {
      localStorage.setItem('cloak-wallet', JSON.stringify(wallet));
    } else {
      localStorage.removeItem('cloak-wallet');
    }
  }, [wallet]);

  const connect = useCallback(async () => {
    setWallet(prev => ({ ...prev, isConnecting: true }));

    // Simulate MetaMask connection delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const randomAddress = MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)];
    const randomChain = CHAINS[Math.floor(Math.random() * CHAINS.length)];

    setWallet({
      isConnected: true,
      isConnecting: false,
      address: randomAddress,
      balance: {
        ETH: Math.random() * 10 + 0.5,
        USDC: Math.floor(Math.random() * 50000) + 1000,
      },
      chainId: randomChain.id,
      chainName: randomChain.name,
    });
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      isConnecting: false,
      address: null,
      balance: { ETH: 0, USDC: 0 },
      chainId: 1,
      chainName: 'Ethereum Mainnet',
    });
    localStorage.removeItem('cloak-wallet');
  }, []);

  const switchChain = useCallback(async (chainId: number) => {
    const chain = CHAINS.find(c => c.id === chainId);
    if (chain) {
      setWallet(prev => ({
        ...prev,
        chainId: chain.id,
        chainName: chain.name,
      }));
    }
  }, []);

  const formatAddress = useCallback((address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    ...wallet,
    connect,
    disconnect,
    switchChain,
    formatAddress,
    availableChains: CHAINS,
  };
}
