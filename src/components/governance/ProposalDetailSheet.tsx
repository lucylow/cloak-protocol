import { motion } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  User,
  Calendar,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react';
import type { Proposal } from '@/lib/mockApi';

const statusConfig = {
  active: { icon: Clock, color: 'text-accent', bg: 'bg-accent/10', label: 'Active' },
  passed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Passed' },
  rejected: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Rejected' },
  pending: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Pending' },
};

interface ProposalDetailSheetProps {
  proposal: Proposal | null;
  onClose: () => void;
  userVote?: string;
  onVote: (proposalId: string, option: 'for' | 'against' | 'abstain') => Promise<void>;
  isVoting: boolean;
}

export function ProposalDetailSheet({ 
  proposal, 
  onClose, 
  userVote, 
  onVote,
  isVoting 
}: ProposalDetailSheetProps) {
  if (!proposal) return null;

  const StatusIcon = statusConfig[proposal.status].icon;
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  const abstainPercent = totalVotes > 0 ? (proposal.votesAbstain / totalVotes) * 100 : 0;
  const quorumPercent = Math.min((totalVotes / proposal.quorum) * 100, 100);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    if (diff <= 0) return 'Voting ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  return (
    <Sheet open={!!proposal} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${statusConfig[proposal.status].bg} ${statusConfig[proposal.status].color} border-0`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[proposal.status].label}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {proposal.category}
            </Badge>
          </div>
          <SheetTitle className="text-xl text-left">{proposal.title}</SheetTitle>
          <SheetDescription className="text-left">
            {proposal.summary}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{proposal.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{proposal.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{getTimeRemaining(proposal.endDate)}</span>
            </div>
          </div>

          <Separator />

          {/* Vote results */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Current Results</h4>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-green-400">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    For
                  </span>
                  <span className="text-muted-foreground">
                    {formatNumber(proposal.votesFor)} ({forPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div 
                    className="h-full bg-green-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${forPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-destructive">
                    <ThumbsDown className="h-3.5 w-3.5" />
                    Against
                  </span>
                  <span className="text-muted-foreground">
                    {formatNumber(proposal.votesAgainst)} ({againstPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div 
                    className="h-full bg-destructive"
                    initial={{ width: 0 }}
                    animate={{ width: `${againstPercent}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Minus className="h-3.5 w-3.5" />
                    Abstain
                  </span>
                  <span className="text-muted-foreground">
                    {formatNumber(proposal.votesAbstain)} ({abstainPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div 
                    className="h-full bg-muted-foreground/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${abstainPercent}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>

            {/* Quorum */}
            <div className="p-3 rounded-lg bg-card border border-border">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Quorum Progress</span>
                <span className={quorumPercent >= 100 ? 'text-green-400' : 'text-foreground'}>
                  {formatNumber(totalVotes)} / {formatNumber(proposal.quorum)}
                </span>
              </div>
              <Progress value={quorumPercent} className="h-2" />
              {quorumPercent < 100 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(proposal.quorum - totalVotes)} more votes needed
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {proposal.description}
            </p>
          </div>

          <Separator />

          {/* Voting */}
          {proposal.status === 'active' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Cast Your Vote</h4>
              
              {userVote ? (
                <div className="p-4 rounded-lg bg-card border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    You voted: <span className="text-foreground font-medium capitalize">{userVote}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your vote has been recorded on-chain with privacy protection.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50"
                    onClick={() => onVote(proposal.id, 'for')}
                    disabled={isVoting}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    For
                  </Button>
                  <Button
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                    onClick={() => onVote(proposal.id, 'against')}
                    disabled={isVoting}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Against
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:bg-muted"
                    onClick={() => onVote(proposal.id, 'abstain')}
                    disabled={isVoting}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Abstain
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Link to explorer */}
          <Button variant="outline" className="w-full" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
