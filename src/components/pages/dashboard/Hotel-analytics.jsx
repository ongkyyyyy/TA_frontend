"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { AverageDailySales } from "./Summaries/Average-daily-sales"
import { MetricCards } from "./Summaries/Metric-cards"
import { SalesOverview } from "./Summaries/Sales-overview"
import { WebsiteAnalytics } from "./Summaries/Website-analytics"

export default function HotelAnalyticsDashboard() {
  const currentYear = new Date().getFullYear().toString()
  const [year, setYear] = useState(currentYear)
  const [selectedHotels, setSelectedHotels] = useState([])
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState("single")
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
          await generatePDF(selectedHotels.length > 0 ? selectedHotels : "All", year, activeTab)
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
  }, [selectedHotels, year, activeTab])

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
    <div className="container mx-auto space-y-8 py-8 px-4 md:px-6 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <HotelAnalyticsHeader
        selectedHotels={selectedHotels}
        year={year}
        onHotelChange={handleHotelFilterChange}
        onYearChange={setYear}
        activeTab={activeTab}
        resetSignal={resetFilters}
        onResetFilters={resetAllFilters}
      />

      <div className="transition-all duration-500 ease-in-out">
        <MetricCards data={data} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 transition-all duration-500 ease-in-out">
        <WebsiteAnalytics data={data} isLoading={isLoading} />
        <AverageDailySales data={data} isLoading={isLoading} />
        <SalesOverview data={data} isLoading={isLoading} />
      </div>

      {hasNoRevenueData && !showPlaceholder && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">No Revenue Data Available</AlertTitle>
          <AlertDescription className="text-amber-600">
            Revenue data is not available for the selected period. Sentiment analysis is still available.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="single"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
          >
            Single Analysis
          </TabsTrigger>
          <TabsTrigger
            value="hybrid"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
          >
            Hybrid Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" id="single" className="space-y-8 transition-all duration-500 ease-in-out">
          {showPlaceholder ? (
            <ChartLoading />
          ) : (
            <>
              <MonthlyRevenueTrends data={transformedData} />
              <CompositeSentimentIndex data={transformedData} />
              <SentimentRatios data={transformedData} />
            </>
          )}
        </TabsContent>

        <TabsContent value="hybrid" id="hybrid" className="space-y-8 transition-all duration-500 ease-in-out">
          {showPlaceholder ? (
            <ChartLoading />
          ) : (
            <>
              <RevenueSentiment data={transformedData} />
              <ReviewVolumeRevenue data={transformedData} />
              <CSIRevenueCorrelation data={scatterData} />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
