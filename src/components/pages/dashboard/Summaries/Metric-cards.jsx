/* eslint-disable react/prop-types */
"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, ShoppingCart, TrendingUp, BarChart3, LineChart } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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

export function MetricCards({ data, isLoading = false }) {
  const summary = data?.summary || {}
  const growth = data?.growth || {}

  const totalRevenue = formatCurrency(summary.total_revenue, true)
  const avgMonthlyRevenue = formatCurrency(summary.avg_monthly_revenue, true)
  const bestMonthRevenue = formatCurrency(summary.best_month?.revenue, true)

  const cards = [
    {
      title: "Total Revenue",
      subtitle: "All time",
      value: totalRevenue,
      icon: ShoppingCart,
      color: "emerald",
      gradientFrom: "from-emerald-50",
      gradientTo: "to-emerald-100",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Monthly Revenue",
      subtitle: "Average",
      value: avgMonthlyRevenue,
      growth: growth.revenue_growth_pct || 0,
      icon: DollarSign,
      color: "violet",
      gradientFrom: "from-violet-50",
      gradientTo: "to-violet-100",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      title: "Total Reviews",
      subtitle: "All time",
      value: summary.total_reviews || 0,
      growth: growth.reviews_growth_pct || 0,
      icon: BarChart3,
      color: "sky",
      gradientFrom: "from-sky-50",
      gradientTo: "to-sky-100",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
    },
    {
      title: "Sentiment Score",
      subtitle: "Latest",
      value: summary.latest_sentiment_score || "-",
      growth: growth.sentiment_growth_pct || 0,
      icon: LineChart,
      color: "amber",
      gradientFrom: "from-amber-50",
      gradientTo: "to-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Best Month Revenue",
      subtitle: summary.best_month?.month || "-",
      value: bestMonthRevenue,
      icon: TrendingUp,
      color: "rose",
      gradientFrom: "from-rose-50",
      gradientTo: "to-rose-100",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card
            className={cn(
              "overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out",
              `bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo}`,
              "relative"
            )}
          >
            <div className="absolute top-0 right-0 h-24 w-24 opacity-10">
              <card.icon className={`h-full w-full ${card.iconColor}`} />
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

              {isLoading ? (
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : (
                <>
                  <div className="mt-2">
                    <CardTitle className="text-2xl font-bold tracking-tight tabular-nums">
                      {card.value}
                    </CardTitle>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div
                      className={cn(
                        "flex items-center text-xs font-medium px-2.5 py-1 rounded-full",
                        card.growth < 0
                          ? "text-red-700 bg-red-100"
                          : `text-green-700 bg-green-100`
                      )}
                    >
                      {card.growth < 0 ? (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(card.growth)}%
                    </div>
                    <span className="text-xs text-gray-500 ml-2">vs previous period</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
