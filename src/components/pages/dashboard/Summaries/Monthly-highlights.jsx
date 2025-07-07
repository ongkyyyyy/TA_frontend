/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Star, TrendingUp, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export function MonthlyHighlights({ data, isLoading = false }) {
  if (isLoading || !data) {
    return (
      <Card className="bg-white/50 shadow-sm border border-gray-100 h-full">
        <CardHeader className="pb-2">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-7 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 mr-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
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

  const highlights = [
    {
      title: "Best Revenue Month",
      icon: DollarSign,
      value: `${summary.best_month.month} - ${formatCurrency(summary.best_month.revenue)}`,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Best Sentiment Month",
      icon: Star,
      value: `${summary.best_sentiment_month.month} - Score: ${summary.best_sentiment_month.score.toFixed(1)}`,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Peak Review Month",
      icon: TrendingUp,
      value: `${summary.peak_review_month.month} - ${summary.peak_review_month.reviews} reviews`,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Active Revenue Months",
      icon: Calendar,
      value: `${summary.active_revenue_months} months`,
      color: "bg-amber-100 text-amber-600",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full">
      <CardHeader>
        <div className="text-sm text-gray-500 font-medium">Performance</div>
        <CardTitle className="text-gray-800 text-xl">Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 group"
            >
              <div
                className={`h-12 w-12 rounded-full ${highlight.color} flex items-center justify-center mr-4 flex-shrink-0 shadow-sm group-hover:shadow transition-all duration-300`}
              >
                <highlight.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{highlight.title}</p>
                <p className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {highlight.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}
