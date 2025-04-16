import { useEffect, useState } from "react"
import { getReviews } from "../../api/apiReviews"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reviews, setReviews] = useState([])

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
      review.username.toLowerCase().includes(lower)
    )
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    return new Date(b.timestamp.split("-").reverse().join("-")) - new Date(a.timestamp.split("-").reverse().join("-"))
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search reviews..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {sortedReviews.length > 0 ? (
        <div className="grid gap-4">
          {sortedReviews.map((review, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{review.username}</CardTitle>
                    <CardDescription>{review.timestamp}</CardDescription>
                    <p className="text-sm text-muted-foreground">{review.hotel_name} - {review.OTA}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(10)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{review.comment}</p>
              </CardContent>
              <CardFooter className="pt-0 border-t flex justify-end">
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">No reviews found.</p>
        </div>
      )}
    </div>
  )
}
