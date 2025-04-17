import { useState, useEffect } from "react"
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

  const { toast } = useToast()

  const fetchHotels = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getHotels()
      setHotels(data)
      setFilteredHotels(data)
    } catch (err) {
      setError("Failed to fetch hotels. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to fetch hotels. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

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
      toast({
        title: "Success",
        description: `${hotelToDelete.hotel_name} has been deleted.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete hotel. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteModalOpen(false)
      setHotelToDelete(null)
    }
  }

  const handleFormClose = (hotelAdded = false) => {
    setIsFormOpen(false)
    if (hotelAdded) {
      fetchHotels()
    }
  }

  return (
    <div className="space-y-6">
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
        <HotelForm hotel={selectedHotel} onClose={handleFormClose} hotels={hotels} setHotels={setHotels} />
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
