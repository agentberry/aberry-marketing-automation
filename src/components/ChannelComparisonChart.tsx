import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChannelComparisonChartProps {
  data: Array<{
    channel: string;
    views: number;
    clicks: number;
    conversions: number;
  }>;
}

const ChannelComparisonChart = ({ data }: ChannelComparisonChartProps) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
          <Bar dataKey="views" fill="hsl(239, 84%, 67%)" radius={[8, 8, 0, 0]} name="조회수" />
          <Bar dataKey="clicks" fill="hsl(258, 90%, 66%)" radius={[8, 8, 0, 0]} name="클릭수" />
          <Bar dataKey="conversions" fill="hsl(189, 94%, 43%)" radius={[8, 8, 0, 0]} name="전환수" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChannelComparisonChart;
