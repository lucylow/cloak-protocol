import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { submitProposal, type Proposal } from '@/lib/mockApi';
import { Loader2 } from 'lucide-react';

const proposalSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  summary: z.string().min(20, 'Summary must be at least 20 characters').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  category: z.enum(['protocol', 'treasury', 'governance', 'security']),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface CreateProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateProposalDialog({ open, onOpenChange, onSuccess }: CreateProposalDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      category: 'protocol',
    },
  });

  const category = watch('category');

  const onSubmit = async (data: ProposalFormData) => {
    try {
      setSubmitting(true);
      await submitProposal({
        title: data.title,
        summary: data.summary,
        description: data.description,
        category: data.category,
      });
      toast({
        title: 'Proposal created',
        description: 'Your proposal has been submitted for review.',
      });
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Failed to create proposal',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Proposal</DialogTitle>
          <DialogDescription>
            Submit a new proposal for the community to vote on. Proposals require a minimum quorum to pass.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Concise proposal title"
              {...register('title')}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(val) => setValue('category', val as Proposal['category'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="protocol">Protocol</SelectItem>
                <SelectItem value="treasury">Treasury</SelectItem>
                <SelectItem value="governance">Governance</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="Brief summary of the proposal (max 200 chars)"
              rows={2}
              {...register('summary')}
              aria-invalid={!!errors.summary}
            />
            {errors.summary && (
              <p className="text-xs text-destructive">{errors.summary.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the proposal, including rationale and expected impact..."
              rows={5}
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-gradient-primary">
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
