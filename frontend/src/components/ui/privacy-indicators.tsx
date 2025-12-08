import { ReactNode } from 'react';
import { HelpCircle, Lock, Globe, Info, Shield, Eye, EyeOff } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PrivacyBadgeProps {
  type: 'private' | 'public';
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const PrivacyBadge = ({ type, size = 'sm', showLabel = true }: PrivacyBadgeProps) => {
  const isPrivate = type === 'private';
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors cursor-help",
          size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
          isPrivate 
            ? "bg-accent/10 text-accent border border-accent/20" 
            : "bg-white/10 text-white border border-white/20"
        )}>
          {isPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
          {showLabel && (isPrivate ? 'Private' : 'Public')}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-medium">{isPrivate ? 'Private Data' : 'Public Data'}</p>
          <p className="text-xs text-muted-foreground">
            {isPrivate 
              ? 'This information is encrypted and only visible to you. Others see only a cryptographic proof.'
              : 'This information is visible on the public blockchain. Anyone can verify it.'}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface InfoTooltipProps {
  content: ReactNode;
  title?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const InfoTooltip = ({ content, title, side = 'top' }: InfoTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center justify-center h-4 w-4 text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {title && <p className="font-medium mb-1">{title}</p>}
        <p className="text-xs text-muted-foreground">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

interface EducationalCalloutProps {
  title: string;
  description: string;
  variant?: 'info' | 'privacy' | 'warning';
  icon?: ReactNode;
}

export const EducationalCallout = ({ 
  title, 
  description, 
  variant = 'info',
  icon 
}: EducationalCalloutProps) => {
  const variants = {
    info: {
      bg: 'bg-white/5 border-white/20',
      icon: <Info className="h-4 w-4 text-white" />,
      iconBg: 'bg-white/10'
    },
    privacy: {
      bg: 'bg-accent/5 border-accent/20',
      icon: <Shield className="h-4 w-4 text-accent" />,
      iconBg: 'bg-accent/10'
    },
    warning: {
      bg: 'bg-gray-400/5 border-gray-400/20',
      icon: <Info className="h-4 w-4 text-gray-300" />,
      iconBg: 'bg-gray-400/10'
    }
  };

  const v = variants[variant];

  return (
    <div className={cn("p-4 rounded-xl border", v.bg)}>
      <div className="flex gap-3">
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", v.iconBg)}>
          {icon || v.icon}
        </div>
        <div>
          <h4 className="font-medium text-foreground text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface RevealableValueProps {
  value: string;
  isRevealed: boolean;
  onToggle: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RevealableValue = ({ 
  value, 
  isRevealed, 
  onToggle, 
  label,
  size = 'md' 
}: RevealableValueProps) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className="group">
      {label && (
        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
          {label}
          <Lock className="h-3 w-3" />
        </div>
      )}
      <div className="flex items-center gap-2">
        {isRevealed ? (
          <span className={cn("font-mono font-bold text-foreground", sizeClasses[size])}>
            {value}
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className={cn("font-mono text-muted-foreground", sizeClasses[size])}>
              ••••••••
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Hidden
            </span>
          </div>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {isRevealed ? 'Hide value' : 'Reveal value (only you can see this)'}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

interface DataVisibilityIndicatorProps {
  publicData: string[];
  privateData: string[];
}

export const DataVisibilityIndicator = ({ publicData, privateData }: DataVisibilityIndicatorProps) => {
  return (
    <div className="p-4 bg-secondary/30 rounded-xl border border-border space-y-4">
      <h4 className="font-medium text-sm flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        What's visible in this transaction?
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-white">
            <Globe className="h-3 w-3" />
            <span className="font-medium">Public (on-chain)</span>
          </div>
          <ul className="space-y-1">
            {publicData.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground pl-4 border-l-2 border-white/30">
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-accent">
            <Lock className="h-3 w-3" />
            <span className="font-medium">Private (only you)</span>
          </div>
          <ul className="space-y-1">
            {privateData.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground pl-4 border-l-2 border-accent/30">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
