/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getHotelsDropdown } from "@/api/apiHotels" 

export function HotelAnalyticsHeader({ hotelId, year, onHotelChange, onYearChange }) {
  const [hotels, setHotels] = useState([])
  const [years, setYears] = useState([])

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotelsDropdown()
        setHotels(data)
      } catch (error) {
        console.error("Error fetching hotels:", error)
      }
    }

    const currentYear = new Date().getFullYear()
    const range = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString())
    setYears(range)

    fetchHotels()
  }, [])

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Hotel Revenue & Sentiment Analytics</h1>
        <p className="text-muted-foreground">
          Visualizing the relationship between revenue and customer sentiment
        </p>
      </div>
      <div className="flex gap-4">
        <Select value={hotelId} onValueChange={onHotelChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Hotel" />
          </SelectTrigger>
          <SelectContent>
            {hotels.map((hotel) => (
              <SelectItem key={hotel._id} value={hotel._id}>
                {hotel.hotel_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={onYearChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}