import { useState } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWallet } from '@/hooks/useWallet';
import { cn } from '@/lib/utils';

export function WalletConnectButton() {
  const {
    isConnected,
    isConnecting,
    address,
    balance,
    chainName,
    connect,
    disconnect,
    formatAddress,
  } = useWallet();

  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <Button
        onClick={connect}
        disabled={isConnecting}
        className={cn(
          "gap-2 font-semibold transition-all duration-300",
          "bg-gradient-to-r from-white to-gray-400 hover:from-gray-200 hover:to-gray-500",
          "text-black shadow-lg hover:shadow-white/25",
          isConnecting && "opacity-80"
        )}
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" fill="#E17726"/>
              <path d="M2.66296 1L15.6778 10.809L13.3546 4.99098L2.66296 1Z" fill="#E27625"/>
              <path d="M28.2295 23.5334L24.7346 28.872L32.2175 30.9323L34.3611 23.6501L28.2295 23.5334Z" fill="#E27625"/>
              <path d="M1.27271 23.6501L3.40326 30.9323L10.8732 28.872L7.39143 23.5334L1.27271 23.6501Z" fill="#E27625"/>
              <path d="M10.4706 14.5149L8.39209 17.6507L15.7909 17.9873L15.5497 9.94141L10.4706 14.5149Z" fill="#E27625"/>
              <path d="M25.1505 14.5149L19.9934 9.85059L19.8242 17.9873L27.2099 17.6507L25.1505 14.5149Z" fill="#E27625"/>
              <path d="M10.8733 28.872L15.3471 26.6948L11.4763 23.7012L10.8733 28.872Z" fill="#E27625"/>
              <path d="M20.274 26.6948L24.7347 28.872L24.1448 23.7012L20.274 26.6948Z" fill="#E27625"/>
            </svg>
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 font-mono text-sm border-border/50 bg-secondary/30 hover:bg-secondary/50"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>{formatAddress(address)}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground font-mono">{formatAddress(address)}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Chain Info */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              {chainName}
            </span>
          </div>
        </div>
        
        {/* Balances */}
        <div className="px-2 py-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">ETH</span>
            <span className="font-mono font-medium">{balance.ETH.toFixed(4)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">USDC</span>
            <span className="font-mono font-medium">${balance.USDC.toLocaleString()}</span>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={disconnect}
          className="cursor-pointer text-red-400 focus:text-red-400"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
