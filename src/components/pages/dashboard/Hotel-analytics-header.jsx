/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PDFButton } from "./PDF/PDF-button"
import { getHotelsDropdown } from "@/api/apiHotels"

export function HotelAnalyticsHeader({ hotelId, year, onHotelChange, onYearChange, activeTab }) {
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

  const hotelName =
    hotelId === "All"
      ? "All Hotels"
      : hotels.find((h) => h._id === hotelId)?.hotel_name || "Unknown Hotel"

      return (
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">Hotel Revenue & Sentiment Analytics</h1>
            <p className="text-muted-foreground">
              Visualizing the relationship between revenue and customer sentiment
            </p>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-4 flex-wrap">
              <Select value={hotelId} onValueChange={onHotelChange} data-hotel-select>
                <SelectTrigger className="w-[191px]">
                  <SelectValue placeholder="Select Hotel" className="select-value" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="All" value="All">
                    All Hotels
                  </SelectItem>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel._id} value={hotel._id}>
                      {hotel.hotel_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={year} onValueChange={onYearChange} data-year-select>
                <SelectTrigger className="w-[191px]">
                  <SelectValue placeholder="Select Year" className="select-value" />
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
            <div className="ml-auto">
              <PDFButton
                hotelId={hotelId}
                hotelName={hotelName}
                year={year}
                activeTab={activeTab}
              />
            </div>
          </div>
        </div>
      )      
}