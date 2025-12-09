import { useState, useCallback, useEffect } from 'react';

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  balance: {
    SOL: number;
    USDC: number;
  };
  walletType: 'phantom' | 'mock' | null;
  chainName: string;
}

// Mock Solana addresses for fallback
const MOCK_SOLANA_ADDRESSES = [
  '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
  'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK',
  '4rL4RCWHz3iNCdCaveD8KcHfV9YagGtotFsJiE6FLhPb',
  'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
];

// Check if Phantom is installed
const getPhantomProvider = () => {
  if (typeof window !== 'undefined' && 'solana' in window) {
    const provider = (window as any).solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  return null;
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    balance: { SOL: 0, USDC: 0 },
    walletType: null,
    chainName: 'Solana Mainnet',
  });

  // Load wallet state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cloak-wallet-solana');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it was a Phantom connection, try to reconnect
        if (parsed.walletType === 'phantom') {
          const provider = getPhantomProvider();
          if (provider?.isConnected) {
            setWallet(prev => ({ ...prev, ...parsed }));
          }
        } else {
          setWallet(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Save wallet state to localStorage
  useEffect(() => {
    if (wallet.isConnected) {
      localStorage.setItem('cloak-wallet-solana', JSON.stringify(wallet));
    } else {
      localStorage.removeItem('cloak-wallet-solana');
    }
  }, [wallet]);

  // Listen for Phantom disconnect events
  useEffect(() => {
    const provider = getPhantomProvider();
    if (provider) {
      const handleDisconnect = () => {
        setWallet({
          isConnected: false,
          isConnecting: false,
          address: null,
          balance: { SOL: 0, USDC: 0 },
          walletType: null,
          chainName: 'Solana Mainnet',
        });
        localStorage.removeItem('cloak-wallet-solana');
      };

      provider.on('disconnect', handleDisconnect);
      return () => {
        provider.off('disconnect', handleDisconnect);
      };
    }
  }, []);

  const connectMock = useCallback(async () => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const randomAddress = MOCK_SOLANA_ADDRESSES[Math.floor(Math.random() * MOCK_SOLANA_ADDRESSES.length)];

    setWallet({
      isConnected: true,
      isConnecting: false,
      address: randomAddress,
      balance: {
        SOL: Math.random() * 50 + 1,
        USDC: Math.floor(Math.random() * 50000) + 1000,
      },
      walletType: 'mock',
      chainName: 'Solana Mainnet (Mock)',
    });
  }, []);

  const connect = useCallback(async () => {
    setWallet(prev => ({ ...prev, isConnecting: true }));

    const provider = getPhantomProvider();

    if (provider) {
      try {
        // Try connecting to Phantom
        const response = await provider.connect();
        const publicKey = response.publicKey.toString();

        setWallet({
          isConnected: true,
          isConnecting: false,
          address: publicKey,
          balance: {
            SOL: 0, // Will be fetched separately in a real app
            USDC: 0,
          },
          walletType: 'phantom',
          chainName: 'Solana Mainnet',
        });

        // Optionally fetch balance here using Solana web3.js
        // For now, we'll show a placeholder

      } catch (err: any) {
        console.warn('Phantom connection failed, falling back to mock:', err.message);
        // Fallback to mock if user rejects or error occurs
        await connectMock();
      }
    } else {
      // Phantom not installed, use mock
      console.log('Phantom wallet not found, using mock wallet');
      await connectMock();
    }
  }, [connectMock]);

  const disconnect = useCallback(async () => {
    const provider = getPhantomProvider();
    
    if (provider && wallet.walletType === 'phantom') {
      try {
        await provider.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    }

    setWallet({
      isConnected: false,
      isConnecting: false,
      address: null,
      balance: { SOL: 0, USDC: 0 },
      walletType: null,
      chainName: 'Solana Mainnet',
    });
    localStorage.removeItem('cloak-wallet-solana');
  }, [wallet.walletType]);

  const formatAddress = useCallback((address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, []);

  const isPhantomInstalled = getPhantomProvider() !== null;

  return {
    ...wallet,
    connect,
    disconnect,
    formatAddress,
    isPhantomInstalled,
  };
}
