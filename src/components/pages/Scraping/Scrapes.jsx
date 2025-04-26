import { useState, useEffect } from "react"
import { scrapeData } from "@/api/apiScrapes"
import { getHotelsDropdown } from "@/api/apiHotels"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Hotel, Search, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ScrapeSources from "./ScrapeSources"

export default function ScrapePage() {
  const [hotelId, setHotelId] = useState("")
  const [hotels, setHotels] = useState([])
  const [source, setSource] = useState("traveloka")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hotelsLoading, setHotelsLoading] = useState(true)
  const sources = ScrapeSources()

  useEffect(() => {
    const fetchHotels = async () => {
      setHotelsLoading(true)
      try {
        const res = await getHotelsDropdown()
        setHotels(res)
      } catch (error) {
        console.error("Failed to fetch hotels:", error)
      } finally {
        setHotelsLoading(false)
      }
    }

    fetchHotels()
  }, [])

  const handleScrape = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await scrapeData(source, hotelId)
      setResult(res)
    } catch (err) {
      setResult({ error: err.response?.data?.error || "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2" />
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Search className="h-6 w-6" />
            Review Scraper Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hotel-select" className="text-sm font-medium">
                    Select Hotel
                  </Label>
                  <div className="mt-1.5 relative">
                    <Select value={hotelId} onValueChange={setHotelId} disabled={hotelsLoading}>
                      <SelectTrigger id="hotel-select" className="w-full">
                        <SelectValue placeholder={hotelsLoading ? "Loading hotels..." : "-- Select a Hotel --"} />
                      </SelectTrigger>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem key={hotel._id} value={hotel._id}>
                            <div className="flex items-center gap-2">
                              <Hotel className="h-4 w-4 text-gray-500" />
                              {hotel.hotel_name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {hotelsLoading && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Select Source</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1.5">
                    {Object.entries(sources).map(([key, sourceData]) => (
                      <div
                        key={key}
                        onClick={() => setSource(key)}
                        className={`
                          cursor-pointer rounded-lg border p-3 transition-all duration-200
                          ${
                            source === key
                              ? `border-2 border-${sourceData.activeColor} ring-2 ring-offset-2 ring-${sourceData.activeColor}/30`
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div
                            className={`
                            p-2 rounded-full 
                            ${source === key ? sourceData.color : "bg-gray-100"}
                          `}
                          >
                            {sourceData.logo}
                          </div>
                          <span className="text-sm font-medium">{sourceData.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleScrape}
                  disabled={loading || !hotelId}
                  className="w-full h-12 text-base font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Scraping Reviews...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Start Scraping
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-full">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Source Information</h3>
                {source && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${sources[source].color}`}>{sources[source].logo}</div>
                      <span className="font-medium">{sources[source].name}</span>
                    </div>
                    <Badge variant="outline" className={sources[source].color}>
                      Active Source
                    </Badge>
                    <p className="text-sm text-gray-500 mt-2">
                      Scraping reviews from {sources[source].name} for the selected hotel. Results will appear below
                      once the scraping process is complete.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading && !result && (
            <Card className="mt-6 border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="pt-2">
                    <Skeleton className="h-20 w-full rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
              <Card className="mt-6 border-0 shadow-md overflow-hidden">
                <div className={`h-1 ${sources[source].activeColor}`} />
                <CardHeader className="pb-0 pt-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {result.error ? (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span>Error</span>
                      </>
                    ) : (
                      <>
                        <div className="p-1 rounded-md bg-green-100">{sources[source].logo}</div>
                        <span>Scraping Results</span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="bg-gray-50 rounded-md p-4 overflow-auto max-h-[400px]">
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
  )
}
