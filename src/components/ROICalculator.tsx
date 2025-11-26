import { useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ROICalculator = () => {
  const [investment, setInvestment] = useState("");
  const [revenue, setRevenue] = useState("");
  const [roi, setROI] = useState<number | null>(null);

  const calculateROI = () => {
    const investmentValue = parseFloat(investment);
    const revenueValue = parseFloat(revenue);

    if (investmentValue > 0 && revenueValue >= 0) {
      const calculatedROI = ((revenueValue - investmentValue) / investmentValue) * 100;
      setROI(calculatedROI);
    }
  };

  const getROIColor = (value: number) => {
    if (value >= 100) return "text-green-500";
    if (value >= 0) return "text-primary";
    return "text-destructive";
  };

  return (
    <div className="glass border-border/40 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">ROI 계산기</h3>
          <p className="text-sm text-muted-foreground">투자 수익률을 계산하세요</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="investment">투자 금액 (원)</Label>
          <Input
            id="investment"
            type="number"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            placeholder="5000000"
            className="glass border-border/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue">수익 금액 (원)</Label>
          <Input
            id="revenue"
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            placeholder="8000000"
            className="glass border-border/40"
          />
        </div>

        <Button
          onClick={calculateROI}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          계산하기
        </Button>

        {roi !== null && (
          <div className="glass border border-primary/20 rounded-lg p-6 bg-primary/5 animate-scale-in">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">투자 수익률 (ROI)</div>
              <div className={`text-4xl font-bold ${getROIColor(roi)}`}>
                {roi >= 0 ? "+" : ""}{roi.toFixed(2)}%
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {roi >= 100 && "🎉 훌륭한 수익률입니다!"}
                {roi >= 0 && roi < 100 && "👍 긍정적인 수익률입니다"}
                {roi < 0 && "⚠️ 손실이 발생했습니다"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ROICalculator;
