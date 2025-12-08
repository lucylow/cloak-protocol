import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeftRight,
  ArrowRight,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2,
  Info,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const supportedChains = [
  { id: 'psy', name: 'Psy Protocol', icon: '🔗', native: true },
  { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
  { id: 'base', name: 'Base', icon: '▲' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
  { id: 'polygon', name: 'Polygon', icon: '⬟' },
];

const supportedAssets = [
  { symbol: 'USDC', name: 'USD Coin', chains: ['psy', 'ethereum', 'base', 'arbitrum', 'polygon'] },
  { symbol: 'RWA-CREDIT', name: 'Tokenized Credit', chains: ['psy', 'ethereum', 'base'] },
  { symbol: 'RWA-ESTATE', name: 'Real Estate Index', chains: ['psy', 'ethereum'] },
  { symbol: 'RWA-CARBON', name: 'Carbon Credits', chains: ['psy', 'base', 'polygon'] },
];

const bridgeTransactions = [
  {
    id: 'bridge-001',
    from: 'Ethereum',
    to: 'Psy Protocol',
    asset: 'USDC',
    amount: 1000,
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000),
    txHash: '0x1234...5678',
  },
  {
    id: 'bridge-002',
    from: 'Psy Protocol',
    to: 'Base',
    asset: 'RWA-CREDIT',
    amount: 500,
    status: 'pending',
    timestamp: new Date(Date.now() - 1800000),
    txHash: null,
  },
  {
    id: 'bridge-003',
    from: 'Arbitrum',
    to: 'Psy Protocol',
    asset: 'USDC',
    amount: 2500,
    status: 'processing',
    timestamp: new Date(Date.now() - 900000),
    txHash: '0xabcd...efgh',
  },
];

const Bridge = () => {
  const [fromChain, setFromChain] = useState('psy');
  const [toChain, setToChain] = useState('ethereum');
  const [asset, setAsset] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeProgress, setBridgeProgress] = useState(0);

  const availableAssets = supportedAssets.filter((a) =>
    a.chains.includes(fromChain) && a.chains.includes(toChain)
  );

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsBridging(true);
    setBridgeProgress(0);

    // Simulate bridge process
    const interval = setInterval(() => {
      setBridgeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBridging(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const estimatedTime = 5; // minutes
  const estimatedFee = parseFloat(amount || '0') * 0.001; // 0.1% fee

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
          <ArrowLeftRight className="h-10 w-10 text-primary" />
          Cross-Chain Bridge
        </h1>
        <p className="text-lg text-muted-foreground">
          Transfer assets between chains securely with zero-knowledge privacy
        </p>
      </div>

      {/* Bridge Form */}
      <Card>
        <CardHeader>
          <CardTitle>Bridge Assets</CardTitle>
          <CardDescription>
            Select source and destination chains, then enter the amount to bridge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chain Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Chain</Label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedChains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      <div className="flex items-center gap-2">
                        <span>{chain.icon}</span>
                        <span>{chain.name}</span>
                        {chain.native && (
                          <Badge variant="secondary" className="ml-2">Native</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To Chain</Label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedChains
                    .filter((chain) => chain.id !== fromChain)
                    .map((chain) => (
                      <SelectItem key={chain.id} value={chain.id}>
                        <div className="flex items-center gap-2">
                          <span>{chain.icon}</span>
                          <span>{chain.name}</span>
                          {chain.native && (
                            <Badge variant="secondary" className="ml-2">Native</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Chains Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              const temp = fromChain;
              setFromChain(toChain);
              setToChain(temp);
            }}
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Swap Chains
          </Button>

          {/* Asset Selection */}
          <div className="space-y-2">
            <Label>Asset</Label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableAssets.length > 0 ? (
                  availableAssets.map((a) => (
                    <SelectItem key={a.symbol} value={a.symbol}>
                      {a.symbol} - {a.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No assets available for this route
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={availableAssets.length === 0}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Available: {formatCurrency(5000)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAmount('5000')}
                className="h-6 text-xs"
              >
                Max
              </Button>
            </div>
          </div>

          {/* Bridge Details */}
          {amount && parseFloat(amount) > 0 && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Time</span>
                <span className="font-medium">{estimatedTime} minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bridge Fee</span>
                <span className="font-medium">{formatCurrency(estimatedFee)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">You Will Receive</span>
                <span className="font-medium">
                  {formatCurrency(parseFloat(amount) - estimatedFee)}
                </span>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {isBridging && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bridging in progress...</span>
                <span className="font-medium">{bridgeProgress}%</span>
              </div>
              <Progress value={bridgeProgress} />
            </div>
          )}

          {/* Bridge Button */}
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleBridge}
            disabled={
              !amount ||
              parseFloat(amount) <= 0 ||
              availableAssets.length === 0 ||
              fromChain === toChain ||
              isBridging
            }
          >
            {isBridging ? (
              <>
                <Clock className="h-5 w-5 animate-spin" />
                Bridging...
              </>
            ) : (
              <>
                <ArrowRight className="h-5 w-5" />
                Bridge Assets
              </>
            )}
          </Button>

          {/* Info Alert */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Secure Bridge</AlertTitle>
            <AlertDescription>
              Your bridge transactions are protected by zero-knowledge proofs. All transfers are
              private and verifiable on-chain.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Bridge History */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Bridge History</TabsTrigger>
          <TabsTrigger value="info">Bridge Info</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bridge Transactions</CardTitle>
              <CardDescription>
                Track your cross-chain asset transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bridgeTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{tx.from}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{tx.to}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tx.asset} • {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(tx.status)}
                      {tx.txHash && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Cross-Chain Bridges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  How It Works
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cloak Protocol's bridge uses zero-knowledge proofs to enable private cross-chain
                  transfers. Your assets are locked on the source chain and unlocked on the
                  destination chain, all while maintaining complete privacy.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Supported Chains</h3>
                <div className="flex flex-wrap gap-2">
                  {supportedChains.map((chain) => (
                    <Badge key={chain.id} variant="outline">
                      {chain.icon} {chain.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bridge;

