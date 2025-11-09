"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment } from "../page";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  onStatusUpdate: (appointment: Appointment) => void;
}

export default function AppointmentCalendar({
  appointments,
  selectedDate,
  onDateSelect,
  onAppointmentClick,
  onStatusUpdate,
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return appointments.filter((apt) => apt.date === dateStr);
  };

  const getStatusColor = (status: Appointment["status"]) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
      "no-show": "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">{monthYear}</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("prev")}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth("next")}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const isCurrentMonth =
                    day.getMonth() === currentDate.getMonth();
                  const isSelected =
                    formatDate(day) === formatDate(selectedDate);
                  const isToday = formatDate(day) === formatDate(new Date());
                  const dayAppointments = getAppointmentsForDate(day);

                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-1 border border-gray-100 cursor-pointer transition-colors ${
                        isCurrentMonth
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50"
                      } ${isSelected ? "ring-2 ring-purple-500" : ""}`}
                      onClick={() => onDateSelect(day)}
                    >
                      <div
                        className={`text-sm mb-1 ${
                          isCurrentMonth ? "text-gray-900" : "text-gray-400"
                        } ${isToday ? "font-bold text-purple-600" : ""}`}
                      >
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className="text-xs p-1 rounded bg-purple-100 text-purple-800 truncate"
                          >
                            {apt.time} - {apt.client.name}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              {selectedDateAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No appointments scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDateAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                      <Card
                        key={appointment.id}
                        className="border-l-4 border-l-purple-500"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">
                                  {appointment.time}
                                </span>
                                <Badge
                                  className={getStatusColor(appointment.status)}
                                >
                                  {appointment.status}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 mb-1">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">
                                  {appointment.client.name}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {appointment.service.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                with {appointment.stylist.name}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    onAppointmentClick(appointment)
                                  }
                                >
                                  Edit Appointment
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onStatusUpdate(appointment)}
                                >
                                  Update Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
