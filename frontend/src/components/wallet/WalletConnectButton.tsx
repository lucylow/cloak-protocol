import { useState } from 'react';
import { ChevronDown, Copy, ExternalLink, LogOut, Check, Loader2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

// Phantom wallet icon SVG
const PhantomIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" rx="26.8387" fill="url(#phantom-gradient)"/>
    <path d="M110.584 64.9142H99.142C99.142 42.7651 81.173 24.7966 58.9878 24.7966C37.2007 24.7966 19.4685 42.1723 18.8507 63.7728C18.2086 86.2298 37.6807 106.043 60.1508 106.043H63.5765C83.5874 106.043 110.584 85.3429 110.584 64.9142Z" fill="url(#phantom-gradient-2)"/>
    <path d="M76.9457 64.4098C76.9457 68.4674 73.6544 71.7587 69.5968 71.7587C65.5392 71.7587 62.2479 68.4674 62.2479 64.4098C62.2479 60.3522 65.5392 57.0609 69.5968 57.0609C73.6544 57.0609 76.9457 60.3522 76.9457 64.4098Z" fill="#FFF"/>
    <path d="M52.2788 64.4098C52.2788 68.4674 48.9875 71.7587 44.9299 71.7587C40.8723 71.7587 37.581 68.4674 37.581 64.4098C37.581 60.3522 40.8723 57.0609 44.9299 57.0609C48.9875 57.0609 52.2788 60.3522 52.2788 64.4098Z" fill="#FFF"/>
    <defs>
      <linearGradient id="phantom-gradient" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
        <stop stopColor="#534BB1"/>
        <stop offset="1" stopColor="#551BF9"/>
      </linearGradient>
      <linearGradient id="phantom-gradient-2" x1="64.7014" y1="24.7966" x2="64.7014" y2="106.043" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF"/>
        <stop offset="1" stopColor="#FFF" stopOpacity="0.82"/>
      </linearGradient>
    </defs>
  </svg>
);

export function WalletConnectButton() {
  const {
    isConnected,
    isConnecting,
    address,
    balance,
    chainName,
    walletType,
    connect,
    disconnect,
    formatAddress,
    isPhantomInstalled,
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
          "bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-[#8835EE] hover:to-[#0DE085]",
          "text-white shadow-lg hover:shadow-purple-500/25",
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
            <PhantomIcon />
            {isPhantomInstalled ? 'Connect Phantom' : 'Connect Wallet'}
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
          <div className="w-2 h-2 bg-[#14F195] rounded-full animate-pulse" />
          <span>{formatAddress(address)}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Connected Wallet</p>
              {walletType === 'mock' && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-500 border-amber-500/50">
                  Mock
                </Badge>
              )}
              {walletType === 'phantom' && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-purple-400 border-purple-400/50">
                  Phantom
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono">{formatAddress(address)}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Chain Info */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#14F195] rounded-full" />
              {chainName}
            </span>
          </div>
        </div>
        
        {/* Balances */}
        <div className="px-2 py-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">SOL</span>
            <span className="font-mono font-medium">{balance.SOL.toFixed(4)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">USDC</span>
            <span className="font-mono font-medium">${balance.USDC.toLocaleString()}</span>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-[#14F195]" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a
            href={`https://solscan.io/account/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Solscan
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
