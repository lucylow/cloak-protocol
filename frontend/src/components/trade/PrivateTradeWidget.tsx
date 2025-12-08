import { useState } from 'react';
import { ArrowRightLeft, Shield, Zap, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import type { TradeStep } from '@/types/zk';

const INITIAL_STEPS: TradeStep[] = [
  { title: 'Select Assets', description: 'Choose RWA pair', status: 'completed' },
  { title: 'Set Privacy Level', description: 'Configure ZK parameters', status: 'current' },
  { title: 'Generate Proof', description: 'Local ZK computation', status: 'pending' },
  { title: 'Batch Settlement', description: 'Submit via PoW 2.0', status: 'pending' }
];

export const PrivateTradeWidget = () => {
  const [tradeSteps, setTradeSteps] = useState<TradeStep[]>(INITIAL_STEPS);
  const [privacyLevel, setPrivacyLevel] = useState([50]);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [fromAsset, setFromAsset] = useState('zk-USDC');
  const [toAsset, setToAsset] = useState('zk-REF');

  const updateStepStatus = (stepIndex: number, status: TradeStep['status']) => {
    setTradeSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, status } : step
    ));
  };

  const executePrivateTrade = async () => {
    setIsGeneratingProof(true);
    
    updateStepStatus(1, 'completed');
    updateStepStatus(2, 'current');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateStepStatus(2, 'completed');
    updateStepStatus(3, 'current');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateStepStatus(3, 'completed');
    setIsGeneratingProof(false);
    
    toast({
      title: "Trade Executed Successfully",
      description: "Your private swap has been settled via PoW 2.0 batch verification.",
    });

    // Reset after delay
    setTimeout(() => {
      setTradeSteps(INITIAL_STEPS);
    }, 3000);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          Private RWA Swap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Asset Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <select 
              value={fromAsset}
              onChange={(e) => setFromAsset(e.target.value)}
              className="w-full p-3 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
            >
              <option value="zk-USDC">zk-USDC (Private)</option>
              <option value="zk-TBILL">zk-TBILL (Treasury)</option>
              <option value="zk-REF">zk-REF (Real Estate)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <select 
              value={toAsset}
              onChange={(e) => setToAsset(e.target.value)}
              className="w-full p-3 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
            >
              <option value="zk-REF">zk-REF (Real Estate)</option>
              <option value="zk-TBILL">zk-TBILL (Treasury)</option>
              <option value="zk-USDC">zk-USDC (Private)</option>
            </select>
          </div>
        </div>

        {/* Privacy Configuration */}
        <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium">Privacy Level</span>
            </div>
            <span className="text-sm text-muted-foreground px-3 py-1 bg-background rounded-full">
              {privacyLevel[0]}%
            </span>
          </div>
          
          <Slider
            value={privacyLevel}
            onValueChange={setPrivacyLevel}
            max={100}
            step={10}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Standard</span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Enhanced Batch
            </span>
            <span>Maximum</span>
          </div>
        </div>

        {/* Trade Execution Steps */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Execution Flow
          </div>
          
          <div className="space-y-2">
            {tradeSteps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  step.status === 'current' ? 'bg-primary/5 border-primary/30' :
                  step.status === 'completed' ? 'bg-accent/5 border-accent/30' :
                  'bg-secondary/30 border-border'
                }`}
              >
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.status === 'current' ? 'bg-primary text-primary-foreground' :
                  step.status === 'completed' ? 'bg-accent text-accent-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step.status === 'completed' ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="gradient"
          onClick={executePrivateTrade}
          disabled={isGeneratingProof}
          className="w-full py-6 text-lg"
          size="lg"
        >
          {isGeneratingProof ? (
            <>
              <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              Execute Private Trade
              <ArrowRightLeft className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        {/* Privacy Note */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Privacy Assured by Psy Protocol</p>
              <p className="text-muted-foreground mt-1">
                ZK proof generated in browser • Trade details never sent to servers • Settled via PoW 2.0
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
