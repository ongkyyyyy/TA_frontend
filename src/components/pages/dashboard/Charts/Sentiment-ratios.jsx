/* eslint-disable react/prop-types */
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function SentimentRatios({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Ratios</CardTitle>
        <CardDescription>Distribution of positive, neutral, and negative sentiment over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            positive_ratio: {
              label: "Positive",
              color: "hsl(143.8 61.2% 52.4%)", // Green
            },
            neutral_ratio: {
              label: "Neutral",
              color: "hsl(217.2 91.2% 59.8%)", // Blue
            },
            negative_ratio: {
              label: "Negative",
              color: "hsl(346.8 77.2% 49.8%)", // Red
            },
          }}
          className="h-[400px]"
        >
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0} // Force display all ticks
            />
            <YAxis
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} />}
            />
            <Area
              type="monotone"
              dataKey="positive_ratio"
              stackId="1"
              stroke="hsl(143.8 61.2% 52.4%)" // Green
              fill="hsl(143.8 61.2% 52.4%)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="neutral_ratio"
              stackId="1"
              stroke="hsl(217.2 91.2% 59.8%)" // Blue
              fill="hsl(217.2 91.2% 59.8%)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="negative_ratio"
              stackId="1"
              stroke="hsl(346.8 77.2% 49.8%)" // Red
              fill="hsl(346.8 77.2% 49.8%)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
