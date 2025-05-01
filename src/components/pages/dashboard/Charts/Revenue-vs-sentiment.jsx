/* eslint-disable react/prop-types */
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function RevenueSentiment({ data }) {
  // Check if all revenue values are zero
  const allRevenuesZero = data.every((item) => item.gross_revenue === 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Sentiment Score</CardTitle>
        <CardDescription>
          {allRevenuesZero
            ? "Sentiment score trends over time (revenue data not available)"
            : "Comparing revenue performance against customer sentiment"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            gross_revenue: {
              label: "Gross Revenue",
              color: "hsl(43.3 96.4% 56.3%)", // Amber
            },
            sentiment_score: {
              label: "Sentiment Score",
              color: "hsl(162 47.4% 50.2%)", // Teal
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
              interval={0} // Force display all ticks
            />
            <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 100]}
              label={{ value: "Sentiment Score (%)", angle: 90, position: "insideRight" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              yAxisId="left"
              dataKey="gross_revenue"
              fill="hsl(43.3 96.4% 56.3%)" // Amber
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              yAxisId="right"
              dataKey="sentiment_score"
              fill="hsl(162 47.4% 50.2%)" // Teal
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
