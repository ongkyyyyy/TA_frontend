/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Slider } from "../../../ui/slider";
import { Star } from "lucide-react";
import { Button } from "../../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";

export function RatingFilter({ onFilterChange , resetSignal}) {
  const [tempRange, setTempRange] = useState([0, 10]);
  const [appliedRange, setAppliedRange] = useState([0, 10]);
  const [open, setOpen] = useState(false);

  const handleSliderChange = (value) => {
    setTempRange([value[0], value[1]]);
  };

  const handleConfirm = () => {
    setAppliedRange(tempRange);
    if (onFilterChange) {
      onFilterChange({ min: tempRange[0], max: tempRange[1] });
    }
    setOpen(false);
  };

  const handleReset = () => {
    setTempRange([0, 10]);
    setAppliedRange([0, 10]);
    if (onFilterChange) {
      onFilterChange({ min: 0, max: 10 });
    }
  };

  useEffect(() => {
    handleReset();
  }, [resetSignal]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Star className="mr-2 h-4 w-4" />
          Rating
          {(appliedRange[0] > 0 || appliedRange[1] < 10) && (
            <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
              {appliedRange[0]}-{appliedRange[1]}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Filter by Rating</h4>
          <div className="px-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Min: {tempRange[0].toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">Max: {tempRange[1].toFixed(1)}</span>
            </div>
            <Slider
              defaultValue={[0, 10]}
              max={10}
              step={0.1}
              value={tempRange}
              onValueChange={handleSliderChange}
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
            <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
              Reset
            </Button>
            <Button size="sm" onClick={handleConfirm} className="text-xs">
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
