"use client";

import {
  Edit2,
  Trash2,
  Clock,
  User,
  Phone,
  Mail,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment } from "../page";

interface AppointmentListProps {
  appointments: Appointment[];
  filters: {
    status: string;
    stylist: string;
    dateRange: string;
  };
  onEdit: (appointment: Appointment) => void;
  onStatusUpdate: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

export default function AppointmentList({
  appointments,
  filters,
  onEdit,
  onStatusUpdate,
  onDelete,
}: AppointmentListProps) {
  const getStatusColor = (status: Appointment["status"]) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      confirmed: "bg-green-100 text-green-800 hover:bg-green-200",
      "in-progress": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      completed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
      "no-show": "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };
    return colors[status];
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (filters.status !== "all") {
      filtered = filtered.filter((apt) => apt.status === filters.status);
    }

    if (filters.stylist !== "all") {
      filtered = filtered.filter((apt) => apt.stylistId === filters.stylist);
    }

    if (filters.dateRange === "today") {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((apt) => apt.date === today);
    } else if (filters.dateRange === "week") {
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.date);
        return aptDate >= today && aptDate <= weekFromNow;
      });
    }

    return filtered.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      return a.time.localeCompare(b.time);
    });
  };

  const filteredAppointments = filterAppointments();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Stylist</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-700">
                        {appointment.client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.client.name}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Phone className="w-3 h-3" />
                        <span>{appointment.client.phone}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {appointment.service.name}
                    </div>
                    {appointment.notes && (
                      <div className="text-sm text-gray-500 mt-1">
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {appointment.stylist.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.stylist.specialties.join(", ")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDate(appointment.date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(appointment.time)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {appointment.service.duration} min
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900">
                    ${appointment.service.price}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(appointment)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Appointment
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusUpdate(appointment)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel Appointment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No appointments found matching your filters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
