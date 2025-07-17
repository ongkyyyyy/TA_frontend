/* eslint-disable react/prop-types */
import { CartesianGrid, Bar, BarChart, XAxis, YAxis } from "recharts"
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
  
  const formatCurrency = (value) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}B`
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`
    return `Rp ${value.toLocaleString("id-ID")}`
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
                color: "#66BB6A",
              },
            }}
            className="h-full w-full aspect-[16/9]"
          >
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              width="100%"
              height="100%"
              responsive={true}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} interval={0} />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={formatCurrency} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold mb-2 text-black">{`Month: ${label}`}</p>
                        <p className="text-sm text-black">
                          {`${payload[0].name}: Rp ${payload[0].value.toLocaleString("id-ID")}`}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="grand_total_revenue"
                fill="#66BB6A"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                label={{ position: "top", formatter: formatCurrency, fill: "black", fontSize: 12 }}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
