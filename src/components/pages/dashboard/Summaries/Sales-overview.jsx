/* eslint-disable react/prop-types */
"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { BarChart3, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

function formatCurrency(value, showSymbol = false) {
  if (typeof value !== "number") return "-"

  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  return showSymbol ? formatted : formatted.replace(/[^0-9.,]/g, "")
}

export function SalesOverview({ data, isLoading = false }) {
  const summary = data?.summary || {}
  const growth = data?.growth || {}

  const bestMonthRevenue = formatCurrency(summary?.best_month?.revenue, true)
  const latestSentimentScore = summary?.latest_sentiment_score ?? 0
  const totalReviews = summary?.total_reviews ?? 0
  const sentimentGrowthPct = growth?.sentiment_growth_pct ?? 0

  return (
    <Card className="col-span-1 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">Revenue Overview</CardTitle>
          {isLoading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-full">
              +{sentimentGrowthPct}%
            </span>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-8 w-32 mt-1" />
        ) : (
          <p className="text-2xl font-bold mt-1 tabular-nums">{bestMonthRevenue}</p>
        )}

        <div className="mt-6 space-y-6">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-2 w-full rounded-full" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sentiment</p>
                    <p className="text-xs text-muted-foreground">(Score)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary tabular-nums">{latestSentimentScore}%</p>
                  <div className="flex items-center text-xs text-primary">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 5L19 12L12 19M5 12H18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{sentimentGrowthPct}%</span>
                  </div>
                </div>
              </div>

              {/* Total Reviews */}
              <div className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reviews</p>
                    <p className="text-xs text-muted-foreground">(Total)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary tabular-nums">{totalReviews}</p>
                  <div className="flex items-center justify-end text-xs text-primary">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 5L19 12L12 19M5 12H18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>12.5%</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Sentiment Score</span>
                  <span className="font-medium">{latestSentimentScore}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                    style={{
                      width: `${latestSentimentScore}%`,
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
