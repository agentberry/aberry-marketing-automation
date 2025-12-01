import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

interface ChannelData {
  name: string;
  clickRate: number;
  color: string;
}

const channelData: ChannelData[] = [
  { name: "Email", clickRate: 7.2, color: "hsl(var(--primary))" },
  { name: "Instagram", clickRate: 5.4, color: "hsl(var(--secondary))" },
  { name: "Facebook", clickRate: 4.8, color: "hsl(var(--accent))" },
  { name: "TikTok", clickRate: 4.2, color: "hsl(239 84% 67% / 0.7)" },
  { name: "Blog", clickRate: 3.1, color: "hsl(258 90% 66% / 0.7)" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-border/40 rounded-lg px-3 py-2 text-sm">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-muted-foreground">
          클릭률: <span className="text-primary font-semibold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const ChannelEfficiencyChart = () => {
  const maxValue = Math.max(...channelData.map((d) => d.clickRate));
  const bestChannel = channelData[0];

  return (
    <div className="glass border-border/40 rounded-xl p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">채널별 효율 비교</h2>
          <p className="text-sm text-muted-foreground mt-1">
            클릭률 기준 · 높을수록 효율적
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">최고 효율 채널</p>
          <p className="text-lg font-bold text-primary">{bestChannel.name}</p>
        </div>
      </div>

      <div className="h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={channelData}
            layout="vertical"
            margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, maxValue + 1]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="clickRate"
              radius={[0, 4, 4, 0]}
              barSize={24}
              label={{
                position: "right",
                fill: "hsl(var(--foreground))",
                fontSize: 13,
                fontWeight: 600,
                formatter: (value: number) => `${value}%`,
              }}
            >
              {channelData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={index === 0 ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border/20">
        💡 <span className="text-primary font-medium">{bestChannel.name}</span> 채널에 더 집중하면 전체 효율을 높일 수 있어요
      </p>
    </div>
  );
};

export default ChannelEfficiencyChart;
