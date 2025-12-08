import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Lock,
  Unlock,
  Coins,
  Zap,
  Shield,
  Clock,
  Percent,
  DollarSign,
  ArrowRight,
  Info
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const stakingPools = [
  {
    id: 'pool-usdc',
    name: 'USDC Staking Pool',
    asset: 'USDC',
    apy: 8.5,
    totalStaked: 12500000,
    yourStake: 0,
    lockPeriod: 'Flexible',
    minStake: 100,
    status: 'active',
  },
  {
    id: 'pool-rwa-credit',
    name: 'RWA Credit Vault',
    asset: 'RWA-CREDIT',
    apy: 12.3,
    totalStaked: 8500000,
    yourStake: 5000,
    lockPeriod: '30 days',
    minStake: 500,
    status: 'active',
  },
  {
    id: 'pool-rwa-estate',
    name: 'Real Estate Yield',
    asset: 'RWA-ESTATE',
    apy: 15.7,
    totalStaked: 25000000,
    yourStake: 0,
    lockPeriod: '90 days',
    minStake: 1000,
    status: 'active',
  },
  {
    id: 'pool-lp',
    name: 'Liquidity Provider Pool',
    asset: 'LP Tokens',
    apy: 23.1,
    totalStaked: 4500000,
    yourStake: 1200,
    lockPeriod: 'Flexible',
    minStake: 250,
    status: 'active',
  },
];

const stakingHistory = [
  {
    id: 'stake-001',
    pool: 'RWA Credit Vault',
    action: 'stake',
    amount: 5000,
    asset: 'RWA-CREDIT',
    timestamp: new Date(Date.now() - 86400000 * 5),
    txHash: '0x1234...5678',
  },
  {
    id: 'stake-002',
    pool: 'Liquidity Provider Pool',
    action: 'stake',
    amount: 1200,
    asset: 'LP Tokens',
    timestamp: new Date(Date.now() - 86400000 * 12),
    txHash: '0xabcd...efgh',
  },
  {
    id: 'stake-003',
    pool: 'USDC Staking Pool',
    action: 'unstake',
    amount: 2500,
    asset: 'USDC',
    timestamp: new Date(Date.now() - 86400000 * 30),
    txHash: '0x9876...5432',
  },
];

