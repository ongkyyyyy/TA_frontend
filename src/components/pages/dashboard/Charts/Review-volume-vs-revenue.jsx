/* eslint-disable react/prop-types */
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ReviewVolumeRevenue({ data }) {
    const allRevenuesZero = data.every((item) => item.gross_revenue === 0)
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Volume vs Revenue</CardTitle>
          <CardDescription>
            {allRevenuesZero
              ? "Review volume trends over time (revenue data not available)"
              : "Relationship between number of reviews and revenue performance"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              review_volume: {
                label: "Review Volume",
                color: "hsl(222.2 47.4% 11.2%)", 
              },
              gross_revenue: {
                label: "Gross Revenue",
                color: "hsl(43.3 96.4% 56.3%)",
              },
            }}
            className="h-[400px]"
          >
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0}
              />
              <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                yAxisId="left"
                dataKey="review_volume"
                fill="hsl(222.2 47.4% 11.2%)" 
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                yAxisId="right"
                dataKey="gross_revenue"
                fill="hsl(43.3 96.4% 56.3%)" 
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }
  