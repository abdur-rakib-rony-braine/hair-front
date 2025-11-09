"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Appointment, Client, Service, Stylist } from "../page";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, "id" | "createdAt">) => void;
  appointment?: Appointment | null;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSave,
  appointment,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    clientId: "",
    serviceId: "",
    stylistId: "",
    date: "",
    time: "",
    status: "scheduled" as Appointment["status"],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data - in real app, this would come from API
  const clients: Client[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1234567890",
    },
    {
      id: "2",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1234567891",
    },
    {
      id: "3",
      name: "Lisa Davis",
      email: "lisa@example.com",
      phone: "+1234567892",
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1234567893",
    },
  ];

  const services: Service[] = [
    { id: "1", name: "Hair Cut & Color", duration: 120, price: 85 },
    { id: "2", name: "Beard Trim", duration: 30, price: 25 },
    { id: "3", name: "Manicure & Pedicure", duration: 90, price: 60 },
    { id: "4", name: "Hair Styling", duration: 45, price: 40 },
    { id: "5", name: "Facial Treatment", duration: 75, price: 65 },
  ];

  const stylists: Stylist[] = [
    { id: "1", name: "Emma Wilson", specialties: ["Hair Coloring", "Styling"] },
    {
      id: "2",
      name: "James Lee",
      specialties: ["Men's Cuts", "Beard Styling"],
    },
    {
      id: "3",
      name: "Anna Smith",
      specialties: ["Nail Art", "Spa Treatments"],
    },
    { id: "4", name: "Maria Garcia", specialties: ["Skincare", "Facials"] },
  ];

  useEffect(() => {
    if (appointment) {
      setFormData({
        clientId: appointment.clientId,
        serviceId: appointment.serviceId,
        stylistId: appointment.stylistId,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        notes: appointment.notes || "",
      });
    } else {
      setFormData({
        clientId: "",
        serviceId: "",
        stylistId: "",
        date: new Date().toISOString().split("T")[0],
        time: "",
        status: "scheduled",
        notes: "",
      });
    }
    setErrors({});
  }, [appointment, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) newErrors.clientId = "Client is required";
    if (!formData.serviceId) newErrors.serviceId = "Service is required";
    if (!formData.stylistId) newErrors.stylistId = "Stylist is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";

    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.date = "Cannot schedule appointments in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const client = clients.find((c) => c.id === formData.clientId)!;
      const service = services.find((s) => s.id === formData.serviceId)!;
      const stylist = stylists.find((s) => s.id === formData.stylistId)!;

      onSave({
        clientId: formData.clientId,
        client,
        serviceId: formData.serviceId,
        service,
        stylistId: formData.stylistId,
        stylist,
        date: formData.date,
        time: formData.time,
        status: formData.status,
        notes: formData.notes,
      });
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "New Appointment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => handleInputChange("clientId", value)}
              >
                <SelectTrigger
                  className={errors.clientId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && (
                <p className="text-sm text-red-500">{errors.clientId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select
                value={formData.serviceId}
                onValueChange={(value) => handleInputChange("serviceId", value)}
              >
                <SelectTrigger
                  className={errors.serviceId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price} ({service.duration}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceId && (
                <p className="text-sm text-red-500">{errors.serviceId}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stylist">Stylist</Label>
            <Select
              value={formData.stylistId}
              onValueChange={(value) => handleInputChange("stylistId", value)}
            >
              <SelectTrigger
                className={errors.stylistId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a stylist" />
              </SelectTrigger>
              <SelectContent>
                {stylists.map((stylist) => (
                  <SelectItem key={stylist.id} value={stylist.id}>
                    {stylist.name} - {stylist.specialties.join(", ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stylistId && (
              <p className="text-sm text-red-500">{errors.stylistId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => handleInputChange("time", value)}
              >
                <SelectTrigger className={errors.time ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      {new Date(`2000-01-01T${time}:00`).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleInputChange("status", value as Appointment["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Add any special notes or requirements..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {appointment ? "Update Appointment" : "Create Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
