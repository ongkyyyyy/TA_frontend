"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, Search, ThumbsDown, ThumbsUp, Minus } from "lucide-react"

// Mock data for reviews with sentiment analysis
const reviewsData = [
  {
    id: 1,
    author: "Sarah Johnson",
    date: "2023-10-15",
    rating: 5,
    content: "Absolutely love this product! It exceeded all my expectations and the quality is outstanding.",
    sentiment: "positive",
  },
  {
    id: 2,
    author: "Michael Chen",
    date: "2023-10-12",
    rating: 3,
    content: "It's okay. Does what it's supposed to do, but nothing special about it.",
    sentiment: "neutral",
  },
  {
    id: 3,
    author: "Emily Rodriguez",
    date: "2023-10-10",
    rating: 1,
    content: "Very disappointed with this purchase. Broke after a week of use and customer service was unhelpful.",
    sentiment: "negative",
  },
  {
    id: 4,
    author: "David Kim",
    date: "2023-10-08",
    rating: 4,
    content: "Great product for the price. Would recommend to friends looking for something reliable.",
    sentiment: "positive",
  },
  {
    id: 5,
    author: "Jessica Taylor",
    date: "2023-10-05",
    rating: 2,
    content: "The product is mediocre at best. Expected better quality for the price point.",
    sentiment: "negative",
  },
  {
    id: 6,
    author: "Robert Wilson",
    date: "2023-10-01",
    rating: 5,
    content: "This is exactly what I needed! Fast shipping and the product works perfectly.",
    sentiment: "positive",
  },
  {
    id: 7,
    author: "Amanda Lee",
    date: "2023-09-28",
    rating: 3,
    content: "It serves its purpose. Neither impressed nor disappointed with the purchase.",
    sentiment: "neutral",
  },
  {
    id: 8,
    author: "Thomas Brown",
    date: "2023-09-25",
    rating: 1,
    content: "Terrible quality. Save your money and look elsewhere. Not worth the hassle.",
    sentiment: "negative",
  },
]

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [activeTab, setActiveTab] = useState("all")

  // Filter reviews based on search term and active tab
  const filteredReviews = reviewsData.filter((review) => {
    const matchesSearch =
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.author.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && review.sentiment === activeTab
  })

  // Sort reviews based on selected option
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      default:
        return 0
    }
  })

  // Get counts for each sentiment category
  const sentimentCounts = {
    all: reviewsData.length,
    positive: reviewsData.filter((review) => review.sentiment === "positive").length,
    neutral: reviewsData.filter((review) => review.sentiment === "neutral").length,
    negative: reviewsData.filter((review) => review.sentiment === "negative").length,
  }

  // Helper function to render sentiment icon
  const renderSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-5 w-5 text-green-500" />
      case "negative":
        return <ThumbsDown className="h-5 w-5 text-red-500" />
      case "neutral":
        return <Minus className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  // Helper function to render sentiment badge
  const renderSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Positive</Badge>
      case "negative":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Negative</Badge>
      case "neutral":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Neutral</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reviews..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              Sort by: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("oldest")}>Oldest first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("highest")}>Highest rating</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("lowest")}>Lowest rating</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sentiment Tabs */}
      <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All ({sentimentCounts.all})</TabsTrigger>
          <TabsTrigger value="positive">Positive ({sentimentCounts.positive})</TabsTrigger>
          <TabsTrigger value="neutral">Neutral ({sentimentCounts.neutral})</TabsTrigger>
          <TabsTrigger value="negative">Negative ({sentimentCounts.negative})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {sortedReviews.length > 0 ? (
            <div className="grid gap-4">
              {sortedReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{review.author}</CardTitle>
                        <CardDescription>
                          {new Date(review.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderSentimentBadge(review.sentiment)}
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{review.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0 border-t flex justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      Sentiment: {renderSentimentIcon(review.sentiment)}
                    </div>
                    <Button variant="ghost" size="sm">
                      Report
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">No reviews found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination (simplified) */}
      {sortedReviews.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" size="sm" className="mx-1">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="mx-1 bg-primary text-primary-foreground hover:bg-primary/90">
            1
          </Button>
          <Button variant="outline" size="sm" className="mx-1">
            2
          </Button>
          <Button variant="outline" size="sm" className="mx-1">
            3
          </Button>
          <Button variant="outline" size="sm" className="mx-1">
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
