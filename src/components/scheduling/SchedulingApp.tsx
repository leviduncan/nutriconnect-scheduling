import { useState, useMemo, useEffect } from "react";
import { format, isBefore, startOfDay, isSameDay, addWeeks, startOfWeek } from "date-fns";
import { Calendar, Sparkles, Clock } from "lucide-react";
import { WeekNavigator } from "./WeekNavigator";
import { DaySelector } from "./DaySelector";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { AppointmentsList } from "./AppointmentsList";
import { Button } from "@/components/ui/button";
import { 
  mockAppointments, 
  getTimeSlotsForDate, 
  getWeekDays, 
  getCurrentWeekStart,
  Appointment,
  TimeSlot 
} from "@/lib/mockData";
import { toast } from "sonner";

export const SchedulingApp = () => {
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const today = startOfDay(new Date());
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  
  const canGoBack = !isBefore(startOfWeek(addWeeks(weekStart, -1), { weekStartsOn: 0 }), 
    startOfWeek(today, { weekStartsOn: 0 }));

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(getTimeSlotsForDate(selectedDate));
      setSelectedSlot(null);
    }
  }, [selectedDate]);

  const handleWeekChange = (newWeekStart: Date) => {
    setWeekStart(newWeekStart);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slotId: string) => {
    const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
    const existingForDay = appointments.find(apt => apt.date === dateStr && !apt.isPast);
    
    if (existingForDay) {
      toast.error("You already have an appointment on this day", {
        description: "Please edit or cancel your existing appointment first."
      });
      return;
    }
    
    setSelectedSlot(slotId);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot) return;

    const slot = timeSlots.find(s => s.id === selectedSlot);
    if (!slot) return;

    const newAppointment: Appointment = {
      id: `new-${Date.now()}`,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: slot.time,
      professional: "Dr. Sarah Mitchell",
      type: "Dietary Consultation",
      isPast: false,
    };

    setAppointments(prev => [...prev, newAppointment]);
    setSelectedSlot(null);
    
    toast.success("Appointment Booked!", {
      description: `${format(selectedDate, "EEEE, MMM d")} at ${slot.time}`,
    });
  };

  const handleEditAppointment = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      toast.info("Edit Mode", {
        description: "Select a new date and time for your appointment."
      });
      // Find the week containing this appointment
      const aptDate = new Date(apt.date);
      const aptWeekStart = startOfWeek(aptDate, { weekStartsOn: 0 });
      setWeekStart(aptWeekStart);
      setSelectedDate(aptDate);
      // Remove the appointment so user can rebook
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  const isPastDate = selectedDate ? isBefore(startOfDay(selectedDate), today) : false;
  
  const existingAppointment = selectedDate 
    ? appointments.find(apt => apt.date === format(selectedDate, "yyyy-MM-dd"))
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  NutriSchedule
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Dietary Counseling Appointments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">30 min sessions</span>
              <span className="sm:hidden">30m</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-10">
        {/* Scheduling Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Select an Appointment
            </h2>
            <p className="text-muted-foreground">
              Choose a date and time that works best for you
            </p>
          </div>

          {/* Week Navigator */}
          <WeekNavigator
            weekStart={weekStart}
            onWeekChange={handleWeekChange}
            canGoBack={canGoBack}
          />

          {/* Day Selector */}
          <DaySelector
            days={weekDays}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
            appointments={appointments}
          />

          {/* Time Slots */}
          {selectedDate && (
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    {format(selectedDate, "EEEE, MMMM d")}
                  </h3>
                </div>
                {isPastDate && (
                  <span className="px-3 py-1 rounded-full bg-past/10 text-past-foreground text-sm font-medium">
                    Past Date
                  </span>
                )}
              </div>

              {existingAppointment && !existingAppointment.isPast && (
                <div className="p-4 rounded-xl border-2 border-success bg-success/5 animate-scale-in">
                  <p className="text-sm font-medium text-success">
                    ✓ You have an appointment at {existingAppointment.time} with {existingAppointment.professional}
                  </p>
                </div>
              )}

              <TimeSlotGrid
                slots={timeSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={handleSlotSelect}
                isPastDate={isPastDate}
                existingAppointmentTime={existingAppointment?.time}
              />

              {/* Continue Button */}
              {selectedSlot && !isPastDate && (
                <div className="pt-4 animate-slide-up">
                  <Button
                    variant="accent"
                    size="xl"
                    onClick={handleConfirmBooking}
                    className="w-full sm:w-auto sm:min-w-[200px] mx-auto flex"
                  >
                    Confirm Booking
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Appointments List */}
        <section className="space-y-6 pt-6 border-t border-border">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground animate-fade-in">
              Your Appointments
            </h2>
            <p className="text-muted-foreground animate-fade-in stagger-1">
              View and manage your scheduled sessions
            </p>
          </div>

          <AppointmentsList
            appointments={appointments}
            onEditAppointment={handleEditAppointment}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-10">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 NutriSchedule. Professional Dietary Counseling Services.
          </p>
        </div>
      </footer>
    </div>
  );
};
