import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ScheduledPost {
  id: string;
  campaignName: string;
  channel: string;
  date: Date;
}

interface CampaignCalendarProps {
  scheduledPosts: ScheduledPost[];
  onDateSelect: (date: Date) => void;
}

const CampaignCalendar = ({ scheduledPosts, onDateSelect }: CampaignCalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateSelect(selectedDate);
    }
  };

  const getPostsForDate = (checkDate: Date) => {
    return scheduledPosts.filter(
      (post) =>
        format(post.date, "yyyy-MM-dd") === format(checkDate, "yyyy-MM-dd")
    );
  };

  const postsForSelectedDate = getPostsForDate(date);

  return (
    <div className="glass border-border/40 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">캠페인 캘린더</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal glass border-border/40",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>날짜 선택</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 glass border-border/40" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <div className="mt-4 p-4 glass border border-border/40 rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">예약된 게시물 통계</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>이번 주:</span>
                <span className="font-semibold">12개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>이번 달:</span>
                <span className="font-semibold">48개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>총 예약:</span>
                <span className="font-semibold">{scheduledPosts.length}개</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts for selected date */}
        <div>
          <h3 className="text-sm font-semibold mb-3">
            {format(date, "M월 d일")} 예정 게시물
          </h3>
          {postsForSelectedDate.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {postsForSelectedDate.map((post) => (
                <div
                  key={post.id}
                  className="p-3 glass border border-border/40 rounded-lg hover:border-primary/40 transition-all"
                >
                  <div className="font-medium text-sm mb-1">{post.campaignName}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{post.channel}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(post.date, "HH:mm")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center glass border border-border/40 rounded-lg">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                이 날짜에 예약된 게시물이 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCalendar;
