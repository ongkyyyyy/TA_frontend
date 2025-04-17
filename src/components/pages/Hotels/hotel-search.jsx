/* eslint-disable react/prop-types */

import { Input } from "../../ui/input"
import { Search, X } from "lucide-react"
import { Button } from "../../ui/button"

export default function SearchBar({ searchTerm, setSearchTerm }) {
  const handleClear = () => {
    setSearchTerm("")
  }

  return (
    <div className="relative w-full sm:w-80">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search hotels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 pr-10"
      />
      {searchTerm && (
        <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-9 w-9 p-0" onClick={handleClear}>
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
