/* eslint-disable react/prop-types */
import { Calendar, DollarSign, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MonthlyHighlights({ data, isLoading = false }) {
  if (isLoading || !data) {
    return (
      <Card className="bg-white/50 animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-7 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
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
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardDescription>Performance</CardDescription>
        <CardTitle>Monthly Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Best Revenue Month</p>
              <p className="font-medium">
                {summary.best_month.month} - {formatCurrency(summary.best_month.revenue)}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Best Sentiment Month</p>
              <p className="font-medium">
                {summary.best_sentiment_month.month} - Score: {summary.best_sentiment_month.score.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Peak Review Month</p>
              <p className="font-medium">
                {summary.peak_review_month.month} - {summary.peak_review_month.reviews} reviews
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Revenue Months</p>
              <p className="font-medium">{summary.active_revenue_months} months</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
