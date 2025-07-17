/* eslint-disable react/prop-types */
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

export function TotalRevenueTrendChart({ data }) {
  let allRevenueZero = true
  for (let i = 0; i < data.length; i++) {
    if (data[i].grand_total_revenue !== 0) {
      allRevenueZero = false
      break
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Revenue Trend</CardTitle>
        <CardDescription>Monthly total revenue from all sources</CardDescription>
      </CardHeader>
      <CardContent>
        {allRevenueZero ? (
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
              grand_total_revenue: {
                label: "Total Revenue",
                color: "hsl(142 76% 36%)",
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
                tickFormatter={(value) => {
                  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}B`
                  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`
                  return `Rp ${value.toLocaleString("id-ID")}`
                }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold mb-2">{`Month: ${label}`}</p>
                        <p style={{ color: payload[0].color }} className="text-sm">
                          {`${payload[0].name}: Rp ${payload[0].value.toLocaleString("id-ID")}`}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="grand_total_revenue"
                stroke="hsl(142 76% 36%)" 
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
