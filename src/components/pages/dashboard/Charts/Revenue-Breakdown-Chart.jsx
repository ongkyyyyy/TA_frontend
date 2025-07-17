/* eslint-disable react/prop-types */
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function RevenueBreakdownChart({ data }) {
  const allRevenuesZero = data.every(
    (item) => item.room_revenue === 0 && item.restaurant_revenue === 0 && item.other_revenue === 0,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Breakdown per Month</CardTitle>
        <CardDescription>Multi-line chart showing room, restaurant, and other revenue streams</CardDescription>
      </CardHeader>
      <CardContent>
        {allRevenuesZero ? (
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
              room_revenue: {
                label: "Room Revenue",
                color: "hsl(222.2 47.4% 11.2%)",
              },
              restaurant_revenue: {
                label: "Restaurant Revenue",
                color: "hsl(162 47.4% 50.2%)",
              },
              other_revenue: {
                label: "Other Revenue",
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
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Line
                type="monotone"
                dataKey="room_revenue"
                stroke="hsl(222.2 47.4% 11.2%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="restaurant_revenue"
                stroke="hsl(162 47.4% 50.2%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="other_revenue"
                stroke="hsl(291.1 47.4% 51.2%)"
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

export default function Component() {
  const sampleData = [
    { month: "Jan", room_revenue: 231999975, restaurant_revenue: 260999969, other_revenue: 28999974 },
    { month: "Feb", room_revenue: 226511915, restaurant_revenue: 254825907, other_revenue: 28313970 },
    { month: "Mar", room_revenue: 259999975, restaurant_revenue: 292499972, other_revenue: 32499973 },
    { month: "Apr", room_revenue: 279999977, restaurant_revenue: 314999971, other_revenue: 34999970 },
    { month: "May", room_revenue: 289091994, restaurant_revenue: 325228490, other_revenue: 36136471 },
    { month: "Jun", room_revenue: 247200000, restaurant_revenue: 277200000, other_revenue: 21601560 },
    { month: "Jul", room_revenue: 49500, restaurant_revenue: 1500, other_revenue: 2500 },
  ]

  return (
    <div className="p-6">
      <RevenueBreakdownChart data={sampleData} />
    </div>
  )
}
