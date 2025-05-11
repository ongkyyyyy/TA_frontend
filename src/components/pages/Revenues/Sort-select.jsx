/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";

export function SortSelect({ onSortChange, resetSignal, defaultValue }) {
  const [sortValue, setSortValue] = useState(defaultValue || "");

  useEffect(() => {
    setSortValue(defaultValue || "");
  }, [resetSignal, defaultValue]);

  const handleSelect = (value) => {
    setSortValue(value);
    if (onSortChange) onSortChange(value);
  };

  return (
    <Select value={sortValue} onValueChange={handleSelect}>
      <SelectTrigger className="h-9 gap-2 border border-dashed rounded-md px-3 text-sm font-medium text-foreground shadow-none">
        <SlidersHorizontal className="h-4 w-4 text-black" />
        <SelectValue placeholder="Sort by" className="text-black" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date-asc">Date (Ascending)</SelectItem>
        <SelectItem value="date-desc">Date (Descending)</SelectItem>
        <SelectItem value="revenue-asc">Revenue (Ascending)</SelectItem>
        <SelectItem value="revenue-desc">Revenue (Descending)</SelectItem>
      </SelectContent>
    </Select>
  );
}
