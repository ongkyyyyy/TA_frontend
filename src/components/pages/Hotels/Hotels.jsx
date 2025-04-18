/* eslint-disable react-hooks/exhaustive-deps */
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

export default function Hotels() {
  const [hotels, setHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [hotelToDelete, setHotelToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchHotels = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getHotels()
      setHotels(data)
      setFilteredHotels(data)
    } catch (error) {
      console.log(error)
      setError("Failed to fetch hotels. Please try again later.")
      toast.error("Failed to fetch hotels. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  const debouncedSearch = useMemo(() => debounce((term) => {
    if (term.trim() !== "") {
      searchHotels(term)
        .then(setFilteredHotels)
        .catch((error) => {
          console.error(error)
          toast.error("Failed to search hotels.")
        });
    } else {
      setFilteredHotels(hotels)
    }
  }, 500), [hotels]);

  useEffect(() => {
    debouncedSearch(searchTerm)
    return () => debouncedSearch.cancel()
  }, [searchTerm, hotels])

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

  const confirmDelete = async () => {
    if (!hotelToDelete) return

    try {
      await deleteHotel(hotelToDelete._id)
      setHotels(hotels.filter((h) => h._id !== hotelToDelete._id))
      toast.success(`${hotelToDelete.hotel_name} has been deleted.`)
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete hotel. Please try again.")
    } finally {
      setIsDeleteModalOpen(false)
      setHotelToDelete(null)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    fetchHotels()
  }

  return (
    <div className="space-y-6 py-6">
      <h1 className="text-3xl font-bold">Hotels Management</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        <div className="flex gap-2">
          <Button onClick={handleAddHotel} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Hotel
          </Button>
          <Button
            variant="outline"
            onClick={fetchHotels}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-4 rounded-md">{error}</div>}

      <HotelsList
        hotels={filteredHotels}
        isLoading={isLoading}
        onEdit={handleEditHotel}
        onDelete={handleDeleteHotel}
      />

      {isFormOpen && (
        <HotelForm hotel={selectedHotel} onClose={handleFormClose} setHotels={setHotels} />
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
