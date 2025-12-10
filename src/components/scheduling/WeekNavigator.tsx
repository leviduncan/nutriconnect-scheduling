import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addWeeks, subWeeks, endOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";

interface WeekNavigatorProps {
  weekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
  canGoBack: boolean;
}

export const WeekNavigator = ({ weekStart, onWeekChange, canGoBack }: WeekNavigatorProps) => {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

  const handlePrevWeek = () => {
    if (canGoBack) {
      onWeekChange(subWeeks(weekStart, 1));
    }
  };

  const handleNextWeek = () => {
    onWeekChange(addWeeks(weekStart, 1));
  };

  return (
    <div className="flex items-center justify-center gap-4 animate-fade-in">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevWeek}
        disabled={!canGoBack}
        className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="min-w-[200px] text-center">
        <span className="text-lg font-semibold text-foreground">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextWeek}
        className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
