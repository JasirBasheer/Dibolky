"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type IPlatforms } from "@/types";

interface RescheduleContentProps {
  platform?: IPlatforms | null;
  onSave?: (date: string, platformId: string) => void;
  onClose: () => void;
}

export default function RescheduleContent({
  platform,
  onSave,
  onClose,
}: RescheduleContentProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const handleSave = () => {
    if (!platform?._id) return;
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":");
      const formattedDateTime = `${selectedDate}T${hours.padStart(
        2,
        "0"
      )}:${minutes.padStart(2, "0")}`;
      onSave?.(formattedDateTime, platform._id);
      onClose();
    }
  };

  return (
    <Dialog
      open={!!platform}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Content Details
          </DialogTitle>
        </DialogHeader>

        <Card className="m-6 border-none shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5" />
              {"Reschedule on "}
              {platform?.platform ?? "—"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 px-0">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Platform</p>
              <p className="font-medium">
                {platform?.platform ?? "Not selected"}
              </p>
              {platform?._id ? (
                <p className="text-xs text-gray-500">
                  {"ID: "}
                  {platform._id}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Choose time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {time}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={!selectedDate || !selectedTime || !platform?._id}
              className="w-full"
            >
              Save Reschedule
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
