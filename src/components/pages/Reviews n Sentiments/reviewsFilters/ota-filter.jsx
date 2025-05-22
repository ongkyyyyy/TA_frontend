/* eslint-disable react/prop-types */
import { Check, Filter } from "lucide-react"
import { Button } from "../../../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover"
import { useState, useEffect } from "react"

const otaOptions = [
  { label: "Agoda", value: "Agoda" },
  { label: "Ticket.com", value: "Ticket.com" },
  { label: "Trip.com", value: "Trip.com" },
  { label: "Traveloka", value: "Traveloka" },
]

export function OtaFilter({ onFilterChange, resetSignal}) {
  const [open, setOpen] = useState(false)
  const [selectedOta, setSelectedOta] = useState(null)

  const handleOtaChange = (value) => {
    setSelectedOta(value)
    setOpen(false)
    if (onFilterChange) {
      onFilterChange(value)
    }
  }

  useEffect(() => {
    setSelectedOta(null)
  }, [resetSignal])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          OTA
          {selectedOta && (
            <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
              {otaOptions.find((ota) => ota.value === selectedOta)?.label}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search OTA" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => handleOtaChange("")} className="flex items-center justify-between">
                <span>All OTAs</span>
                {!selectedOta && <Check className="h-4 w-4" />}
              </CommandItem>
              {otaOptions.map((ota) => (
                <CommandItem
                  key={ota.value}
                  onSelect={() => handleOtaChange(ota.value)}
                  className="flex items-center justify-between"
                >
                  <span>{ota.label}</span>
                  {selectedOta === ota.value && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
