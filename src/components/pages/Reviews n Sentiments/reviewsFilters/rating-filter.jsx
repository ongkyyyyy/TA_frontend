/* eslint-disable react/prop-types */
import { useState } from "react"
import { Slider } from "../../../ui/slider"
import { Star } from "lucide-react"
import { Button } from "../../../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover"

export function RatingFilter({ onFilterChange }) {
  const [range, setRange] = useState([0, 10])

  const handleRangeChange = (value) => {
    const newRange = [value[0], value[1]]
    setRange(newRange)
    if (onFilterChange) {
      onFilterChange(newRange[0], newRange[1])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Star className="mr-2 h-4 w-4" />
          Rating
          {(range[0] > 0 || range[1] < 10) && (
            <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
              {range[0]}-{range[1]}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Filter by Rating</h4>
          <div className="px-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Min: {range[0].toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">Max: {range[1].toFixed(1)}</span>
            </div>
            <Slider
              defaultValue={[0, 10]}
              max={10}
              step={0.1}
              value={range}
              onValueChange={handleRangeChange}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>2.5</span>
              <span>5.0</span>
              <span>7.5</span>
              <span>10</span>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => handleRangeChange([0, 10])} className="text-xs">
              Reset
            </Button>
            <Button size="sm" onClick={() => handleRangeChange([7, 10])} className="text-xs">
              High Ratings (7+)
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
