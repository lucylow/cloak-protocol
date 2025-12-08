import { useState } from 'react';
import { ArrowRightLeft, Shield, Zap, Clock, Check, Lock, Globe, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { PrivacyBadge, InfoTooltip, EducationalCallout, DataVisibilityIndicator } from '@/components/ui/privacy-indicators';
import { motion, AnimatePresence } from 'framer-motion';
import type { TradeStep } from '@/types/zk';

type WizardStep = 'intent' | 'privacy' | 'review' | 'executing';

const TRADE_STEPS: TradeStep[] = [
  { title: 'Select Assets', description: 'Choose RWA pair', status: 'completed' },
  { title: 'Privacy Settings', description: 'Configure what stays private', status: 'current' },
  { title: 'Review & Confirm', description: 'Verify before signing', status: 'pending' },
  { title: 'Execute', description: 'Generate proof & settle', status: 'pending' }
];

export const StepByStepTradeWidget = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('intent');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [fromAsset, setFromAsset] = useState('zk-USDC');
  const [toAsset, setToAsset] = useState('zk-REF');
  const [amount, setAmount] = useState('50000');
  const [privacySettings, setPrivacySettings] = useState({
    hideOrderSize: true,
    hideBalance: true,
    hideCounterparty: true
  });

  const stepOrder: WizardStep[] = ['intent', 'privacy', 'review', 'executing'];
  const currentStepIndex = stepOrder.indexOf(currentStep);

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const executePrivateTrade = async () => {
    setCurrentStep('executing');
    setIsGeneratingProof(true);
    
    // Simulate proof generation phases
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGeneratingProof(false);
    
    toast({
      title: "Trade Executed Successfully",
      description: "Your private swap has been settled via PoW 2.0 batch verification.",
    });

    // Reset after delay
    setTimeout(() => {
      setCurrentStep('intent');
    }, 3000);
  };

  const publicData = ['Valid trade occurred', 'Settlement batch ID', 'Timestamp'];
  const privateData = [
    privacySettings.hideOrderSize ? 'Trade amount' : null,
    privacySettings.hideBalance ? 'Your balance' : null,
    privacySettings.hideCounterparty ? 'Counterparty identity' : null
  ].filter(Boolean) as string[];

  return (
    <Card className="border-primary/20 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ArrowRightLeft className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>Private RWA Swap</span>
          </div>
          <PrivacyBadge type="private" size="md" />
        </CardTitle>
        
        {/* Step Progress */}
        <div className="flex items-center gap-2 mt-4">
          {['Intent', 'Privacy', 'Review', 'Execute'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                index < currentStepIndex ? 'bg-accent/20 text-accent' :
                index === currentStepIndex ? 'bg-primary/20 text-primary border border-primary/30' :
                'bg-muted text-muted-foreground'
              }`}>
                {index < currentStepIndex ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
                <span className="hidden sm:inline">{step}</span>
              </div>
              {index < 3 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Intent */}
          {currentStep === 'intent' && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="h-6 w-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs">1</span>
                Select Asset Pair
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Sell</Label>
                  <select 
                    value={fromAsset}
                    onChange={(e) => setFromAsset(e.target.value)}
                    className="w-full p-3 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    <option value="zk-USDC">zk-USDC (Private Stablecoin)</option>
                    <option value="zk-TBILL">zk-TBILL (Treasury Bill)</option>
                    <option value="zk-REF">zk-REF (Real Estate)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Buy</Label>
                  <select 
                    value={toAsset}
                    onChange={(e) => setToAsset(e.target.value)}
                    className="w-full p-3 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    <option value="zk-REF">zk-REF (Real Estate)</option>
                    <option value="zk-TBILL">zk-TBILL (Treasury Bill)</option>
                    <option value="zk-USDC">zk-USDC (Private Stablecoin)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input 
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 pl-7 bg-secondary border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/50 outline-none font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <Button onClick={nextStep} className="w-full" size="lg">
                Continue to Privacy Settings
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Privacy Settings */}
          {currentStep === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="h-6 w-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs">2</span>
                Configure Privacy
                <InfoTooltip 
                  title="Privacy Settings"
                  content="Choose what information stays private. All selected items will be hidden using zero-knowledge proofs - only a cryptographic proof appears on-chain."
                />
              </div>

              <EducationalCallout
                variant="privacy"
                title="How ZK Privacy Works"
                description="When enabled, your data never leaves your device. Instead, a mathematical proof verifies your trade is valid without revealing the actual values."
              />
              
              <div className="space-y-3 p-4 bg-secondary/30 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-accent" />
                    <Label htmlFor="hide-order" className="text-sm">Hide order size from public book</Label>
                  </div>
                  <Switch 
                    id="hide-order"
                    checked={privacySettings.hideOrderSize}
                    onCheckedChange={(checked) => setPrivacySettings(p => ({...p, hideOrderSize: checked}))}
                  />
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Others won't see the size of your order, preventing front-running.
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-accent" />
                    <Label htmlFor="hide-balance" className="text-sm">Hide my balance</Label>
                  </div>
                  <Switch 
                    id="hide-balance"
                    checked={privacySettings.hideBalance}
                    onCheckedChange={(checked) => setPrivacySettings(p => ({...p, hideBalance: checked}))}
                  />
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Your portfolio size remains private, even after the trade.
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-accent" />
                    <Label htmlFor="hide-counterparty" className="text-sm">Hide counterparty identity</Label>
                  </div>
                  <Switch 
                    id="hide-counterparty"
                    checked={privacySettings.hideCounterparty}
                    onCheckedChange={(checked) => setPrivacySettings(p => ({...p, hideCounterparty: checked}))}
                  />
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Trade anonymously - no one knows who you traded with.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Review Trade
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {currentStep === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="h-6 w-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs">3</span>
                Review Your Trade
              </div>

              {/* Trade Summary */}
              <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Selling</span>
                    <div className="font-mono font-bold text-lg">${amount} {fromAsset}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Buying</span>
                    <div className="font-mono font-bold text-lg">{toAsset}</div>
                  </div>
                </div>
              </div>

              {/* What's visible breakdown */}
              <DataVisibilityIndicator 
                publicData={publicData}
                privateData={privateData}
              />

              <EducationalCallout
                variant="info"
                title="What happens next?"
                description="When you confirm, your device will generate a ZK proof locally. This proof verifies your trade is valid without revealing your private data. The proof is then submitted to the PoW 2.0 settlement layer."
              />

              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={executePrivateTrade} 
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Generate Proof & Execute
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Executing */}
          {currentStep === 'executing' && (
            <motion.div
              key="executing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-8"
            >
              <div className="text-center space-y-4">
                <motion.div 
                  className="h-20 w-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Shield className="h-10 w-10 text-primary-foreground" />
                </motion.div>
                
                <div>
                  <h3 className="text-xl font-bold">
                    {isGeneratingProof ? 'Generating Privacy Proof...' : 'Trade Executed!'}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {isGeneratingProof 
                      ? 'Computing ZK proof locally on your device'
                      : 'Your private swap has been settled successfully'}
                  </p>
                </div>

                {isGeneratingProof && (
                  <div className="flex items-center justify-center gap-2 text-sm text-accent">
                    <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
                    <span>Data never leaves your device</span>
                  </div>
                )}

                {!isGeneratingProof && (
                  <div className="flex items-center justify-center gap-2 text-sm text-accent">
                    <Check className="h-4 w-4" />
                    <span>Verified on PoW 2.0</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy Footer */}
        {currentStep !== 'executing' && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-primary shrink-0" />
              <span>
                <strong className="text-foreground">Privacy by Psy Protocol:</strong> ZK proof generated in browser • Trade details never sent to servers • Settled via PoW 2.0
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
