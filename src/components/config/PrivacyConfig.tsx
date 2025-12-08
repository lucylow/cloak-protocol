import React, { useState } from 'react';
import { Settings, Shield, Zap, Lock, Eye, Banknote } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface PrivacyConfig {
  level: 'standard' | 'enhanced' | 'maximum' | 'custom';
  anonSetSize: number;
  proofTime: number;
  feeMultiplier: number;
  description: string;
}

const privacyLevels: Record<'standard' | 'enhanced' | 'maximum', PrivacyConfig> = {
  standard: {
    level: 'standard',
    anonSetSize: 64,
    proofTime: 1.2,
    feeMultiplier: 1.0,
    description: 'Basic privacy for fast settlements'
  },
  enhanced: {
    level: 'enhanced',
    anonSetSize: 256,
    proofTime: 2.1,
    feeMultiplier: 1.5,
    description: 'Recommended: Strong privacy with PoW 2.0 batching'
  },
  maximum: {
    level: 'maximum',
    anonSetSize: 1024,
    proofTime: 4.8,
    feeMultiplier: 2.5,
    description: 'Maximum anonymity for large institutional trades'
  }
};

interface Props {
  onConfigChange?: (config: PrivacyConfig) => void;
}

export const PrivacyConfiguration: React.FC<Props> = ({ onConfigChange }) => {
  const [config, setConfig] = useState<PrivacyConfig>(privacyLevels.enhanced);
  const [customAnonSet, setCustomAnonSet] = useState(config.anonSetSize);

  const handleLevelChange = (level: 'standard' | 'enhanced' | 'maximum') => {
    const newConfig = privacyLevels[level];
    setConfig(newConfig);
    setCustomAnonSet(newConfig.anonSetSize);
    onConfigChange?.(newConfig);
  };

  const handleCustomChange = (value: number) => {
    setCustomAnonSet(value);
    const newConfig: PrivacyConfig = {
      level: 'custom',
      anonSetSize: value,
      proofTime: Math.max(0.5, Math.log2(value) * 0.3),
      feeMultiplier: Math.max(1, value / 100),
      description: 'Custom anonymity configuration'
    };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  return (
    <div className="glass rounded-xl p-6 shadow-glow border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Privacy Configuration</h3>
      </div>

      {/* Privacy Level Selection */}
      <div className="mb-8">
        <h4 className="font-semibold text-muted-foreground mb-4">Select Privacy Level</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['standard', 'enhanced', 'maximum'] as const).map((level) => {
            const levelConfig = privacyLevels[level];
            const isActive = config.level === level;
            
            return (
              <button
                key={level}
                onClick={() => handleLevelChange(level)}
                className={`p-4 rounded-lg border transition-all duration-200 text-left group ${
                  isActive 
                    ? 'border-primary bg-primary/10 shadow-glow' 
                    : 'border-border bg-secondary/30 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {level === 'standard' && <Eye className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />}
                  {level === 'enhanced' && <Shield className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />}
                  {level === 'maximum' && <Lock className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />}
                  <span className="font-semibold capitalize">{level}</span>
                  {level === 'enhanced' && (
                    <span className="ml-auto text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Recommended</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{levelConfig.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Anonymity Set</span>
                    <span className="font-mono text-foreground">{levelConfig.anonSetSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Proof Time</span>
                    <span className="font-mono text-foreground">{levelConfig.proofTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee Multiplier</span>
                    <span className="font-mono text-foreground">×{levelConfig.feeMultiplier}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Configuration */}
      <div className="mb-6">
        <h4 className="font-semibold text-muted-foreground mb-4 flex items-center justify-between">
          <span>Custom Anonymity Set</span>
          <span className="font-mono text-primary">{customAnonSet} transactions</span>
        </h4>
        
        <div className="space-y-4">
          <Slider
            value={[customAnonSet]}
            onValueChange={([value]) => handleCustomChange(value)}
            min={8}
            max={2048}
            step={8}
            className="w-full"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>Small (Fast)</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Recommended</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>Maximum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="p-4 bg-secondary/30 rounded-lg border border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Current Level</div>
            <div className="font-semibold capitalize text-foreground">{config.level}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Anonymity</div>
            <div className="font-semibold text-accent">{config.anonSetSize} tx pool</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Proof Time</div>
            <div className="font-semibold text-foreground">{config.proofTime.toFixed(1)}s</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Estimated Fee</div>
            <div className="font-semibold flex items-center gap-1 text-foreground">
              <Banknote className="h-4 w-4 text-primary" />
              ×{config.feeMultiplier.toFixed(1)}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <Zap className="h-3 w-3 inline mr-1 text-primary" />
            Higher privacy levels use Psy's PoW 2.0 batch verification for efficient settlement
          </p>
        </div>
      </div>
    </div>
  );
};
