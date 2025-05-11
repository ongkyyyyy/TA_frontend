/* eslint-disable react/prop-types */
import { Filter} from "lucide-react"
import { Button } from "../../ui/button"
import { DateRangeFilter } from "../Reviews n Sentiments/reviewsFilters/date-range-filter"
import { HotelFilter } from "../Reviews n Sentiments/reviewsFilters/hotel-filter"
import { SortSelect } from "./Sort-select"
import { X } from "lucide-react"

export function RevenueFiltersBar({
  onHotelFilterChange,
  onDateRangeFilterChange,
  onClearFilters,
  handleSortChange,
  setAdvancedFiltersOpen,
  resetSignal,
  sortValue,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SortSelect onSortChange={handleSortChange} resetSignal={resetSignal} defaultValue={sortValue} />
      <HotelFilter onFilterChange={onHotelFilterChange} resetSignal={resetSignal}/>
      <DateRangeFilter onFilterChange={onDateRangeFilterChange} resetSignal={resetSignal} />

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
