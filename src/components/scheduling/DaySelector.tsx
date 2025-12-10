import { format, isSameDay, isBefore, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Appointment } from "@/lib/mockData";

interface DaySelectorProps {
  days: Date[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  appointments: Appointment[];
}

export const DaySelector = ({ days, selectedDate, onSelectDate, appointments }: DaySelectorProps) => {
  const today = startOfDay(new Date());

  const hasAppointment = (date: Date) => {
    return appointments.some(apt => apt.date === format(date, "yyyy-MM-dd"));
  };

  const isPastDate = (date: Date) => {
    return isBefore(startOfDay(date), today);
  };

  return (
    <div className="grid grid-cols-7 gap-2 sm:gap-3 animate-fade-in">
      {days.map((day, index) => {
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isPast = isPastDate(day);
        const hasBooking = hasAppointment(day);
        const isToday = isSameDay(day, today);

        let variant: "day" | "daySelected" | "dayPast" = "day";
        if (isSelected) variant = "daySelected";
        else if (isPast) variant = "dayPast";

        return (
          <Button
            key={day.toISOString()}
            variant={variant}
            onClick={() => !isPast && onSelectDate(day)}
            disabled={isPast}
            className={cn(
              "flex flex-col h-auto py-3 px-2 sm:px-4 relative",
              isToday && !isSelected && "ring-2 ring-primary/30",
              hasBooking && !isPast && "border-success"
            )}
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {format(day, "EEE")}
            </span>
            <span className="text-lg font-bold mt-1">
              {format(day, "d")}
            </span>
            {hasBooking && (
              <span className={cn(
                "absolute -top-1 -right-1 w-3 h-3 rounded-full",
                isPast ? "bg-past" : "bg-success animate-pulse-soft"
              )} />
            )}
          </Button>
        );
      })}
    </div>
  );
};
