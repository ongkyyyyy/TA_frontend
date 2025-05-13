/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Star, TrendingUp, Calendar } from "lucide-react"

export function MonthlyHighlights({ data, isLoading = false }) {
  if (isLoading || !data) {
    return (
      <Card className="bg-white/50 animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-7 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const { summary } = data

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="bg-white shadow-sm hover:shadow transition-shadow duration-300 h-full">
      <CardHeader>
        <div className="text-sm text-gray-500">Performance</div>
        <CardTitle>Monthly Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Best Revenue Month</p>
              <p className="font-semibold text-gray-800">
                {summary.best_month.month} - {formatCurrency(summary.best_month.revenue)}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Best Sentiment Month</p>
              <p className="font-semibold text-gray-800">
                {summary.best_sentiment_month.month} - Score: {summary.best_sentiment_month.score.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Peak Review Month</p>
              <p className="font-semibold text-gray-800">
                {summary.peak_review_month.month} - {summary.peak_review_month.reviews} reviews
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4 flex-shrink-0">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Revenue Months</p>
              <p className="font-semibold text-gray-800">{summary.active_revenue_months} months</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
