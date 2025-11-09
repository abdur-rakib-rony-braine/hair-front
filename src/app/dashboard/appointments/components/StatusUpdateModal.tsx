"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, User, Calendar } from "lucide-react";
import { Appointment } from "../page";

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onUpdateStatus: (
    appointmentId: string,
    newStatus: Appointment["status"]
  ) => void;
}

export default function StatusUpdateModal({
  isOpen,
  onClose,
  appointment,
  onUpdateStatus,
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<Appointment["status"]>("scheduled");

  const statusOptions = [
    {
      value: "scheduled" as const,
      label: "Scheduled",
      description: "Appointment is booked but not confirmed",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "confirmed" as const,
      label: "Confirmed",
      description: "Client has confirmed the appointment",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "in-progress" as const,
      label: "In Progress",
      description: "Service is currently being performed",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "completed" as const,
      label: "Completed",
      description: "Service has been completed successfully",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      value: "cancelled" as const,
      label: "Cancelled",
      description: "Appointment was cancelled by client or salon",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "no-show" as const,
      label: "No Show",
      description: "Client did not show up for appointment",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  const handleSubmit = () => {
    if (appointment && selectedStatus) {
      onUpdateStatus(appointment.id, selectedStatus);
      onClose();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Appointment Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{appointment.client.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatDate(appointment.date)} at {formatTime(appointment.time)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {appointment.service.name} with {appointment.stylist.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Current Status:</span>
              <Badge
                className={
                  statusOptions.find((s) => s.value === appointment.status)
                    ?.color
                }
              >
                {appointment.status.replace("-", " ")}
              </Badge>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select New Status</Label>
            <RadioGroup
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as Appointment["status"])
              }
              className="space-y-3"
            >
              {statusOptions.map((status) => (
                <div key={status.value} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={status.value}
                    id={status.value}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={status.value}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {status.label}
                    </Label>
                    <p className="text-xs text-gray-500">
                      {status.description}
                    </p>
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!selectedStatus}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
