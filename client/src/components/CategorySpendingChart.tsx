import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategorySpendingChartProps {
  data: CategoryData[];
  currency?: string;
}

export default function CategorySpendingChart({ data, currency = "₹" }: CategorySpendingChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderLegend = () => {
    return (
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-sm flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{entry.name}</p>
              <p className="text-sm font-semibold font-mono">
                {currency}{formatAmount(entry.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48" data-testid="chart-category-spending">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {renderLegend()}
      </CardContent>
    </Card>
  );
}
