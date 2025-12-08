import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  ExternalLink
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock activity data
const mockTransactions = [
  {
    id: 'tx-001',
    type: 'trade',
    timestamp: new Date(Date.now() - 3600000),
    asset: 'RWA-CREDIT',
    side: 'buy',
    amount: 1250.50,
    price: 0.95,
    total: 1187.98,
    status: 'completed',
    txHash: '0x1234...5678',
    proofId: 'proof-001',
  },
  {
    id: 'tx-002',
    type: 'trade',
    timestamp: new Date(Date.now() - 7200000),
    asset: 'RWA-ESTATE',
    side: 'sell',
    amount: 450.00,
    price: 1.02,
    total: 459.00,
    status: 'completed',
    txHash: '0xabcd...efgh',
    proofId: 'proof-002',
  },
  {
    id: 'tx-003',
    type: 'proof',
    timestamp: new Date(Date.now() - 10800000),
    asset: 'RWA-CARBON',
    side: null,
    amount: 0,
    price: 0,
    total: 0,
    status: 'completed',
    txHash: '0x9876...5432',
    proofId: 'proof-003',
  },
  {
    id: 'tx-004',
    type: 'trade',
    timestamp: new Date(Date.now() - 14400000),
    asset: 'RWA-ART',
    side: 'buy',
    amount: 250.00,
    price: 0.98,
    total: 245.00,
    status: 'pending',
    txHash: null,
    proofId: 'proof-004',
  },
  {
    id: 'tx-005',
    type: 'settlement',
    timestamp: new Date(Date.now() - 18000000),
    asset: 'RWA-BONDS',
    side: null,
    amount: 5000.00,
    price: 1.001,
    total: 5005.00,
    status: 'completed',
    txHash: '0xfedc...ba98',
    proofId: 'proof-005',
  },
  {
    id: 'tx-006',
    type: 'trade',
    timestamp: new Date(Date.now() - 21600000),
    asset: 'RWA-CREDIT',
    side: 'sell',
    amount: 890.25,
    price: 0.96,
    total: 854.64,
    status: 'failed',
    txHash: null,
    proofId: 'proof-006',
  },
];

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.txHash && tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Activity & History</h1>
          <p className="text-lg text-muted-foreground">
            View your transaction history and activity logs
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions, assets, or transaction hashes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="trade">Trades</SelectItem>
                <SelectItem value="proof">Proofs</SelectItem>
                <SelectItem value="settlement">Settlements</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="proofs">ZK Proofs</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No transactions found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(tx.timestamp)}
                        </TableCell>
                        <TableCell className="font-medium">{tx.asset}</TableCell>
                        <TableCell>
                          {tx.side ? (
                            <div className={`flex items-center gap-1 ${tx.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                              {tx.side === 'buy' ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                              <span className="uppercase font-semibold">{tx.side}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {tx.amount > 0 ? formatCurrency(tx.amount) : '—'}
                        </TableCell>
                        <TableCell>
                          {tx.price > 0 ? formatCurrency(tx.price) : '—'}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {tx.total > 0 ? formatCurrency(tx.total) : '—'}
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tx.txHash && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="View on explorer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="View proof details"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proofs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ZK Proof History</CardTitle>
              <CardDescription>
                Zero-knowledge proofs generated for your transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions
                  .filter((tx) => tx.type === 'proof' || tx.proofId)
                  .map((tx) => (
                    <Card key={tx.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="font-semibold">{tx.proofId}</span>
                            {getStatusBadge(tx.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(tx.timestamp)} • {tx.asset}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settlement History</CardTitle>
              <CardDescription>
                Batch settlement transactions on Psy Protocol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions
                  .filter((tx) => tx.type === 'settlement')
                  .map((tx) => (
                    <Card key={tx.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Settlement #{tx.id}</span>
                            {getStatusBadge(tx.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(tx.timestamp)} • {formatCurrency(tx.total)}
                          </p>
                          {tx.txHash && (
                            <p className="text-xs text-muted-foreground font-mono">
                              {tx.txHash}
                            </p>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          View Settlement
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Activity;

