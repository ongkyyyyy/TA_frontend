import { useEffect, useState } from "react"
import { getReviews } from "../../../api/apiReviews"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Badge } from "../../ui/badge"
import { Search, ThumbsUp, ThumbsDown, Calendar, Building, ExternalLink } from "lucide-react"
import { FilterBar } from "./reviewsFilters/filter-bar"

export default function ReviewsWithFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reviews, setReviews] = useState([])
  const [activeFilters, setActiveFilters] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews()
        setReviews(data.reviews || [])
      } catch (error) {
        console.error("Failed to load reviews:", error)
      }
    }

    fetchReviews()
  }, [])

  const filteredReviews = reviews.filter((review) => {
    const lower = searchTerm.toLowerCase()
    return (
      review.comment.toLowerCase().includes(lower) ||
      review.username.toLowerCase().includes(lower) ||
      review.hotel_name.toLowerCase().includes(lower) ||
      review.OTA.toLowerCase().includes(lower)
    )
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    return new Date(b.timestamp.split("-").reverse().join("-")) - new Date(a.timestamp.split("-").reverse().join("-"))
  })

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-")
    const date = new Date(`${year}-${month}-${day}`)
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "negative":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "neutral":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const handleClearFilters = () => {
    setActiveFilters(0)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Customer Reviews and Sentiments</h1>
      <p className="text-muted-foreground mb-6">Browse and search through guest feedback</p>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by guest name, hotel, comment or OTA..."
          className="pl-10 py-6 pr-4 rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar activeFilters={activeFilters} onClearFilters={handleClearFilters} />

      {sortedReviews.length > 0 ? (
        <div className="grid gap-6">
          {sortedReviews.map((review, idx) => (
            <Card key={idx} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 bg-slate-50">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-xl">{review.username}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <CardDescription>{formatDate(review.timestamp)}</CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-2xl">{review.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                    <Badge className={`${getSentimentColor(review.sentiment)}`}>{review.sentiment}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <p className="text-gray-700 text-lg leading-relaxed">{review.comment}</p>

                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{review.hotel_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{review.OTA}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 pb-4 border-t flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{review.positive_score} positive points</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ThumbsDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">{review.negative_score} negative points</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  ID: {review.hotel_id?.$oid?.substring(0, 8) || "N/A"}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg">No reviews found matching your search criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search terms or clear the search field.
          </p>
        </div>
      )}
    </div>
  )
}
