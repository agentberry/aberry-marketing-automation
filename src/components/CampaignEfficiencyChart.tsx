import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

interface CampaignData {
  id: string;
  name: string;
  clickRate: number;
  topContent: {
    name: string;
    channel: string;
    clickRate: number;
  };
}

const campaignData: CampaignData[] = [
  {
    id: "1",
    name: "여름 세일",
    clickRate: 6.8,
    topContent: { name: "50% 할인 배너", channel: "Instagram", clickRate: 8.2 },
  },
  {
    id: "2",
    name: "신제품 론칭",
    clickRate: 5.9,
    topContent: { name: "제품 소개 영상", channel: "TikTok", clickRate: 7.5 },
  },
  {
    id: "3",
    name: "브랜드 인지도",
    clickRate: 4.2,
    topContent: { name: "브랜드 스토리", channel: "Blog", clickRate: 5.1 },
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CampaignData;
    return (
      <div className="glass border border-border/40 rounded-lg px-4 py-3 text-sm min-w-[200px]">
        <p className="font-semibold mb-2">{data.name}</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">평균 클릭률</span>
            <span className="font-semibold text-primary">{data.clickRate}%</span>
          </div>
          <div className="pt-2 border-t border-border/20 mt-2">
            <p className="text-muted-foreground mb-1">최고 성과 콘텐츠</p>
            <p className="font-medium">{data.topContent.name}</p>
            <p className="text-muted-foreground">
              {data.topContent.channel} · {data.topContent.clickRate}%
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CampaignEfficiencyChart = () => {
  const navigate = useNavigate();
  const maxValue = Math.max(...campaignData.map((d) => d.clickRate));
  const bestCampaign = campaignData[0];

  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
  ];

  return (
    <div className="glass border-border/40 rounded-xl p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">캠페인별 효율 비교</h2>
          <p className="text-sm text-muted-foreground mt-1">
            클릭률 기준 · 캠페인을 클릭하면 상세 보기
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">최고 효율 캠페인</p>
          <p className="text-lg font-bold text-primary">{bestCampaign.name}</p>
        </div>
      </div>

      <div className="h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={campaignData}
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
              cursor="pointer"
              onClick={(data) => navigate(`/campaigns/${data.id}`)}
              label={{
                position: "right",
                fill: "hsl(var(--foreground))",
                fontSize: 13,
                fontWeight: 600,
                formatter: (value: number) => `${value}%`,
              }}
            >
              {campaignData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  opacity={index === 0 ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border/20">
        💡 <span className="text-primary font-medium">{bestCampaign.name}</span> 캠페인의 콘텐츠 전략을 다른 캠페인에도 적용해보세요
      </p>
    </div>
  );
};

export default CampaignEfficiencyChart;
