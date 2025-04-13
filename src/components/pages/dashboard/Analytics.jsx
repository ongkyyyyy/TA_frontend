import { useState } from "react"
import { BarChart, LineChart, PieChart, RadarChart } from "recharts"
import { Calendar, ChevronsUpDown, Download, Filter, Hotel, Star, TrendingUp, Users } from "lucide-react"

import { Button } from "../../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart"

export default function HotelAnalytics() {
  const [timeRange, setTimeRange] = useState("30days")

  const reviewTrendData = [
    { date: "Jan", Booking: 4.2, Expedia: 4.1, Airbnb: 4.5, TripAdvisor: 4.3 },
    { date: "Feb", Booking: 4.3, Expedia: 4.2, Airbnb: 4.6, TripAdvisor: 4.4 },
    { date: "Mar", Booking: 4.1, Expedia: 4.0, Airbnb: 4.4, TripAdvisor: 4.2 },
    { date: "Apr", Booking: 4.4, Expedia: 4.3, Airbnb: 4.7, TripAdvisor: 4.5 },
    { date: "May", Booking: 4.5, Expedia: 4.4, Airbnb: 4.8, TripAdvisor: 4.6 },
    { date: "Jun", Booking: 4.6, Expedia: 4.5, Airbnb: 4.9, TripAdvisor: 4.7 },
  ]

  const otaComparison = [
    { name: "Booking.com", reviews: 245, avgScore: 4.5 },
    { name: "Expedia", reviews: 187, avgScore: 4.4 },
    { name: "Airbnb", reviews: 156, avgScore: 4.8 },
    { name: "TripAdvisor", reviews: 203, avgScore: 4.6 },
    { name: "Hotels.com", reviews: 132, avgScore: 4.3 },
  ]

  const recentReviews = [
    {
      id: 1,
      guest: "John D.",
      platform: "Booking.com",
      date: "2023-06-15",
      rating: 5,
      comment: "Excellent stay! The staff was very friendly and the room was spotless.",
    },
    {
      id: 2,
      guest: "Sarah M.",
      platform: "Expedia",
      date: "2023-06-12",
      rating: 4,
      comment: "Great location and comfortable beds. The breakfast could be improved.",
    },
    {
      id: 3,
      guest: "Robert K.",
      platform: "Airbnb",
      date: "2023-06-10",
      rating: 5,
      comment: "Perfect location and amazing amenities. Will definitely come back!",
    },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="top-0 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Hotel className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Hotel Analytics Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                {timeRange === "7days"
                  ? "Last 7 days"
                  : timeRange === "30days"
                    ? "Last 30 days"
                    : timeRange === "90days"
                      ? "Last 90 days"
                      : "Custom"}
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Time Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTimeRange("7days")}>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("30days")}>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("90days")}>Last 90 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("custom")}>Custom range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> 
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overall Rating</CardDescription>
              <CardTitle className="text-3xl">4.6</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 4.6 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">from 923 reviews</span>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
                Up 0.2 from last month
              </p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Reviews</CardDescription>
              <CardTitle className="text-3xl">923</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Across all platforms</span>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
                42 new reviews this month
              </p>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Review Trends</CardTitle>
                  <CardDescription>Average rating by platform over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      Booking: {
                        label: "Booking.com",
                        color: "hsl(var(--chart-1))",
                      },
                      Expedia: {
                        label: "Expedia",
                        color: "hsl(var(--chart-2))",
                      },
                      Airbnb: {
                        label: "Airbnb",
                        color: "hsl(var(--chart-3))",
                      },
                      TripAdvisor: {
                        label: "TripAdvisor",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    className="aspect-[4/3]"
                  >
                    <LineChart
                      data={reviewTrendData}
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>OTA Comparison</CardTitle>
                  <CardDescription>Review volume and scores by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {otaComparison.map((ota) => (
                      <div key={ota.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-24 font-medium truncate">{ota.name}</div>
                          <div className="text-sm text-muted-foreground">({ota.reviews} reviews)</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${star <= Math.floor(ota.avgScore) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <div className="font-medium">{ota.avgScore.toFixed(1)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="platforms" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Platform Breakdown</CardTitle>
                    <CardDescription>Review distribution across platforms</CardDescription>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="booking">Booking.com</SelectItem>
                      <SelectItem value="expedia">Expedia</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                      <SelectItem value="hotels">Hotels.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Reviews",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="aspect-[16/9]"
                >
                  <PieChart
                    data={[
                      { name: "Booking.com", value: 245 },
                      { name: "Expedia", value: 187 },
                      { name: "Airbnb", value: 156 },
                      { name: "TripAdvisor", value: 203 },
                      { name: "Hotels.com", value: 132 },
                    ]}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                  <CardDescription>Review volume growth by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      Booking: {
                        label: "Booking.com",
                        color: "hsl(var(--chart-1))",
                      },
                      Expedia: {
                        label: "Expedia",
                        color: "hsl(var(--chart-2))",
                      },
                      Airbnb: {
                        label: "Airbnb",
                        color: "hsl(var(--chart-3))",
                      },
                      TripAdvisor: {
                        label: "TripAdvisor",
                        color: "hsl(var(--chart-4))",
                      },
                      Hotels: {
                        label: "Hotels.com",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="aspect-[4/3]"
                  >
                    <BarChart
                      data={[
                        { month: "Jan", Booking: 32, Expedia: 25, Airbnb: 18, TripAdvisor: 29, Hotels: 15 },
                        { month: "Feb", Booking: 37, Expedia: 28, Airbnb: 23, TripAdvisor: 31, Hotels: 19 },
                        { month: "Mar", Booking: 41, Expedia: 32, Airbnb: 27, TripAdvisor: 36, Hotels: 22 },
                        { month: "Apr", Booking: 45, Expedia: 35, Airbnb: 29, TripAdvisor: 38, Hotels: 25 },
                        { month: "May", Booking: 48, Expedia: 38, Airbnb: 31, TripAdvisor: 41, Hotels: 27 },
                        { month: "Jun", Booking: 42, Expedia: 29, Airbnb: 28, TripAdvisor: 28, Hotels: 24 },
                      ]}
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Response Performance</CardTitle>
                  <CardDescription>Response rate and time by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {otaComparison.map((ota) => (
                      <div key={ota.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{ota.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Response rate: {Math.floor(Math.random() * 20) + 80}%
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${Math.floor(Math.random() * 20) + 80}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg. response time: {Math.floor(Math.random() * 12) + 4} hours
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Reviews</CardTitle>
                    <CardDescription>Latest guest feedback across all platforms</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="booking">Booking.com</SelectItem>
                        <SelectItem value="expedia">Expedia</SelectItem>
                        <SelectItem value="airbnb">Airbnb</SelectItem>
                        <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                        <SelectItem value="hotels">Hotels.com</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="w-[300px]">Comment</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.guest}</TableCell>
                        <TableCell>{review.platform}</TableCell>
                        <TableCell>{review.date}</TableCell>
                        <TableCell>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">{review.comment}</TableCell>
                        <TableCell>
                          {Math.random() > 0.3 ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Responded
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Pending
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Showing 5 of 923 reviews</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Positive vs negative feedback trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      Positive: {
                        label: "Positive",
                        color: "hsl(var(--chart-1))",
                      },
                      Neutral: {
                        label: "Neutral",
                        color: "hsl(var(--chart-2))",
                      },
                      Negative: {
                        label: "Negative",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="aspect-[4/3]"
                  >
                    <LineChart
                      data={[
                        { month: "Jan", Positive: 65, Neutral: 25, Negative: 10 },
                        { month: "Feb", Positive: 68, Neutral: 22, Negative: 10 },
                        { month: "Mar", Positive: 62, Neutral: 28, Negative: 10 },
                        { month: "Apr", Positive: 70, Neutral: 20, Negative: 10 },
                        { month: "May", Positive: 72, Neutral: 18, Negative: 10 },
                        { month: "Jun", Positive: 75, Neutral: 15, Negative: 10 },
                      ]}
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
