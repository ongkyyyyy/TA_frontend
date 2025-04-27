/* eslint-disable react/prop-types */
import { Button } from "../../../ui/button"
import { SentimentFilter } from "./sentiment-filter"
import { RatingFilter } from "./rating-filter"
import { OtaFilter } from "./ota-filter"
import { DateRangeFilter } from "./date-range-filter"
import { HotelFilter } from "./hotel-filter"
import { X } from "lucide-react"

export function FilterBar({ onClearFilters, 
  onSentimentFilterChange,
  onRatingFilterChange,
  onDateRangeFilterChange,
  onHotelFilterChange,
  onOtaFilterChange,
  resetSignal}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <SentimentFilter onFilterChange={onSentimentFilterChange} resetSignal={resetSignal}/>
      <RatingFilter onFilterChange={onRatingFilterChange} resetSignal={resetSignal}/>
      <OtaFilter onFilterChange={onOtaFilterChange} resetSignal={resetSignal}/>
      <DateRangeFilter onFilterChange={onDateRangeFilterChange} resetSignal={resetSignal}/>
      <HotelFilter onFilterChange={onHotelFilterChange} resetSignal={resetSignal}/>

        <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-9 px-3 text-xs">
          <X className="mr-1 h-4 w-4" />
          Clear filters
        </Button>
    </div>
  )
}
