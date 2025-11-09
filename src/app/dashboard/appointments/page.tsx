"use client";

import { useState } from "react";
import { Calendar, List, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCalendar from "./components/AppointmentCalendar";
import AppointmentList from "./components/AppointmentList";
import AppointmentModal from "./components/AppointmentModal";
import AppointmentFilters from "./components/AppointmentFilters";
import StatusUpdateModal from "./components/StatusUpdateModal";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface Stylist {
  id: string;
  name: string;
  specialties: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  client: Client;
  serviceId: string;
  service: Service;
  stylistId: string;
  stylist: Stylist;
  date: string;
  time: string;
  status:
    | "scheduled"
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "no-show";
  notes?: string;
  createdAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      clientId: "1",
      client: {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1234567890",
      },
      serviceId: "1",
      service: { id: "1", name: "Hair Cut & Color", duration: 120, price: 85 },
      stylistId: "1",
      stylist: {
        id: "1",
        name: "Emma Wilson",
        specialties: ["Hair Coloring", "Styling"],
      },
      date: "2025-08-24",
      time: "10:30",
      status: "confirmed",
      notes: "First time client, prefers natural colors",
      createdAt: "2025-08-20T10:00:00Z",
    },
    {
      id: "2",
      clientId: "2",
      client: {
        id: "2",
        name: "Michael Brown",
        email: "michael@example.com",
        phone: "+1234567891",
      },
      serviceId: "2",
      service: { id: "2", name: "Beard Trim", duration: 30, price: 25 },
      stylistId: "2",
      stylist: {
        id: "2",
        name: "James Lee",
        specialties: ["Men's Cuts", "Beard Styling"],
      },
      date: "2025-08-24",
      time: "11:00",
      status: "scheduled",
      createdAt: "2025-08-22T14:30:00Z",
    },
    {
      id: "3",
      clientId: "3",
      client: {
        id: "3",
        name: "Lisa Davis",
        email: "lisa@example.com",
        phone: "+1234567892",
      },
      serviceId: "3",
      service: {
        id: "3",
        name: "Manicure & Pedicure",
        duration: 90,
        price: 60,
      },
      stylistId: "3",
      stylist: {
        id: "3",
        name: "Anna Smith",
        specialties: ["Nail Art", "Spa Treatments"],
      },
      date: "2025-08-24",
      time: "11:30",
      status: "confirmed",
      createdAt: "2025-08-23T09:15:00Z",
    },
    {
      id: "4",
      clientId: "4",
      client: {
        id: "4",
        name: "David Wilson",
        email: "david@example.com",
        phone: "+1234567893",
      },
      serviceId: "4",
      service: { id: "4", name: "Hair Styling", duration: 45, price: 40 },
      stylistId: "1",
      stylist: {
        id: "1",
        name: "Emma Wilson",
        specialties: ["Hair Coloring", "Styling"],
      },
      date: "2025-08-25",
      time: "14:00",
      status: "in-progress",
      createdAt: "2025-08-24T12:00:00Z",
    },
    {
      id: "5",
      clientId: "5",
      client: {
        id: "5",
        name: "Jennifer Miller",
        email: "jennifer@example.com",
        phone: "+1234567894",
      },
      serviceId: "5",
      service: { id: "5", name: "Facial Treatment", duration: 75, price: 65 },
      stylistId: "4",
      stylist: {
        id: "4",
        name: "Maria Garcia",
        specialties: ["Skincare", "Facials"],
      },
      date: "2025-08-25",
      time: "15:30",
      status: "scheduled",
      createdAt: "2025-08-24T16:20:00Z",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [statusUpdateAppointment, setStatusUpdateAppointment] =
    useState<Appointment | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    stylist: "all",
    dateRange: "today",
  });

  const todayAppointments = appointments.filter(
    (apt) => apt.date === "2025-08-24"
  );
  const totalRevenue = todayAppointments.reduce(
    (sum, apt) => sum + apt.service.price,
    0
  );
  const completedAppointments = todayAppointments.filter(
    (apt) => apt.status === "completed"
  ).length;
  const pendingAppointments = todayAppointments.filter(
    (apt) => apt.status === "scheduled" || apt.status === "confirmed"
  ).length;

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setIsAddModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsAddModalOpen(true);
  };

  const handleStatusUpdate = (appointment: Appointment) => {
    setStatusUpdateAppointment(appointment);
  };

  const handleSaveAppointment = (
    appointmentData: Omit<Appointment, "id" | "createdAt">
  ) => {
    if (editingAppointment) {
      setAppointments(
        appointments.map((apt) =>
          apt.id === editingAppointment.id
            ? {
                ...appointmentData,
                id: editingAppointment.id,
                createdAt: editingAppointment.createdAt,
              }
            : apt
        )
      );
    } else {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setAppointments([...appointments, newAppointment]);
    }
    setIsAddModalOpen(false);
  };

  const handleUpdateStatus = (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
    setStatusUpdateAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Appointments
            </h1>
            <p className="text-slate-600">
              Manage your salon appointments and schedule
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <AppointmentFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
            <Button
              onClick={handleAddAppointment}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Today&apos;s Appointments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {todayAppointments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Completed Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {completedAppointments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {pendingAppointments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Revenue Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${totalRevenue}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Schedule Management</CardTitle>
              <Tabs
                value={viewMode}
                onValueChange={(value) =>
                  setViewMode(value as "calendar" | "list")
                }
              >
                <TabsList>
                  <TabsTrigger
                    value="calendar"
                    className="flex items-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Calendar</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="flex items-center space-x-2"
                  >
                    <List className="w-4 h-4" />
                    <span>List</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "calendar" ? (
              <AppointmentCalendar
                appointments={appointments}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onAppointmentClick={handleEditAppointment}
                onStatusUpdate={handleStatusUpdate}
              />
            ) : (
              <AppointmentList
                appointments={appointments}
                filters={filters}
                onEdit={handleEditAppointment}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDeleteAppointment}
              />
            )}
          </CardContent>
        </Card>

        <AppointmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveAppointment}
          appointment={editingAppointment}
        />

        <StatusUpdateModal
          isOpen={!!statusUpdateAppointment}
          onClose={() => setStatusUpdateAppointment(null)}
          appointment={statusUpdateAppointment}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
}
