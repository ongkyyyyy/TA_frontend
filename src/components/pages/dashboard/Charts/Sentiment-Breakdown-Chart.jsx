/* eslint-disable react/prop-types */
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

export function SentimentBreakdownChart({ data }) {
  let allSentimentsZero = true
  for (let i = 0; i < data.length; i++) {
    if (data[i].positive_sentiment !== 0 || data[i].neutral_sentiment !== 0 || data[i].negative_sentiment !== 0) {
      allSentimentsZero = false
      break
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Breakdown</CardTitle>
        <CardDescription>Number of positive, neutral, and negative sentiments per month</CardDescription>
      </CardHeader>
      <CardContent>
        {allSentimentsZero ? (
          <div className="flex h-full w-full aspect-[16/9] items-center justify-center flex-col text-center p-6">
            <p className="text-lg font-medium text-muted-foreground mb-2">No Sentiment Data Available</p>
            <p className="text-sm text-muted-foreground">
              Sentiment data is not available for the selected period. Please select a different time range or check
              data sources.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={{
              positive_sentiment: {
                label: "Positive Sentiment",
                color: "hsl(142 76% 36%)",
              },
              neutral_sentiment: {
                label: "Neutral Sentiment",
                color: "hsl(43 74% 66%)",
              },
              negative_sentiment: {
                label: "Negative Sentiment",
                color: "hsl(0 84% 60%)",
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
              <ChartTooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                        return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold mb-2 text-black">{`Month: ${label}`}</p>
                            {payload.map((entry, index) => (
                                <p key={index} className="text-sm text-black">
                                {`${entry.name}: ${entry.value} reviews`}
                                </p>
                            ))}
                            </div>
                        )
                        }
                        return null
                    }}
                    />
              <Line
                type="monotone"
                dataKey="Positive Sentiment"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Neutral Sentiment"
                stroke="hsl(43 74% 66%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Negative Sentiment"
                stroke="hsl(0 84% 60%)"
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
