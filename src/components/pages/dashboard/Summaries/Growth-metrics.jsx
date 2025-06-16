/* eslint-disable react/prop-types */
import { ArrowDown, ArrowUp, DollarSign, Star, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function GrowthMetrics({ data, isLoading = false }) {
  if (isLoading || !data) {
    return (
      <Card className="bg-white/50 animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-7 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-10"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const { growth } = data

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardDescription>Performance</CardDescription>
        <CardTitle>Growth Metrics</CardTitle>
        <CardDescription>
          Performance compared to the previous month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center">
            <div
              className={`h-16 w-16 rounded-full ${growth.revenue_growth_pct >= 0 ? "bg-green-100" : "bg-red-100"} flex items-center justify-center mb-2`}
            >
              <DollarSign className={`h-8 w-8 ${growth.revenue_growth_pct >= 0 ? "text-green-600" : "text-red-600"}`} />
            </div>
            <p className="text-sm text-gray-500 mb-1">Revenue</p>
            <div
              className={`flex items-center ${growth.revenue_growth_pct >= 0 ? "text-green-600" : "text-red-600"} font-medium`}
            >
              {growth.revenue_growth_pct >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(growth.revenue_growth_pct)}%</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div
              className={`h-16 w-16 rounded-full ${growth.reviews_growth_pct >= 0 ? "bg-blue-100" : "bg-red-100"} flex items-center justify-center mb-2`}
            >
              <Users className={`h-8 w-8 ${growth.reviews_growth_pct >= 0 ? "text-blue-600" : "text-red-600"}`} />
            </div>
            <p className="text-sm text-gray-500 mb-1">Reviews</p>
            <div
              className={`flex items-center ${growth.reviews_growth_pct >= 0 ? "text-blue-600" : "text-red-600"} font-medium`}
            >
              {growth.reviews_growth_pct >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(growth.reviews_growth_pct)}%</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div
              className={`h-16 w-16 rounded-full ${growth.sentiment_growth_pct >= 0 ? "bg-purple-100" : "bg-red-100"} flex items-center justify-center mb-2`}
            >
              <Star className={`h-8 w-8 ${growth.sentiment_growth_pct >= 0 ? "text-purple-600" : "text-red-600"}`} />
            </div>
            <p className="text-sm text-gray-500 mb-1">Sentiment</p>
            <div
              className={`flex items-center ${growth.sentiment_growth_pct >= 0 ? "text-purple-600" : "text-red-600"} font-medium`}
            >
              {growth.sentiment_growth_pct >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(growth.sentiment_growth_pct)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
