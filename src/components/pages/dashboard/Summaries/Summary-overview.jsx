/* eslint-disable react/prop-types */
"use client"

import { DollarSign, Star, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function SummaryOverview({ data, isLoading = false }) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-lg h-[230px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const { summary } = data

  const formatCurrency = (value, showSymbol = false) => {
    if (typeof value !== "number") return "-"
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

    return showSymbol ? formatted : formatted.replace(/[^0-9.,]/g, "")
  }

  const cards = [
    {
      title: "Revenue Overview",
      subtitle: "All time",
      value: formatCurrency(summary.total_revenue, true),
      secondaryValue: `Avg. Monthly: ${formatCurrency(summary.avg_monthly_revenue, true)}`,
      icon: DollarSign,
      gradientFrom: "from-emerald-50",
      gradientTo: "to-emerald-100",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      details: [
        {
          label: "Best Month",
          value: `${summary.best_month.month} (${formatCurrency(summary.best_month.revenue, true)})`,
        },
        {
          label: "Worst Month",
          value: `${summary.worst_month.month} (${formatCurrency(summary.worst_month.revenue, true)})`,
        },
      ],
    },
    {
      title: "Sentiment Analysis",
      subtitle: "Latest score",
      value: summary.latest_sentiment_score.toFixed(1),
      secondaryValue: `Avg. Score: ${summary.avg_sentiment_score.toFixed(1)}`,
      icon: Star,
      gradientFrom: "from-violet-50",
      gradientTo: "to-violet-100",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      details: [
        {
          label: "Best Month",
          value: `${summary.best_sentiment_month.month} (${summary.best_sentiment_month.score.toFixed(1)})`,
        },
        {
          label: "Worst Month",
          value: `${summary.worst_sentiment_month.month} (${summary.worst_sentiment_month.score.toFixed(1)})`,
        },
      ],
    },
    {
      title: "Review Metrics",
      subtitle: "All reviews",
      value: summary.total_reviews,
      secondaryValue: `Avg. Volume: ${summary.avg_review_volume.toFixed(1)}`,
      icon: BarChart3,
      gradientFrom: "from-sky-50",
      gradientTo: "to-sky-100",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
      details: [
        {
          label: "Peak Month",
          value: `${summary.peak_review_month.month} (${summary.peak_review_month.reviews})`,
        },
        {
          label: "Positive/Negative Ratio",
          value: summary.positive_negative_ratio.toFixed(1),
        },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={cn(
            "overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out",
            `bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo}`,
            "relative",
          )}
        >
          <div className="absolute top-0 right-0 h-24 w-24 opacity-10">
            <card.icon className={cn("h-full w-full", card.iconColor)} />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <CardTitle className="text-sm font-medium text-gray-700">{card.title}</CardTitle>
                <CardDescription className="text-xs text-gray-500">{card.subtitle}</CardDescription>
              </div>
              <div className={cn("p-3 rounded-full", card.iconBg)}>
                <card.icon className={cn("h-5 w-5", card.iconColor)} />
              </div>
            </div>

            <div className="mt-2">
              <CardTitle className="text-2xl font-bold tracking-tight tabular-nums">{card.value}</CardTitle>
              <div className="text-sm text-gray-500 mt-1">{card.secondaryValue}</div>
            </div>

            <div className="mt-4 text-xs">
              {card.details.map((detail, i) => (
                <div key={i} className="flex justify-between mb-1">
                  <span className="text-gray-500">{detail.label}:</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
