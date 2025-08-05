"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock } from "lucide-react"
import { IPlatforms, IReviewBucket } from "@/types"

interface RescheduleContentProps {
  platform: IPlatforms;
  onSave?: (contentId: string,platformId:string,date:string) => void

}

const RescheduleContent = ({ platform, onSave }: RescheduleContentProps) => {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  const handleSave = () => {
    if (selectedDate && selectedTime && onSave) {
      // onSave({
      //   date: selectedDate,
      //   time: selectedTime,
      //   reason,
      //   platformId: platformData?.id || "default",
      // })
    }
  }

  // const displayName = platformData?.name || platformName

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Reschedule on 
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platform Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Platform</p>
            <p className="font-medium"></p>
            {platform?.platform && <p className="text-xs text-gray-500"></p>}
          </div>

           <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

           <div className="space-y-2">
            <Label>Select Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
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

           <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Input
              id="reason"
              placeholder="Why are you rescheduling?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button onClick={handleSave} disabled={!selectedDate || !selectedTime} className="w-full">
            Save Reschedule
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default RescheduleContent
