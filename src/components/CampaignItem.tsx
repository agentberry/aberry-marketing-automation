interface CampaignItemProps {
  name: string;
  channels: number;
  status: "활성" | "일시정지" | "완료" | "초안";
  logo: string;
}

const statusColors = {
  활성: "bg-green-500/10 text-green-500 border-green-500/20",
  일시정지: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  완료: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  초안: "bg-primary/10 text-primary border-primary/20",
};

const CampaignItem = ({ name, channels, status, logo }: CampaignItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 glass border border-border/40 rounded-lg hover:border-primary/40 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
          {logo}
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{channels} 채널</p>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
        {status}
      </div>
    </div>
  );
};

export default CampaignItem;
