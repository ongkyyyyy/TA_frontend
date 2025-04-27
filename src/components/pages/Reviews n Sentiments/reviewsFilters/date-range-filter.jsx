/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button } from "../../../ui/button";
import { Calendar } from "../../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function DateRangeFilter({ onFilterChange, resetSignal }) {
  const [tempDate, setTempDate] = useState();
  const [appliedDate, setAppliedDate] = useState();
  const [open, setOpen] = useState(false);

  const handleSelectDate = (range) => {
    setTempDate(range);
  };

  const handleConfirm = () => {
    setAppliedDate(tempDate);
    if (onFilterChange) {
      onFilterChange(tempDate);
    }
    setOpen(false);
  };

  const handleClear = () => {
    setTempDate(undefined);
    setAppliedDate(undefined);
    if (onFilterChange) {
      onFilterChange(undefined);
    }
  };

  useEffect(() => {
    setTempDate(undefined)
    setAppliedDate(undefined)
  }, [resetSignal])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Date Range
          {appliedDate?.from && (
            <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
              {format(appliedDate.from, "MMM d")}
              {appliedDate.to ? ` - ${format(appliedDate.to, "MMM d")}` : ""}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={tempDate?.from}
          selected={tempDate}
          onSelect={handleSelectDate}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-between p-3 border-t">
          <Button variant="outline" size="sm" onClick={handleClear} className="text-xs">
            Clear
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(today.getDate() - 30);
                setTempDate({ from: thirtyDaysAgo, to: today });
              }}
              className="text-xs"
            >
              Last 30 Days
            </Button>
            <Button size="sm" onClick={handleConfirm} className="text-xs">
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
