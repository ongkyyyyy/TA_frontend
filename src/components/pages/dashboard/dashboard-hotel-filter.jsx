/* eslint-disable react/prop-types */
import { Button } from "../../ui/button"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from "../../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Check, Building } from "lucide-react"

export function HotelFilter({ selectedHotels, onFilterChange, hotelOptions }) {
  const handleHotelChange = (value) => {
    let newSelectedHotels
    if (value === "") {
      newSelectedHotels = []
    } else if (selectedHotels.includes(value)) {
      newSelectedHotels = selectedHotels.filter((id) => id !== value)
    } else {
      newSelectedHotels = [...selectedHotels, value]
    }

    onFilterChange?.(newSelectedHotels)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Building className="mr-2 h-4 w-4" />
          Hotel
          {selectedHotels.length > 0 && (
            <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
              {selectedHotels.length} selected
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search hotels" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No hotels found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => handleHotelChange("")} className="flex items-center justify-between">
                <span>All Hotels</span>
                {selectedHotels.length === 0 && <Check className="h-4 w-4" />}
              </CommandItem>
              {hotelOptions.map((hotel) => (
                <CommandItem
                  key={hotel.value}
                  onSelect={() => handleHotelChange(hotel.value)}
                  className="flex items-center justify-between"
                >
                  <span className="truncate">{hotel.label}</span>
                  {selectedHotels.includes(hotel.value) && <Check className="h-4 w-4 flex-shrink-0" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
