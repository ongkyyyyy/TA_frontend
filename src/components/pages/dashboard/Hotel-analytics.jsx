import { useState, useEffect, useMemo } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getDiagram } from "@/api/apiDiagram"
import { HotelAnalyticsHeader } from "./Hotel-analytics-header"
import { ChartLoading } from "./Charts/Chart-Loading"
import { MonthlyRevenueTrends } from "./Charts/Monthly-revenue-trends"
import { RevenueSentiment } from "./Charts/Revenue-vs-sentiment"
import { ReviewVolumeRevenue } from "./Charts/Review-volume-vs-revenue"
import { CompositeSentimentIndex } from "./Charts/Composite-sentiment-index"
import { SentimentRatios } from "./Charts/Sentiment-ratios"
import { CSIRevenueCorrelation } from "./Charts/Csi-revenue-correlation"
import { generatePDF } from "./PDF/Pdf-generator"
import { SummaryOverview } from "./Summaries/Summary-overview"
import { MonthlyHighlights } from "./Summaries/Monthly-highlights"
import { GrowthMetrics } from "./Summaries/Growth-metrics"
import { SentimentDistribution } from "./Summaries/Sentiment-distribution"
import { Separator } from "@/components/ui/separator"

export default function HotelAnalyticsDashboard() {
  const currentYear = new Date().getFullYear().toString()
  const [year, setYear] = useState(currentYear)
  const [selectedHotels, setSelectedHotels] = useState([])
  const [data, setData] = useState(null)
  const [resetFilters, setResetFilters] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const hotelParam = selectedHotels.length > 0 ? selectedHotels : "All"
        const response = await getDiagram(hotelParam, year)
        setData(response)
      } catch (error) {
        console.error("Error fetching diagram data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedHotels, year])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.downloadPDF = async () => {
        try {
          await generatePDF(selectedHotels.length > 0 ? selectedHotels : "All", year, data)
        } catch (error) {
          console.error("Error generating PDF:", error)
        }
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.downloadPDF
      }
    }
  }, [selectedHotels, year, data])

  const handleHotelFilterChange = (hotels) => {
    setSelectedHotels(hotels)
  }

  const resetAllFilters = () => {
    setSelectedHotels([])
    setYear(currentYear)
    setResetFilters((prev) => prev + 1)
  }

  const transformedData = useMemo(() => {
    if (!data) return []

    return data.months.map((month, index) => ({
      month,
      room_revenue: data.room_revenue[index] || 0,
      restaurant_revenue: data.restaurant_revenue[index] || 0,
      other_revenue: data.other_revenue[index] || 0,
      nett_revenue: data.nett_revenue[index] || 0,
      gross_revenue: data.gross_revenue[index] || 0,
      grand_total_revenue: data.grand_total_revenue[index] || 0,
      sentiment_score: data.sentiment_score[index] || 0,
      composite_sentiment_index: data.composite_sentiment_index[index] || 0,
      review_volume: data.review_volume[index] || 0,
      positive_ratio: data.positive_ratio[index] || 0,
      negative_ratio: data.negative_ratio[index] || 0,
      neutral_ratio: data.neutral_ratio[index] || 0,
    }))
  }, [data])

  const scatterData = useMemo(() => {
    if (!data) return []

    return data.months.map((month, index) => ({
      month,
      x: data.composite_sentiment_index[index] || 0,
      y: data.gross_revenue[index] || 0,
      z: data.review_volume[index] || 0,
    }))
  }, [data])

  const hasNoRevenueData = useMemo(() => {
    if (!data) return false
    return (
      data.room_revenue.every((val) => val === 0) &&
      data.restaurant_revenue.every((val) => val === 0) &&
      data.other_revenue.every((val) => val === 0) &&
      data.gross_revenue.every((val) => val === 0)
    )
  }, [data])

  const showPlaceholder = !data || isLoading

  return (
    <div className="space-y-8 py-6 container bg-white min-h-screen">
      <HotelAnalyticsHeader
        selectedHotels={selectedHotels}
        year={year}
        onHotelChange={handleHotelFilterChange}
        onYearChange={setYear}
        resetSignal={resetFilters}
        onResetFilters={resetAllFilters}
        data={data}
      />

      <div className="space-y-6">
        <SummaryOverview data={data} isLoading={isLoading} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <MonthlyHighlights data={data} isLoading={isLoading} />
          </div>
          <GrowthMetrics data={data} isLoading={isLoading} />
          <SentimentDistribution data={data} isLoading={isLoading} />
        </div>
      </div>

      <Separator className="my-8" />
      {hasNoRevenueData && !showPlaceholder && (
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">No Revenue Data Available</AlertTitle>
          <AlertDescription className="text-amber-600">
            Revenue data is not available for the selected period. Sentiment analysis is still available.
          </AlertDescription>
        </Alert>
      )}
      {showPlaceholder ? (
        <ChartLoading />
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-1 w-8 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">Performance and Trends</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <MonthlyRevenueTrends data={transformedData} />
              </div>
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <SentimentRatios data={transformedData} />
              </div>
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <CompositeSentimentIndex data={transformedData} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-1 w-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">Performance Correlations</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <ReviewVolumeRevenue data={transformedData} />
              </div>
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <CSIRevenueCorrelation data={scatterData} />
              </div>
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <RevenueSentiment data={transformedData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
