"use client"

/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useMemo } from "react"
import { getHotels, deleteHotel } from "@/api/apiHotels"
import HotelsList from "./hotels-list"
import HotelForm from "./hotel-form"
import SearchBar from "./hotel-search"
import { Button } from "../../ui/button"
import { PlusCircle } from "lucide-react"
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
  const HOTELS_PER_PAGE = 15
  const [isSearching, setIsSearching] = useState(false)

  const fetchHotels = useCallback(async (page = 1, silent = false, term = "", searching = false) => {
    if (!silent && !searching) setIsLoading(true)
    if (searching) setIsSearching(true)
    setError(null)

    try {
      const res = await getHotels(page, HOTELS_PER_PAGE, term)
      setFilteredHotels(res.data)
      setTotalHotels(res.total)
      setCurrentPage(res.page)
    } catch (error) {
      console.log(error)
      setError("Failed to fetch hotels. Please try again later.")
      toast.error("Failed to fetch hotels. Please try again later.")
    } finally {
      if (!silent && !searching) setIsLoading(false)
      if (searching) setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  const debouncedSearch = useMemo(
    () =>
      debounce((term, page = 1) => {
        fetchHotels(page, false, term, true)
      }, 500),
    [fetchHotels],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  useEffect(() => {
    debouncedSearch(searchTerm, currentPage)
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
        <CardTitle className="text-3xl font-bold">Hotels Management</CardTitle>
        <CardDescription className="mt-2">
          Manage hotel names, locations, and OTA links efficiently in one place.
        </CardDescription>
      </div>

      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} onClear={handleClearSearch} />
        {isSearching && <span className="text-muted-foreground text-sm"></span>}
        <div className="flex gap-2">
          <Button onClick={handleAddHotel} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Hotel
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-4 rounded-md">{error}</div>}

      <HotelsList hotels={filteredHotels} isLoading={isLoading} onEdit={handleEditHotel} onDelete={handleDeleteHotel} />
      {!isLoading && Array.isArray(filteredHotels) && filteredHotels.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => {
              if (currentPage > 1) {
                if (searchTerm) {
                  debouncedSearch(searchTerm, currentPage - 1)
                } else {
                  fetchHotels(currentPage - 1)
                }
              }
            }}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(Math.ceil(totalHotels / HOTELS_PER_PAGE), 5) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={i}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-9 h-9"
                  onClick={() => {
                    if (searchTerm) {
                      debouncedSearch(searchTerm, pageNum)
                    } else {
                      fetchHotels(pageNum)
                    }
                  }}
                  disabled={isLoading}
                >
                  {pageNum}
                </Button>
              )
            })}
            {Math.ceil(totalHotels / HOTELS_PER_PAGE) > 5 && (
              <>
                <span className="mx-1">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-9 h-9"
                  onClick={() => {
                    const totalPages = Math.ceil(totalHotels / HOTELS_PER_PAGE)
                    if (searchTerm) {
                      debouncedSearch(searchTerm, totalPages)
                    } else {
                      fetchHotels(totalPages)
                    }
                  }}
                  disabled={isLoading}
                >
                  {Math.ceil(totalHotels / HOTELS_PER_PAGE)}
                </Button>
              </>
            )}
          </div>
          <Button
            variant="outline"
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
            disabled={currentPage === Math.ceil(totalHotels / HOTELS_PER_PAGE) || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      {isFormOpen && (
        <HotelForm isOpen={isFormOpen} hotel={selectedHotel} isEditing={!!selectedHotel} onClose={handleFormClose} />
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
