/* eslint-disable react/prop-types */
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, TrendingUp } from "lucide-react"
import { Separator } from "@/components/ui/separator"

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

export function AverageDailySales({ data, isLoading = false }) {
  const summary = data?.summary
  const monthlyRevenue = formatCurrency(summary?.avg_monthly_revenue, true)
  const bestMonthRevenue = formatCurrency(summary?.best_month?.revenue, true)
  const totalRevenue = formatCurrency(summary?.total_revenue, true)

  if (!summary && !isLoading) return null

  return (
    <Card className="col-span-1 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Average Monthly Revenue</CardTitle>
            <p className="text-xs text-muted-foreground">Based on the last 12 months</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-32 mt-1" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <div className="mt-2">
              <p className="text-2xl font-bold tabular-nums">{monthlyRevenue}</p>
              <div className="mt-1 flex items-center text-xs text-primary">
                <span className="inline-block mr-1">↑</span>
                <span>8.2% from previous month</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <p className="text-xs font-medium">Best Month</p>
                </div>
                <p className="text-sm font-bold">{summary?.best_month?.month || "-"}</p>
                <p className="text-xs text-muted-foreground">{bestMonthRevenue}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <p className="text-xs font-medium">Total Revenue</p>
                </div>
                <p className="text-sm font-bold">{totalRevenue}</p>
                <p className="text-xs text-muted-foreground">Last 12 months</p>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <p className="text-xs text-muted-foreground">
                Monthly average calculated from{" "}
                {summary?.total_revenue ? (summary.total_revenue / summary.avg_monthly_revenue).toFixed(1) : "-"} months
                of sales data
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
