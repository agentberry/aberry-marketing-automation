interface FunnelStage {
  name: string;
  value: number;
  color: string;
}

interface ConversionFunnelChartProps {
  data: FunnelStage[];
}

const ConversionFunnelChart = ({ data }: ConversionFunnelChartProps) => {
  const maxValue = data[0]?.value || 1;

  return (
    <div className="w-full space-y-4">
      {data.map((stage, index) => {
        const percentage = ((stage.value / maxValue) * 100).toFixed(1);
        const dropoff = index > 0 ? ((data[index - 1].value - stage.value) / data[index - 1].value * 100).toFixed(1) : 0;

        return (
          <div key={stage.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{stage.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">{stage.value.toLocaleString()}</span>
                <span className="text-primary font-semibold">{percentage}%</span>
              </div>
            </div>
            <div className="relative h-12 glass border border-border/40 rounded-lg overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 transition-all duration-500 flex items-center justify-center"
                style={{
                  width: `${percentage}%`,
                  background: `linear-gradient(135deg, ${stage.color}, ${stage.color}dd)`,
                }}
              >
                {parseFloat(percentage) > 20 && (
                  <span className="text-white font-semibold text-sm">{stage.value.toLocaleString()}</span>
                )}
              </div>
            </div>
            {index > 0 && parseFloat(String(dropoff)) > 0 && (
              <div className="text-xs text-muted-foreground">
                ↓ {dropoff}% 이탈
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ConversionFunnelChart;
