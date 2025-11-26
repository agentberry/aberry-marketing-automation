import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendChartProps {
  data: Array<{
    date: string;
    views: number;
    clicks: number;
    conversions: number;
  }>;
}

const TrendChart = ({ data }: TrendChartProps) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(258, 90%, 66%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(189, 94%, 43%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(189, 94%, 43%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              backdropFilter: "blur(20px)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
          <Area
            type="monotone"
            dataKey="views"
            stroke="hsl(239, 84%, 67%)"
            fillOpacity={1}
            fill="url(#colorViews)"
            strokeWidth={2}
            name="조회수"
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="hsl(258, 90%, 66%)"
            fillOpacity={1}
            fill="url(#colorClicks)"
            strokeWidth={2}
            name="클릭수"
          />
          <Area
            type="monotone"
            dataKey="conversions"
            stroke="hsl(189, 94%, 43%)"
            fillOpacity={1}
            fill="url(#colorConversions)"
            strokeWidth={2}
            name="전환수"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
