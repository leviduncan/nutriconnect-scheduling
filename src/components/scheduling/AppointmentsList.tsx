import { format, parseISO } from "date-fns";
import { Calendar, Clock, User, CheckCircle2, Edit2, Lock } from "lucide-react";
import { Appointment } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppointmentsListProps {
  appointments: Appointment[];
  onEditAppointment: (id: string) => void;
}

export const AppointmentsList = ({ appointments, onEditAppointment }: AppointmentsListProps) => {
  const pastAppointments = appointments.filter(apt => apt.isPast);
  const futureAppointments = appointments.filter(apt => !apt.isPast);

  const AppointmentCard = ({ appointment, index }: { appointment: Appointment; index: number }) => (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300 opacity-0 animate-fade-in",
        appointment.isPast
          ? "bg-past/5 border-past/30"
          : "bg-card border-border hover:border-primary/30 hover:shadow-card",
        `stagger-${(index % 5) + 1}`
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl",
          appointment.isPast ? "bg-past/10" : "bg-primary/10"
        )}>
          <Calendar className={cn(
            "h-5 w-5",
            appointment.isPast ? "text-past-foreground" : "text-primary"
          )} />
        </div>
        
        <div className="space-y-1">
          <p className={cn(
            "font-semibold",
            appointment.isPast ? "text-past-foreground" : "text-foreground"
          )}>
            {appointment.type}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {format(parseISO(appointment.date), "MMM d, yyyy")} at {appointment.time}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {appointment.professional}
            </span>
          </div>
        </div>
      </div>

      {appointment.isPast ? (
        <div className="flex items-center gap-2 text-past-foreground">
          <Lock className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">Completed</span>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditAppointment(appointment.id)}
          className="text-primary hover:bg-primary/10"
        >
          <Edit2 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {futureAppointments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h3 className="text-lg font-semibold text-foreground">Upcoming Appointments</h3>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-sm font-medium">
              {futureAppointments.length}
            </span>
          </div>
          <div className="space-y-3">
            {futureAppointments.map((apt, i) => (
              <AppointmentCard key={apt.id} appointment={apt} index={i} />
            ))}
          </div>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-past" />
            <h3 className="text-lg font-semibold text-muted-foreground">Past Appointments</h3>
            <span className="px-2 py-0.5 rounded-full bg-past/10 text-past-foreground text-sm font-medium">
              {pastAppointments.length}
            </span>
          </div>
          <div className="space-y-3">
            {pastAppointments.map((apt, i) => (
              <AppointmentCard key={apt.id} appointment={apt} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
