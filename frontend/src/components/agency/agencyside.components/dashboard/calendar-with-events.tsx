"use client";

import * as React from "react";
import { formatDateRange } from "little-date";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAllCalenderEventsApi } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/types";

export function CalendarWithEvents() {
  const user = useSelector((state: RootState) => state.user)
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ["get:cal-events", user.role == "agency" ? "agency" : "client", user.user_id],
    queryFn: () => {
      return getAllCalenderEventsApi(user.role == "agency" ? "agency" : "client", user.user_id);
    },
    select: (data) => data?.data?.events,
    staleTime: 1000 * 60 * 60,
  });

  const filteredEvents = React.useMemo(() => {
    if (!events || !date) return [];

    return events.filter((e) => {
      const fromDate = new Date(e.from);
      const toDate = new Date(e.to);

      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      return selected >= fromDate && selected <= toDate;
    });
  }, [events, date]);

  return (
    <Card className="w-fit max-w-full">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 border-b md:border-b-0 md:border-r">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="bg-transparent p-0"
              required
            />
          </div>

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
                {!isLoading ? (
                  filteredEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground text-xs">
                        {formatDateRange(
                          new Date(event.from),
                          new Date(event.to)
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <>loading</>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
