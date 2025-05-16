/* eslint-disable react-hooks/exhaustive-deps */
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "../../ui/pagination"
import { useState, useEffect, useCallback, useMemo } from "react"
import { getHotels, deleteHotel, searchHotels } from "@/api/apiHotels"
import HotelsList from "./hotels-list"
import HotelForm from "./hotel-form"
import SearchBar from "./hotel-search"
import { Button } from "../../ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import DeleteConfirmation from "./hotel-delete-confirmation"
import { debounce } from "lodash"
import { toast } from "react-toastify"
import { Separator } from "@/components/ui/separator"
import { CardTitle, CardDescription } from "@/components/ui/card"

export default function Hotels() {
  const [filteredHotels, setFilteredHotels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [hotelToDelete, setHotelToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalHotels, setTotalHotels] = useState(0)
  const [isRefetching, setIsRefetching] = useState(false)
  const HOTELS_PER_PAGE = 15

  const fetchHotels = useCallback(async (page = 1, silent = false) => {
    if (typeof page !== "number") {
      console.warn("fetchHotels received invalid page value:", page)
      page = 1
    }

    if (!silent) {
      setIsLoading(true) 
    } else {
      setIsRefetching(true) 
    }

    setError(null)
    try {
      const res = await getHotels(page, HOTELS_PER_PAGE)
      setFilteredHotels(res.data)
      setTotalHotels(res.total)
      setCurrentPage(res.page)
    } catch (error) {
      console.log(error)
      setError("Failed to fetch hotels. Please try again later.")
      toast.error("Failed to fetch hotels. Please try again later.")
    } finally {
      if (!silent) {
        setIsLoading(false)
      } else {
        setIsRefetching(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  const debouncedSearch = useMemo(
    () =>
      debounce((term, page = 1) => {
        if (term.trim() !== "") {
          searchHotels(term, page, HOTELS_PER_PAGE)
            .then((res) => {
              setFilteredHotels(res.data)
              setTotalHotels(res.total)
              setCurrentPage(res.page)
            })
            .catch((error) => {
              console.error(error)
              toast.error("Failed to search hotels.")
            })
        } else {
          fetchHotels(page)
        }
      }, 500),
    [fetchHotels],
  )

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      debouncedSearch(searchTerm, currentPage)
    } else {
      fetchHotels(currentPage)
    }
    return () => debouncedSearch.cancel()
  }, [searchTerm, currentPage])

  const handleAddHotel = () => {
    setSelectedHotel(null)
    setIsFormOpen(true)
  }

  const handleEditHotel = (hotel) => {
    setSelectedHotel(hotel)
    setIsFormOpen(true)
  }

  const handleDeleteHotel = (hotel) => {
    setHotelToDelete(hotel)
    setIsDeleteModalOpen(true)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    setCurrentPage(1)
  }

  const confirmDelete = async () => {
    if (!hotelToDelete) return

    try {
      await deleteHotel(hotelToDelete._id)
      setFilteredHotels((prevHotels) => prevHotels.filter((h) => h._id !== hotelToDelete._id))
      toast.success(`${hotelToDelete.hotel_name} has been deleted.`)
      fetchHotels(currentPage, true)
      const remainingItems = filteredHotels.length - 1
      if (remainingItems === 0 && currentPage > 1) {
        fetchHotels(currentPage - 1, true)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete hotel. Please try again.")
    } finally {
      setIsDeleteModalOpen(false)
      setHotelToDelete(null)
    }
  }

  const handleFormClose = (hotel, shouldRefresh) => {
    setIsFormOpen(false)
    if (shouldRefresh) {
      fetchHotels(currentPage, true) 
    }
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <CardTitle className="text-3xl font-bold">Hotel Revenues Management</CardTitle>
        <CardDescription className="mt-2">
          Manage hotel names, locations, and OTA links efficiently in one place.
        </CardDescription>
      </div>

      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} onClear={handleClearSearch} />
        <div className="flex gap-2">
          <Button onClick={handleAddHotel} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Hotel
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              handleClearSearch() 
              fetchHotels(1)
            }}
            disabled={isLoading || isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isRefetching ? "animate-spin" : ""}`} />
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-4 rounded-md">{error}</div>}

      <HotelsList hotels={filteredHotels} isLoading={isLoading} onEdit={handleEditHotel} onDelete={handleDeleteHotel} />
      {!isLoading && Array.isArray(filteredHotels) && filteredHotels.length > 0 && (
        <Pagination>
          <PaginationContent className="justify-center mt-4">
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => {
                  if (currentPage > 1) {
                    if (searchTerm) {
                      debouncedSearch(searchTerm, currentPage - 1)
                    } else {
                      fetchHotels(currentPage - 1)
                    }
                  }
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {Math.ceil(totalHotels / HOTELS_PER_PAGE)}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => {
                  const maxPage = Math.ceil(totalHotels / HOTELS_PER_PAGE)
                  if (currentPage < maxPage) {
                    if (searchTerm) {
                      debouncedSearch(searchTerm, currentPage + 1)
                    } else {
                      fetchHotels(currentPage + 1)
                    }
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {isFormOpen && (
        <HotelForm
          isOpen={isFormOpen}
          hotel={selectedHotel}
          isEditing={!!selectedHotel}
          onClose={handleFormClose}
        />
      )}

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        hotel={hotelToDelete}
      />
    </div>
  )
}
