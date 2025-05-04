/* eslint-disable react/prop-types */
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function CompositeSentimentIndex({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Composite Sentiment Index (CSI) Over Time</CardTitle>
        <CardDescription>Tracking overall customer sentiment trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            composite_sentiment_index: {
              label: "Composite Sentiment Index",
              color: "hsl(222.2 47.4% 11.2%)",
            },
            sentiment_score: {
              label: "Sentiment Score",
              color: "hsl(162 47.4% 50.2%)",
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
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              label={{ value: "Score (%)", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="composite_sentiment_index"
              stroke="hsl(222.2 47.4% 11.2%)"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="sentiment_score"
              stroke="hsl(162 47.4% 50.2%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
