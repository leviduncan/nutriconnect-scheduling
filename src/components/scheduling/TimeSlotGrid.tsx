import { Button } from "@/components/ui/button";
import { TimeSlot } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Clock, Sun, Sunset, Moon } from "lucide-react";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
  isPastDate: boolean;
  existingAppointmentTime?: string | null;
}

const periodIcons = {
  Morning: Sun,
  Afternoon: Sunset,
  Evening: Moon,
};

export const TimeSlotGrid = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isPastDate,
  existingAppointmentTime,
}: TimeSlotGridProps) => {
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.period]) acc[slot.period] = [];
    acc[slot.period].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const periods = ["Morning", "Afternoon", "Evening"] as const;

  return (
    <div className="space-y-6 animate-slide-up">
      {periods.map((period) => {
        const periodSlots = groupedSlots[period] || [];
        const Icon = periodIcons[period];
        
        if (periodSlots.length === 0) return null;

        return (
          <div key={period} className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                {period}
              </h3>
              <div className="flex-1 h-px bg-border ml-2" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {periodSlots.map((slot, index) => {
                const isSelected = selectedSlot === slot.id;
                const isExistingAppointment = existingAppointmentTime === slot.time;
                const isDisabled = isPastDate || !slot.available;

                let variant: "timeSlot" | "timeSlotSelected" | "timeSlotPast" = "timeSlot";
                if (isSelected || isExistingAppointment) variant = "timeSlotSelected";
                else if (isDisabled) variant = "timeSlotPast";

                return (
                  <Button
                    key={slot.id}
                    variant={variant}
                    onClick={() => !isDisabled && onSelectSlot(slot.id)}
                    disabled={isDisabled}
                    className={cn(
                      "opacity-0 animate-scale-in",
                      `stagger-${(index % 6) + 1}`,
                      isExistingAppointment && "ring-2 ring-success"
                    )}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                    {slot.time}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
