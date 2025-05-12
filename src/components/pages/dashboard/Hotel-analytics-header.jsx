/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PDFButton } from "./PDF/PDF-button"
import { HotelFilter } from "../Reviews n Sentiments/reviewsFilters/hotel-filter"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function HotelAnalyticsHeader({
  selectedHotels,
  year,
  onHotelChange,
  onYearChange,
  activeTab,
  resetSignal,
  onResetFilters,
}) {
  const [years, setYears] = useState([])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const range = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString())
    setYears(["Lifetime", ...range]) // 👈 prepend Lifetime option
  }, [])

  const hotelName =
    selectedHotels.length === 0
      ? "All Hotels"
      : selectedHotels.length === 1
        ? "Selected Hotel"
        : `${selectedHotels.length} Hotels`

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold">Hotel Revenue & Sentiment Analytics</h1>
        <p className="text-muted-foreground">Visualizing the relationship between revenue and customer sentiment</p>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-4 flex-wrap items-center">
          <HotelFilter onFilterChange={onHotelChange} resetSignal={resetSignal} />

          <Select value={year} onValueChange={onYearChange} data-year-select>
            <SelectTrigger className="w-[191px]">
              <SelectValue placeholder="Select Year" className="select-value" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y === "Lifetime" ? "Lifetime (All Years)" : y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-9" onClick={onResetFilters}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
        <div className="ml-auto">
          <PDFButton
            hotelId={selectedHotels.length > 0 ? selectedHotels : "All"}
            hotelName={hotelName}
            year={year}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  )
}
