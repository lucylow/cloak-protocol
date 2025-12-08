import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { ArrowDownUp, AlertTriangle, Loader2, Info, Zap } from 'lucide-react';
import { getQuote, submitDexSwap, type QuoteResult, type DexPair, DEX_PAIRS } from '@/lib/mockApi';

const DexDemo = () => {
  const [pair, setPair] = useState<DexPair>('CLOAK/rUSD');
  const [amountIn, setAmountIn] = useState('100');
  const [slippage, setSlippage] = useState(0.5);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Clear quote when pair changes
  useEffect(() => {
    setQuote(null);
  }, [pair]);

  const handleGetQuote = async () => {
    const amount = parseFloat(amountIn);
    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    
    setLoadingQuote(true);
    try {
      const result = await getQuote(pair, amount);
      setQuote(result);
    } catch (error) {
      toast.error('Failed to fetch quote');
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleConfirmSwap = async () => {
    if (!quote) return;
    
    setSubmitting(true);
    try {
      const result = await submitDexSwap({
        pair: quote.pair,
        amountIn: quote.amountIn,
        slippagePct: slippage / 100,
      });
      
      if (result.ok) {
        toast.success(`Swap submitted — tx ${result.txId}`);
        setQuote(null);
        setConfirmOpen(false);
        setAmountIn('100');
      } else {
        toast.error(result.error || 'Swap failed');
      }
    } catch (error) {
      toast.error('Unexpected error during swap');
    } finally {
      setSubmitting(false);
    }
  };

  const [tokenIn, tokenOut] = pair.split('/');
  const priceImpactWarning = quote && quote.priceImpact > 0.15;
  const priceImpactCaution = quote && quote.priceImpact > 0.05;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">DEX Demo</h1>
        <p className="text-muted-foreground mt-1">
          Interactive swap interface with mock liquidity. This is a demo — no real funds.
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Swap Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pair & Slippage Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trading Pair</Label>
              <Select value={pair} onValueChange={(v) => setPair(v as DexPair)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEX_PAIRS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Slippage Tolerance: {slippage}%</Label>
              <Slider
                value={[slippage]}
                onValueChange={([v]) => setSlippage(v)}
                min={0.1}
                max={2}
                step={0.1}
                className="py-2"
              />
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount-in">Amount ({tokenIn})</Label>
            <div className="flex gap-2">
              <Input
                id="amount-in"
                type="number"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                placeholder="Enter amount"
                className="flex-1"
              />
              <Button onClick={handleGetQuote} disabled={loadingQuote}>
                {loadingQuote ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Quoting...
                  </>
                ) : (
                  'Get Quote'
                )}
              </Button>
            </div>
          </div>

          {/* Quote Result */}
          {quote ? (
            <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">You receive (estimated)</span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {quote.amountOut.toFixed(4)} {tokenOut}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Price</span>
                  <p className="font-medium text-foreground">
                    1 {tokenIn} = {quote.price.toFixed(6)} {tokenOut}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price Impact</span>
                  <p className={`font-medium ${priceImpactWarning ? 'text-destructive' : priceImpactCaution ? 'text-yellow-500' : 'text-foreground'}`}>
                    {(quote.priceImpact * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Liquidity</span>
                  <p className="font-medium text-foreground">{quote.liquidity.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fee</span>
                  <p className="font-medium text-foreground">{quote.fee.toFixed(4)} {tokenOut}</p>
                </div>
              </div>

              {priceImpactWarning && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>High price impact — this trade may be expensive.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Enter an amount and click "Get Quote" to see swap details</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={!quote || priceImpactWarning}
              className="flex-1"
            >
              Review Swap
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAmountIn('100');
                setQuote(null);
              }}
            >
              Reset
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Demo uses mock liquidity with simulated price impact. Orders persist locally.
          </p>
        </CardContent>
      </Card>

      {/* Confirm Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Swap</DialogTitle>
            <DialogDescription>
              Review the trade details below. This is a demo — no real funds.
            </DialogDescription>
          </DialogHeader>
          
          {quote && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <span className="text-muted-foreground">You pay</span>
                  <p className="font-semibold text-foreground">{quote.amountIn} {tokenIn}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <span className="text-muted-foreground">You receive</span>
                  <p className="font-semibold text-foreground">{quote.amountOut.toFixed(4)} {tokenOut}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Impact</span>
                  <Badge variant={priceImpactCaution ? 'destructive' : 'secondary'}>
                    {(quote.priceImpact * 100).toFixed(2)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slippage Tolerance</span>
                  <span className="font-medium">{slippage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span className="font-medium">{quote.fee.toFixed(4)} {tokenOut}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSwap} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Confirm Swap'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DexDemo;
