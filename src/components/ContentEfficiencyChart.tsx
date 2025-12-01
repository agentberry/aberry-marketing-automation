import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

interface ContentData {
  id: string;
  name: string;
  clickRate: number;
  conversionRate: number;
  roi: number;
  channel: string;
}

interface ContentEfficiencyChartProps {
  data?: ContentData[];
}

const defaultData: ContentData[] = [
  { id: "1", name: "50% 할인 배너", clickRate: 8.2, conversionRate: 2.5, roi: 156, channel: "Instagram" },
  { id: "2", name: "제품 소개 영상", clickRate: 7.5, conversionRate: 3.1, roi: 142, channel: "TikTok" },
  { id: "3", name: "이벤트 안내 카드", clickRate: 5.8, conversionRate: 1.8, roi: 98, channel: "Facebook" },
  { id: "4", name: "브랜드 스토리", clickRate: 4.2, conversionRate: 1.2, roi: 72, channel: "Blog" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ContentData;
    return (
      <div className="glass border border-border/40 rounded-lg px-4 py-3 text-sm min-w-[180px]">
        <p className="font-semibold mb-2">{data.name}</p>
        <p className="text-xs text-muted-foreground mb-2">{data.channel}</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">클릭률</span>
            <span className="font-semibold text-primary">{data.clickRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">전환율</span>
            <span className="font-semibold text-secondary">{data.conversionRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">투자 대비 수익</span>
            <span className={`font-semibold ${data.roi >= 100 ? "text-green-500" : "text-yellow-500"}`}>
              +{data.roi}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ContentEfficiencyChart = ({ data = defaultData }: ContentEfficiencyChartProps) => {
  const sortedData = [...data].sort((a, b) => b.clickRate - a.clickRate);
  const bestContent = sortedData[0];
  const worstContent = sortedData[sortedData.length - 1];

  return (
    <div className="space-y-6">
      {/* 차트 */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, "auto"]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">
                  {value === "clickRate" ? "클릭률" : "전환율"}
                </span>
              )}
            />
            <Bar
              dataKey="clickRate"
              name="clickRate"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
              barSize={16}
            />
            <Bar
              dataKey="conversionRate"
              name="conversionRate"
              fill="hsl(var(--secondary))"
              radius={[0, 4, 4, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 인사이트 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 최고 성과 */}
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">최고 성과 콘텐츠</span>
          </div>
          <p className="font-semibold">{bestContent.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {bestContent.channel} · 클릭률 {bestContent.clickRate}% · 투자 대비 수익 +{bestContent.roi}%
          </p>
        </div>

        {/* 개선 필요 */}
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-500">개선이 필요한 콘텐츠</span>
          </div>
          <p className="font-semibold">{worstContent.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {worstContent.channel} · 클릭률 {worstContent.clickRate}% · 투자 대비 수익 +{worstContent.roi}%
          </p>
        </div>
      </div>

      {/* 팁 */}
      <p className="text-sm text-muted-foreground border-t border-border/20 pt-4">
        💡 <span className="text-primary font-medium">{bestContent.name}</span> 스타일의 콘텐츠를 더 만들어 보세요.
        {bestContent.channel}에서 특히 효과가 좋습니다.
      </p>
    </div>
  );
};

export default ContentEfficiencyChart;
