/* eslint-disable react/prop-types */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function SentimentDistribution({ data, isLoading = false }) {
  if (isLoading || !data) {
    return (
      <Card className="bg-white/50 animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-7 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const { summary } = data
  const total = summary.total_reviews

  const positivePercentage = (summary.total_positive_sentiment / total) * 100
  const negativePercentage = (summary.total_negative_sentiment / total) * 100
  const neutralPercentage = (summary.total_neutral_sentiment / total) * 100

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardDescription>Sentiment Analysis</CardDescription>
        <CardTitle>Sentiment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-green-600 font-medium">Positive</span>
              <span>
                {summary.total_positive_sentiment} ({positivePercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={positivePercentage} className="h-3 bg-gray-100"  />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-amber-600 font-medium">Neutral</span>
              <span>
                {summary.total_neutral_sentiment} ({neutralPercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={neutralPercentage} className="h-3 bg-gray-100" />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-red-600 font-medium">Negative</span>
              <span>
                {summary.total_negative_sentiment} ({negativePercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={negativePercentage} className="h-3 bg-gray-100" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
