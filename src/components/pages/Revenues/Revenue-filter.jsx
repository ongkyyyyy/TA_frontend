/* eslint-disable react/prop-types */
import { Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "../../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { DateRangeFilter } from "../Reviews n Sentiments/reviewsFilters/date-range-filter"
import { HotelFilter } from "../Reviews n Sentiments/reviewsFilters/hotel-filter"
import { X } from "lucide-react"

export function RevenueFiltersBar({
  onHotelFilterChange,
  onDateRangeFilterChange,
  onClearFilters,
  handleSortChange,
  setAdvancedFiltersOpen,
  resetSignal,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <HotelFilter onFilterChange={onHotelFilterChange} resetSignal={resetSignal}/>
      <DateRangeFilter onFilterChange={onDateRangeFilterChange} resetSignal={resetSignal} />
      <div className="flex items-center">
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="h-9 border-dashed">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-asc">Date (Ascending)</SelectItem>
            <SelectItem value="date-desc">Date (Descending)</SelectItem>
            <SelectItem value="revenue-asc">Revenue (Ascending)</SelectItem>
            <SelectItem value="revenue-desc">Revenue (Descending)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm" onClick={() => setAdvancedFiltersOpen(true)} className="h-9 border-dashed">
        <Filter className="mr-2 h-4 w-4" />
        Advanced Filters
      </Button>

      <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-9 px-3 text-xs">
          <X className="mr-1 h-4 w-4" />
          Clear filters
        </Button>
    </div>
  )
}