const Staking = () => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.yourStake, 0);
  const estimatedEarnings = stakingPools.reduce(
    (sum, pool) => sum + (pool.yourStake * pool.apy) / 100 / 365,
    0
  );

  const selectedPoolData = selectedPool
    ? stakingPools.find((p) => p.id === selectedPool)
    : null;

  const handleStake = async () => {
    if (!selectedPool || !stakeAmount || parseFloat(stakeAmount) <= 0) return;

    setIsStaking(true);
    // Simulate staking process
    setTimeout(() => {
      setIsStaking(false);
      setStakeAmount('');
      setSelectedPool(null);
      alert('Successfully staked!');
    }, 2000);
  };

  const handleUnstake = async (poolId: string) => {
    if (confirm('Are you sure you want to unstake from this pool?')) {
      alert('Unstaking initiated!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
          <TrendingUp className="h-10 w-10 text-primary" />
          Staking & Vaults
        </h1>
        <p className="text-lg text-muted-foreground">
          Earn yield on your assets with secure staking pools
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Total Staked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalStaked)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all pools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Estimated Earnings (Daily)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(estimatedEarnings)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on current APY</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Percent className="h-4 w-4 text-blue-500" />
              Average APY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {(
                stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">Weighted average</p>
          </CardContent>
        </Card>
      </div>

      {/* Staking Pools */}
      <Tabs defaultValue="pools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pools">Staking Pools</TabsTrigger>
          <TabsTrigger value="history">Staking History</TabsTrigger>
          <TabsTrigger value="info">How It Works</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stakingPools.map((pool) => (
              <Card
                key={pool.id}
                className={`hover:border-primary/50 transition-colors ${
                  selectedPool === pool.id ? 'border-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{pool.name}</CardTitle>
                      <CardDescription>{pool.asset} • {pool.lockPeriod}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {pool.apy.toFixed(1)}% APY
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Staked</span>
                      <span className="font-medium">{formatCurrency(pool.totalStaked)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Stake</span>
                      <span className="font-medium">
                        {pool.yourStake > 0 ? formatCurrency(pool.yourStake) : 'Not staked'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Min. Stake</span>
                      <span className="font-medium">{formatCurrency(pool.minStake)}</span>
                    </div>
                  </div>

                  {pool.yourStake > 0 && (
                    <div className="pt-2 border-t space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Your Earnings (Annual)</span>
                        <span className="font-semibold text-green-500">
                          {formatCurrency((pool.yourStake * pool.apy) / 100)}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleUnstake(pool.id)}
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Unstake
                      </Button>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={() => setSelectedPool(pool.id)}
                    disabled={pool.status !== 'active'}
                  >
                    {pool.yourStake > 0 ? 'Stake More' : 'Stake Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stake Form */}
          {selectedPoolData && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Stake {selectedPoolData.asset}</CardTitle>
                <CardDescription>
                  Earn {selectedPoolData.apy.toFixed(1)}% APY on your {selectedPoolData.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Amount to Stake</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    min={selectedPoolData.minStake}
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Minimum: {formatCurrency(selectedPoolData.minStake)}</span>
                    <span>Available: {formatCurrency(50000)}</span>
                  </div>
                </div>

                {stakeAmount && parseFloat(stakeAmount) >= selectedPoolData.minStake && (
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Annual Earnings</span>
                      <span className="font-semibold text-green-500">
                        {formatCurrency((parseFloat(stakeAmount) * selectedPoolData.apy) / 100)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Daily Earnings</span>
                      <span className="font-medium">
                        {formatCurrency((parseFloat(stakeAmount) * selectedPoolData.apy) / 100 / 365)}
                      </span>
                    </div>
                    {selectedPoolData.lockPeriod !== 'Flexible' && (
                      <div className="flex items-center gap-2 text-sm text-yellow-500">
                        <Clock className="h-4 w-4" />
                        <span>Lock period: {selectedPoolData.lockPeriod}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedPool(null);
                      setStakeAmount('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleStake}
                    disabled={
                      !stakeAmount ||
                      parseFloat(stakeAmount) < selectedPoolData.minStake ||
                      isStaking
                    }
                  >
                    {isStaking ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Staking...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Confirm Stake
                      </>
                    )}
                  </Button>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Secure Staking</AlertTitle>
                  <AlertDescription>
                    Your staked assets are protected by smart contracts and zero-knowledge proofs.
                    You retain full ownership while earning yield.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staking History</CardTitle>
              <CardDescription>
                Track your staking and unstaking transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakingHistory.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.pool}</TableCell>
                      <TableCell>
                        <Badge
                          variant={tx.action === 'stake' ? 'default' : 'outline'}
                          className={
                            tx.action === 'stake'
                              ? 'bg-green-500/10 text-green-500 border-green-500/20'
                              : ''
                          }
                        >
                          {tx.action === 'stake' ? (
                            <Lock className="h-3 w-3 mr-1" />
                          ) : (
                            <Unlock className="h-3 w-3 mr-1" />
                          )}
                          {tx.action.charAt(0).toUpperCase() + tx.action.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(tx.amount)}</TableCell>
                      <TableCell>{tx.asset}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(tx.timestamp)}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{tx.txHash}</code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How Staking Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Staking Overview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Staking pools allow you to earn passive yield on your assets by locking them in
                  secure smart contracts. Funds are used to provide liquidity or participate in
                  protocol governance, and rewards are distributed proportionally to stakers.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Benefits</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Earn competitive APY on your assets</li>
                  <li>Flexible or locked staking options</li>
                  <li>Protected by smart contracts and ZK proofs</li>
                  <li>Real-time yield tracking</li>
                  <li>Easy stake and unstake process</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Risks</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Smart contract risk (audited contracts)</li>
                  <li>APY may vary based on pool performance</li>
                  <li>Lock periods may apply to certain pools</li>
                  <li>Unstaking may have a cooldown period</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Staking;

