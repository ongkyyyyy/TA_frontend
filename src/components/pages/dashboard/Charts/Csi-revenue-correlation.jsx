/* eslint-disable react/prop-types */
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function CSIRevenueCorrelation({ data }) {
    const allRevenuesZero = data.every((item) => item.y === 0)
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>CSI vs Revenue Correlation</CardTitle>
          <CardDescription>
            {allRevenuesZero
              ? "Composite Sentiment Index distribution (revenue data not available)"
              : "Exploring the relationship between sentiment and revenue performance"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allRevenuesZero ? (
            <div className="flex h-[400px] items-center justify-center flex-col text-center p-6">
              <p className="text-lg font-medium text-muted-foreground mb-2">Cannot Generate Correlation</p>
              <p className="text-sm text-muted-foreground">
                Revenue data is required to generate a correlation scatter plot. Please select a different time range or
                check data sources.
              </p>
            </div>
          ) : (
            <ChartContainer
              config={{
                x: {
                  label: "Composite Sentiment Index",
                  color: "hsl(222.2 47.4% 11.2%)", 
                },
                y: {
                  label: "Gross Revenue",
                  color: "hsl(162 47.4% 50.2%)",
                },
              }}
              className="h-[400px]"
            >
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Composite Sentiment Index"
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  label={{ value: "CSI (%)", position: "bottom", offset: 0 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Gross Revenue"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  label={{ value: "Revenue", angle: -90, position: "insideLeft" }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 400]} name="Review Volume" />
                <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
                <Scatter name="Hotels" data={data} fill="hsl(222.2 47.4% 11.2%)" />
              </ScatterChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    )
  }