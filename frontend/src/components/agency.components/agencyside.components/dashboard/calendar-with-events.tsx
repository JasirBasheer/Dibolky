"use client"

import * as React from "react"
import { formatDateRange } from "little-date"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

const events = [
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Design Review",
    from: "2025-06-12T11:30:00",
    to: "2025-06-12T12:30:00",
  },
  {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
    {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
   {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
   {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
   {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
  
]

export function CalendarWithEvents() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))

  return (
    <Card className="w-fit max-w-full">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Calendar Section - Top on mobile, Left on desktop */}
          <div className="p-4 border-b md:border-b-0 md:border-r">
            <Calendar mode="single" selected={date} onSelect={setDate} className="bg-transparent p-0" required />
          </div>

          {/* Events Section - Bottom on mobile, Right on desktop */}
          <div className="w-full md:w-80">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {date?.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-2 h-[17rem] overflow-hidden  overflow-y-auto">
                {events.map((event) => (
                  <div
                    key={event.title}
                    className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {formatDateRange(new Date(event.from), new Date(event.to))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
