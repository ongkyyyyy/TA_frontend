import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getDiagram } from "@/api/apiDiagram"
import { HotelAnalyticsHeader } from "./Hotel-analytics-header"
import Loader from "@/components/loader/Loader"
import { MonthlyRevenueTrends } from "./Charts/Monthly-revenue-trends"
import { RevenueSentiment } from "./Charts/Revenue-vs-sentiment"
import { ReviewVolumeRevenue } from "./Charts/Review-volume-vs-revenue"
import { CompositeSentimentIndex } from "./Charts/Composite-sentiment-index"
import { SentimentRatios } from "./Charts/Sentiment-ratios"
import { CSIRevenueCorrelation } from "./Charts/Csi-revenue-correlation"

export default function HotelAnalyticsDashboard() {
    const [year, setYear] = useState("2024")
    const [hotelId, setHotelId] = useState("67fcca4e852775d38fc10853")
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [activeTab, setActiveTab] = useState("sentiment")
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true)
        try {
          const response = await getDiagram(hotelId, year)
          setData(response)
        } catch (error) {
          console.error("Error fetching diagram data:", error)
        } finally {
          setLoading(false)
        }
      }
  
      fetchData()
    }, [hotelId, year])
  
    // Transform data for charts
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
  
    // Transform data for scatter plot
    const scatterData = useMemo(() => {
      if (!data) return []
  
      return data.months.map((month, index) => ({
        month,
        x: data.composite_sentiment_index[index] || 0,
        y: data.gross_revenue[index] || 0,
        z: data.review_volume[index] || 0, // Using review volume for bubble size
      }))
    }, [data])
  
    // Check if all revenue values are zero
    const hasNoRevenueData = useMemo(() => {
      if (!data) return false
      return (
        data.room_revenue.every((val) => val === 0) &&
        data.restaurant_revenue.every((val) => val === 0) &&
        data.other_revenue.every((val) => val === 0) &&
        data.gross_revenue.every((val) => val === 0)
      )
    }, [data])
  
    if (loading) {
      return <Loader />
    }  

  return (
    <div className="container mx-auto p-6">
      <HotelAnalyticsHeader hotelId={hotelId} year={year} onHotelChange={setHotelId} onYearChange={setYear} />

      {hasNoRevenueData && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Revenue Data Available</AlertTitle>
          <AlertDescription>
            Revenue data is not available for the selected period. Sentiment analysis is still available.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <MonthlyRevenueTrends data={transformedData} />
          <RevenueSentiment data={transformedData} />
          <ReviewVolumeRevenue data={transformedData} />
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <CompositeSentimentIndex data={transformedData} />
          <SentimentRatios data={transformedData} />
          <CSIRevenueCorrelation data={scatterData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
