import { Check, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MOCK_SETTLEMENTS = [
  { id: 123457, status: 'settled', time: '2 min ago' },
  { id: 123456, status: 'settled', time: '15 min ago' },
  { id: 123455, status: 'settled', time: '1 hour ago' },
];

export const RecentSettlements = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Settlements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {MOCK_SETTLEMENTS.map((settlement) => (
          <div key={settlement.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div>
              <span className="font-mono text-sm">Batch #{settlement.id}</span>
              <p className="text-xs text-muted-foreground">{settlement.time}</p>
            </div>
            <div className="flex items-center gap-1.5 text-accent text-sm">
              <Check className="h-4 w-4" />
              Settled
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground text-center pt-2">
          PoW 2.0 verified • Details kept private
        </p>
      </CardContent>
    </Card>
  );
};
