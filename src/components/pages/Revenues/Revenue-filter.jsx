/* eslint-disable react/prop-types */
import { CalendarIcon, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "../../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { DateRangeFilter } from "../Reviews n Sentiments/reviewsFilters/date-range-filter"

export function RevenueFiltersBar({
  selectedHotel,
  setSelectedHotel,
  hotelOptions,
  onDateRangeFilterChange,
  handleSortChange,
  setAdvancedFiltersOpen,
  resetSignal
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select value={selectedHotel} onValueChange={setSelectedHotel}>
        <SelectTrigger>
          <SelectValue placeholder="Select a hotel" />
        </SelectTrigger>
        <SelectContent>
          {hotelOptions.map((hotel) => (
            <SelectItem key={hotel._id} value={hotel._id}>
              {hotel.hotel_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <DateRangeFilter onFilterChange={onDateRangeFilterChange} resetSignal={resetSignal}/>
      </div>

      <div className="flex items-center space-x-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <Select onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-asc">Date (Ascending)</SelectItem>
            <SelectItem value="date-desc">Date (Descending)</SelectItem>
            <SelectItem value="revenue-asc">Revenue (Ascending)</SelectItem>
            <SelectItem value="revenue-desc">Revenue (Descending)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => setAdvancedFiltersOpen(true)}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
