/* eslint-disable react/prop-types */
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function RevenueStreamContributionAnalysis({ data }) {
  const allRatiosZero = data.every(
    (item) => item.room_revenue_ratio === 0 && item.restaurant_revenue_ratio === 0 && item.other_revenue_ratio === 0,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Stream Contribution Analysis</CardTitle>
        <CardDescription>Breakdown of revenue contribution by source over time</CardDescription>
      </CardHeader>
      <CardContent>
        {allRatiosZero ? (
          <div className="flex h-full w-full aspect-[16/9] items-center justify-center flex-col text-center p-6">
            <p className="text-lg font-medium text-muted-foreground mb-2">No Revenue Data Available</p>
            <p className="text-sm text-muted-foreground">
              Revenue data is not available for the selected period. Please select a different time range or check data
              sources.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={{
              room_revenue_ratio: {
                label: "Room Revenue Ratio",
                color: "hsl(222.2 47.4% 11.2%)", 
              },
              restaurant_revenue_ratio: {
                label: "Restaurant Revenue Ratio",
                color: "hsl(162 47.4% 50.2%)", 
              },
              other_revenue_ratio: {
                label: "Other Revenue Ratio",
                color: "hsl(291.1 47.4% 51.2%)",
              },
            }}
            className="h-full w-full aspect-[16/9]"
          >
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              width="100%"
              height="100%"
              responsive={true}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} interval={0} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="room_revenue_ratio" 
                stroke="var(--color-room_revenue_ratio)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="restaurant_revenue_ratio"
                stroke="var(--color-restaurant_revenue_ratio)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="other_revenue_ratio"
                stroke="var(--color-other_revenue_ratio)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
