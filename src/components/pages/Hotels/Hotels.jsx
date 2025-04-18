/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react"
import { getHotels, deleteHotel } from "@/api/apiHotels"
import HotelsList from "./hotels-list"
import HotelForm from "./hotel-form"
import SearchBar from "./hotel-search"
import { Button } from "../../ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import { useToast } from "../../toast/use-toast"
import DeleteConfirmation from "./hotel-delete-confirmation"

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
  const { successToast, errorToast} = useToast();

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
      errorToast("Failed to fetch hotels. Please try again later.");
      error
    } finally {
      setIsLoading(false)
    }
  }, [])  

  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  useEffect(() => {
    if (searchTerm) {
      const filtered = hotels.filter(
        (hotel) =>
          hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.country.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredHotels(filtered)
    } else {
      setFilteredHotels(hotels)
    }
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
      successToast(`${hotelToDelete.hotel_name} has been deleted.`);
    } catch (error) {
      console.log(error)
      errorToast("Failed to delete hotel. Please try again.");
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
      <h1 className="text-3xl font-bold">Hotels</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex gap-2">
          <Button onClick={handleAddHotel} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Hotel
          </Button>
          <Button variant="outline" onClick={fetchHotels} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-4 rounded-md">{error}</div>}

      <HotelsList hotels={filteredHotels} isLoading={isLoading} onEdit={handleEditHotel} onDelete={handleDeleteHotel} />

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
