/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PDFButton } from "./PDF/PDF-button"
import { HotelFilter } from "../Reviews n Sentiments/reviewsFilters/hotel-filter"
import { Button } from "@/components/ui/button"
import { ChevronDown, Filter, RefreshCw } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { getHotelsDropdown } from "@/api/apiHotels"

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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hotelOptions, setHotelOptions] = useState([])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const range = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString())
    setYears(["Lifetime", ...range])
  }, [])

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotelsDropdown()
        const hotels = response.map((hotel) => ({
          label: hotel.hotel_name,
          value: hotel._id,
        }))
        setHotelOptions(hotels)
      } catch (error) {
        console.error("Failed to fetch hotel names:", error)
      }
    }

    fetchHotels()
  }, [])

  const selectedHotelNames = hotelOptions
    .filter((hotel) => selectedHotels.includes(hotel.value))
    .map((hotel) => hotel.label)

  // Truncate long names for display
  let hotelName = "All Hotels"
  if (selectedHotels.length === 1) {
    hotelName = selectedHotelNames[0] || "Selected Hotel"
  } else if (selectedHotels.length > 1) {
    const shownNames = selectedHotelNames.slice(0, 2)
    const remaining = selectedHotelNames.length - shownNames.length
    hotelName = shownNames.join(", ") + (remaining > 0 ? `, ...` : "")
  }

  const displayYear = year || "Lifetime"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Revenue & Sentiment Dashboard</h1>
          <h2 className="text-sm text-muted-foreground">
            Showing data for:{" "}
            <span className="font-medium">
              {hotelName} ({displayYear})
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {selectedHotels.length > 0 && (
                  <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
                    {selectedHotels.length === 1
                      ? "Hotel selected"
                      : `${selectedHotels.length} Hotels selected`}
                  </span>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="p-2">
                <div className="mb-3">
                  <HotelFilter onFilterChange={onHotelChange} resetSignal={resetSignal} />
                </div>
                <div className="mb-3">
                  <Select value={year} onValueChange={onYearChange} data-year-select>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y === "Lifetime" ? "Lifetime" : y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button size="sm" className="w-full h-9 mb-2" onClick={() => setDropdownOpen(false)}>
                  Apply
                </Button>

                <Button variant="ghost" size="sm" onClick={onResetFilters} className="w-full h-9">
                  <RefreshCw className="mr-2 h-3.5 w-3.5" />
                  Reset Filters
                </Button>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <PDFButton
            hotelId={selectedHotels.length > 0 ? selectedHotels : "All"}
            hotelName={hotelName}
            year={year}
            activeTab={activeTab}
          />
        </div>
      </div>

      <Separator />
    </div>
  )
}
