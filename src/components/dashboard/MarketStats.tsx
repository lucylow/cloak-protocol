import { TrendingUp, Users, Zap } from 'lucide-react';

const stats = [
  { label: 'Active Private Pools', value: '24', icon: Users },
  { label: "Today's Volume", value: '$4.2M', icon: TrendingUp },
  { label: 'Avg Settlement', value: '2.3s', icon: Zap },
];

export const MarketStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <stat.icon className="h-4 w-4" />
            <span className="text-sm">{stat.label}</span>
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
