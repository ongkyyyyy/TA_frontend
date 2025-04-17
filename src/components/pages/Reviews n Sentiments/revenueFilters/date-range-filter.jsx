/* eslint-disable react/prop-types */
import { useState } from "react"
import { Button } from "../../../ui/button"
import { Calendar } from "../../../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export function DateRangeFilter({ onFilterChange }) {
  const [date, setDate] = useState()

  const handleDateChange = (range) => {
    setDate(range)
    if (onFilterChange) {
      onFilterChange(range)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Date Range
          {date?.from && (
            <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
              {format(date.from, "MMM d")}
              {date.to ? ` - ${format(date.to, "MMM d")}` : ""}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleDateChange}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-between p-3 border-t">
          <Button variant="outline" size="sm" onClick={() => handleDateChange(undefined)} className="text-xs">
            Clear
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date()
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(today.getDate() - 30)
                handleDateChange({
                  from: thirtyDaysAgo,
                  to: today,
                })
              }}
              className="text-xs"
            >
              Last 30 Days
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (date?.from) {
                  handleDateChange({
                    from: date.from,
                    to: date.to,
                  })
                }
              }}
              className="text-xs"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
