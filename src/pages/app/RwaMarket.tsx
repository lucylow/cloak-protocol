import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { TrendingUp, Calendar, Layers, AlertTriangle, Loader2, Building2, Leaf, Receipt, X } from 'lucide-react';
import { getRwaMarketAssets, submitRwaOrder, getStoredRwaOrders, type RwaMarketAsset } from '@/lib/mockApi';

const categoryIcons: Record<string, any> = {
  bonds: Receipt,
  realestate: Building2,
  invoice: Receipt,
  green: Leaf,
};

const RwaMarket = () => {
  const [assets, setAssets] = useState<RwaMarketAsset[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<RwaMarketAsset | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('100');
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadAssets();
    setOrders(getStoredRwaOrders());
  }, []);

  const loadAssets = async () => {
    try {
      const data = await getRwaMarketAssets();
      setAssets(data);
    } catch (error) {
      toast.error('Failed to load RWA assets');
    } finally {
      setLoading(false);
    }
  };

  const openAssetDetail = (asset: RwaMarketAsset) => {
    setSelectedAsset(asset);
    setQuantity('100');
    setSide('buy');
  };

  const openOrderModal = (asset: RwaMarketAsset, orderSide: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setSide(orderSide);
    setQuantity('100');
    setOrderModalOpen(true);
  };

  const handleSubmitOrder = async () => {
    if (!selectedAsset) return;
    
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitRwaOrder({
        assetId: selectedAsset.id,
        side,
        qty,
      });

      if (result.ok) {
        toast.success(`Order ${result.orderId} placed successfully`);
        const newOrders = getStoredRwaOrders();
        setOrders(newOrders);
        setOrderModalOpen(false);
        setSelectedAsset(null);
      } else {
        toast.error(result.error || 'Order failed');
      }
    } catch (error) {
      toast.error('Unexpected error placing order');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">RWA Market</h1>
        <p className="text-muted-foreground mt-1">
          Browse and trade tokenized real-world assets. Demo orders persist locally.
        </p>
      </div>

      {/* KYC Banner */}
      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-600 dark:text-yellow-400">KYC Required in Production</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          This demo simulates tokenized RWAs. Live buy/sell flows require identity verification and custodial settlement.
          <Button variant="link" className="h-auto p-0 ml-1" asChild>
            <a href="/app/docs">Learn more →</a>
          </Button>
        </AlertDescription>
      </Alert>

      {/* Asset Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Loading assets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets?.map((asset) => {
            const CategoryIcon = categoryIcons[asset.category] || Receipt;
            return (
              <Card key={asset.id} className="border-border bg-card hover:border-primary/50 transition-colors cursor-pointer" onClick={() => openAssetDetail(asset)}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{asset.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{asset.category}</p>
                      </div>
                    </div>
                    <Badge variant={asset.status === 'open' ? 'default' : 'secondary'}>
                      {asset.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-muted-foreground">Yield:</span>
                      <span className="font-medium text-foreground">{asset.yieldPct}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Maturity:</span>
                    </div>
                    <div className="col-span-2 text-xs text-muted-foreground">
                      {formatDate(asset.maturityDate)}
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium text-foreground">${asset.size.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAssetDetail(asset);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={asset.status !== 'open'}
                      onClick={(e) => {
                        e.stopPropagation();
                        openOrderModal(asset, 'buy');
                      }}
                    >
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recent Orders */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Demo Orders (Local)</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No demo orders yet. Place an order to see it here.</p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      <Badge variant={order.payload.side === 'buy' ? 'default' : 'secondary'} className="mr-2">
                        {order.payload.side.toUpperCase()}
                      </Badge>
                      {order.payload.qty} units
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Asset: {order.payload.assetId} · {new Date(order.ts).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{order.id}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Detail Sheet */}
      <Sheet open={!!selectedAsset && !orderModalOpen} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <SheetContent className="overflow-y-auto">
          {selectedAsset && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedAsset.name}</SheetTitle>
                <SheetDescription>{selectedAsset.description}</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground">Annual Yield</span>
                    <p className="text-lg font-semibold text-green-500">{selectedAsset.yieldPct}%</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground">Price per Token</span>
                    <p className="text-lg font-semibold text-foreground">${selectedAsset.price}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground">Maturity Date</span>
                    <p className="font-medium text-foreground">{formatDate(selectedAsset.maturityDate)}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <span className="text-xs text-muted-foreground">Total Size</span>
                    <p className="font-medium text-foreground">${selectedAsset.size.toLocaleString()}</p>
                  </div>
                </div>

                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-sm text-muted-foreground">
                    KYC required for production. This demo uses mock orders.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    disabled={selectedAsset.status !== 'open'}
                    onClick={() => openOrderModal(selectedAsset, 'buy')}
                  >
                    Buy
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => openOrderModal(selectedAsset, 'sell')}
                  >
                    Sell
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Order Confirmation Modal */}
      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {side === 'buy' ? 'Buy' : 'Sell'} {selectedAsset?.name}
            </DialogTitle>
            <DialogDescription>
              Enter quantity and confirm your order. This is a demo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-sm text-muted-foreground">
                Real trades require KYC verification. Demo orders are stored locally.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="space-y-2">
                <Label>Side</Label>
                <Select value={side} onValueChange={(v) => setSide(v as 'buy' | 'sell')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedAsset && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unit Price</span>
                  <span className="font-medium">${selectedAsset.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{parseFloat(quantity) || 0}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Estimated Total</span>
                  <span className="font-semibold text-foreground">
                    ${((parseFloat(quantity) || 0) * selectedAsset.price).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitOrder} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm ${side === 'buy' ? 'Buy' : 'Sell'}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RwaMarket;
