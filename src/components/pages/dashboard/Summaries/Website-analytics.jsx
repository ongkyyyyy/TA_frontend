/* eslint-disable react/prop-types */
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Clock, ShoppingBag, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function WebsiteAnalytics({ data, isLoading = false }) {
  const summary = data?.summary || {}

  const formatNumber = (number, compact = false) => {
    if (typeof number !== "number") return "-"
    if (compact) {
      return new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
      }).format(number)
    }
    return new Intl.NumberFormat("en-US").format(number)
  }

  const sentimentScore = summary.latest_sentiment_score ?? 0
  const bestMonth = summary.best_month?.month || "-"
  const totalReviews = summary.total_reviews ?? "-"
  const avgMonthlyRevenue =
    typeof summary.avg_monthly_revenue === "number" ? formatNumber(summary.avg_monthly_revenue / 1000, true) : "-"

  return (
    <Card className="bg-primary text-primary-foreground col-span-1 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-center relative z-10">
          <CardTitle className="text-lg font-medium">Hotel Analytics</CardTitle>
        </div>

        {isLoading ? (
          <Skeleton className="h-4 w-32 mt-1 bg-primary" />
        ) : (
          <p className="text-sm mt-1 text-primary-foreground/90">Total {sentimentScore}% Sentiment Score</p>
        )}

        <div className="mt-6 relative z-10">
          <p className="text-sm font-medium mb-4 text-primary-foreground/90">Performance</p>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-full bg-white/20" />
              <Skeleton className="h-12 w-full bg-white/20" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-300">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold group-hover:text-white transition-colors duration-300">{bestMonth}</p>
                  <p className="text-xs text-primary-foreground/70">Best Month</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-300">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-bold group-hover:text-white transition-colors duration-300">
                    {totalReviews}
                  </p>
                  <p className="text-xs text-primary-foreground/70">Reviews</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 relative z-10">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-white/20" />
              <Skeleton className="h-8 w-full bg-white/20" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center group">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors duration-300">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold group-hover:text-white transition-colors duration-300">12</p>
                    <p className="text-xs text-primary-foreground/70">Months</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">{avgMonthlyRevenue}k</p>
                  <p className="text-xs text-primary-foreground/70">Avg. Monthly</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-primary-foreground/70">Sentiment Score</span>
                  <span className="font-medium text-primary-foreground">{sentimentScore}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${sentimentScore}%`,
                      transition: "width 1s ease-in-out",
                    }}
                  ></div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
