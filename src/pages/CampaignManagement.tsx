import { useState } from "react";
import { ArrowLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CreateCampaignDialog from "@/components/CreateCampaignDialog";
import CampaignCard from "@/components/CampaignCard";
import CampaignCalendar from "@/components/CampaignCalendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  description: string;
  channels: string[];
  budget: number;
  status: "활성" | "일시정지" | "완료" | "초안";
  startDate: Date;
  endDate: Date;
  contentIds: string[];
}

interface ScheduledPost {
  id: string;
  campaignName: string;
  channel: string;
  date: Date;
}

const CampaignManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<"전체" | Campaign["status"]>("전체");

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "여름 세일 캠페인",
      description: "6월 여름 시즌 특별 할인 프로모션",
      channels: ["instagram", "facebook", "twitter"],
      budget: 5000000,
      status: "활성",
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-06-30"),
      contentIds: ["1", "2"],
    },
    {
      id: "2",
      name: "신제품 론칭",
      description: "신제품 출시 기념 마케팅 캠페인",
      channels: ["instagram", "facebook", "twitter", "linkedin", "email"],
      budget: 10000000,
      status: "활성",
      startDate: new Date("2024-06-10"),
      endDate: new Date("2024-07-10"),
      contentIds: ["3", "4"],
    },
    {
      id: "3",
      name: "브랜드 인지도",
      description: "브랜드 인지도 향상을 위한 장기 캠페인",
      channels: ["instagram", "blog"],
      budget: 3000000,
      status: "일시정지",
      startDate: new Date("2024-05-01"),
      endDate: new Date("2024-08-01"),
      contentIds: ["1"],
    },
    {
      id: "4",
      name: "할인 프로모션",
      description: "기간 한정 특가 프로모션",
      channels: ["email", "google-ads", "naver-ads", "facebook"],
      budget: 7000000,
      status: "완료",
      startDate: new Date("2024-05-01"),
      endDate: new Date("2024-05-31"),
      contentIds: ["2", "4"],
    },
    {
      id: "5",
      name: "Q4 마케팅",
      description: "4분기 종합 마케팅 전략",
      channels: ["instagram", "facebook", "twitter", "linkedin", "email", "blog"],
      budget: 20000000,
      status: "초안",
      startDate: new Date("2024-10-01"),
      endDate: new Date("2024-12-31"),
      contentIds: [],
    },
  ]);

  const scheduledPosts: ScheduledPost[] = [
    { id: "1", campaignName: "여름 세일 캠페인", channel: "Instagram", date: new Date("2024-06-15T14:00:00") },
    { id: "2", campaignName: "신제품 론칭", channel: "Facebook", date: new Date("2024-06-15T16:00:00") },
    { id: "3", campaignName: "여름 세일 캠페인", channel: "Twitter", date: new Date("2024-06-16T10:00:00") },
    { id: "4", campaignName: "신제품 론칭", channel: "Email", date: new Date("2024-06-16T09:00:00") },
    { id: "5", campaignName: "브랜드 인지도", channel: "LinkedIn", date: new Date("2024-06-17T11:00:00") },
  ];

  const filters: Array<"전체" | Campaign["status"]> = ["전체", "활성", "일시정지", "완료", "초안"];

  const filteredCampaigns =
    selectedFilter === "전체"
      ? campaigns
      : campaigns.filter((campaign) => campaign.status === selectedFilter);

  const handleCreateCampaign = (newCampaign: Campaign) => {
    setCampaigns([newCampaign, ...campaigns]);
  };

  const handleStatusChange = (id: string, status: Campaign["status"]) => {
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, status } : campaign
      )
    );
    toast({
      title: "상태 변경 완료",
      description: `캠페인 상태가 "${status}"로 변경되었습니다.`,
    });
  };

  const handleDelete = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    setCampaigns(campaigns.filter((c) => c.id !== id));
    toast({
      title: "캠페인 삭제",
      description: `"${campaign?.name}" 캠페인이 삭제되었습니다.`,
    });
  };

  const handleDateSelect = (date: Date) => {
    console.log("Selected date:", date);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div
        className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "1s" }}
      />

      <Navigation />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="glass border-border/40 hover:border-primary/40 rounded-lg p-2 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-2">캠페인 관리</h1>
              <p className="text-muted-foreground">
                다채널 마케팅 캠페인을 생성하고 관리하세요
              </p>
            </div>
          </div>
          <CreateCampaignDialog onCreateCampaign={handleCreateCampaign} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <Filter className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <Button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                variant={selectedFilter === filter ? "default" : "outline"}
                className={
                  selectedFilter === filter
                    ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                    : "glass border-border/40 hover:border-primary/40"
                }
              >
                {filter}
              </Button>
            ))}
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            총 {filteredCampaigns.length}개 캠페인
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <CampaignCalendar scheduledPosts={scheduledPosts} onDateSelect={handleDateSelect} />
        </div>

        {/* Campaigns Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {selectedFilter === "전체" ? "모든 캠페인" : `${selectedFilter} 캠페인`}
          </h2>
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, index) => (
                <div key={campaign.id} style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                  <CampaignCard
                    campaign={campaign}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass border-border/40 rounded-xl p-12 text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">캠페인이 없습니다</h3>
              <p className="text-muted-foreground mb-6">
                {selectedFilter === "전체"
                  ? "새로운 캠페인을 생성해보세요"
                  : `"${selectedFilter}" 상태의 캠페인이 없습니다`}
              </p>
              <CreateCampaignDialog onCreateCampaign={handleCreateCampaign} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CampaignManagement;
