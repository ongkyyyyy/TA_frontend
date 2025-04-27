/* eslint-disable react/prop-types */
import { Filter } from "lucide-react"
import { Button } from "../../../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu"
import { useState, useEffect } from "react"

export function SentimentFilter({ onFilterChange, resetSignal }) {
  const [selectedSentiment, setSelectedSentiment] = useState("all")

  const handleSentimentChange = (sentiment) => {
    setSelectedSentiment(sentiment)
    if (onFilterChange) {
      onFilterChange(sentiment)
    }
  }

   useEffect(() => {
    setSelectedSentiment("all")
  }, [resetSignal])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          Sentiment
          {selectedSentiment !== "all" && (
            <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
              {selectedSentiment}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Filter by Sentiment</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={selectedSentiment === "all"}
          onCheckedChange={() => handleSentimentChange("all")}
        >
          All Sentiments
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedSentiment === "positive"}
          onCheckedChange={() => handleSentimentChange("positive")}
        >
          Positive
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedSentiment === "negative"}
          onCheckedChange={() => handleSentimentChange("negative")}
        >
          Negative
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedSentiment === "neutral"}
          onCheckedChange={() => handleSentimentChange("neutral")}
        >
          Neutral
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
