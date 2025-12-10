import { addDays, subDays, format, startOfWeek } from "date-fns";

export interface TimeSlot {
  id: string;
  time: string;
  period: "Morning" | "Afternoon" | "Evening";
  available: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  professional: string;
  type: string;
  isPast: boolean;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

export const professionals: Professional[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    specialty: "Clinical Nutritionist",
    avatar: "SM",
  },
  {
    id: "2",
    name: "Dr. James Rodriguez",
    specialty: "Dietary Counselor",
    avatar: "JR",
  },
  {
    id: "3",
    name: "Dr. Emily Chen",
    specialty: "Sports Nutritionist",
    avatar: "EC",
  },
];

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const dayOfWeek = date.getDay();
  const slots: TimeSlot[] = [];

  // Morning slots (9 AM - 12 PM)
  const morningTimes = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
  morningTimes.forEach((time, i) => {
    slots.push({
      id: `morning-${i}`,
      time,
      period: "Morning",
      available: dayOfWeek !== 0 && Math.random() > 0.3,
    });
  });

  // Afternoon slots (1 PM - 5 PM)
  const afternoonTimes = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];
  afternoonTimes.forEach((time, i) => {
    slots.push({
      id: `afternoon-${i}`,
      time,
      period: "Afternoon",
      available: dayOfWeek !== 0 && Math.random() > 0.25,
    });
  });

  // Evening slots (5 PM - 8 PM)
  const eveningTimes = ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"];
  eveningTimes.forEach((time, i) => {
    slots.push({
      id: `evening-${i}`,
      time,
      period: "Evening",
      available: dayOfWeek !== 0 && dayOfWeek !== 6 && Math.random() > 0.35,
    });
  });

  return slots;
};

export const getTimeSlotsForDate = (date: Date): TimeSlot[] => {
  return generateTimeSlots(date);
};

const today = new Date();

export const mockAppointments: Appointment[] = [
  {
    id: "past-1",
    date: format(subDays(today, 14), "yyyy-MM-dd"),
    time: "10:00 AM",
    professional: "Dr. Sarah Mitchell",
    type: "Initial Consultation",
    isPast: true,
  },
  {
    id: "past-2",
    date: format(subDays(today, 7), "yyyy-MM-dd"),
    time: "2:30 PM",
    professional: "Dr. James Rodriguez",
    type: "Follow-up Session",
    isPast: true,
  },
  {
    id: "past-3",
    date: format(subDays(today, 3), "yyyy-MM-dd"),
    time: "11:00 AM",
    professional: "Dr. Emily Chen",
    type: "Nutrition Plan Review",
    isPast: true,
  },
  {
    id: "future-1",
    date: format(addDays(today, 2), "yyyy-MM-dd"),
    time: "3:00 PM",
    professional: "Dr. Sarah Mitchell",
    type: "Weekly Check-in",
    isPast: false,
  },
  {
    id: "future-2",
    date: format(addDays(today, 9), "yyyy-MM-dd"),
    time: "10:30 AM",
    professional: "Dr. Emily Chen",
    type: "Progress Review",
    isPast: false,
  },
];

export const getWeekDays = (weekStart: Date) => {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

export const getCurrentWeekStart = () => {
  return startOfWeek(new Date(), { weekStartsOn: 0 });
};
