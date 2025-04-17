/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Loader2 } from "lucide-react"
import { inputHotels, updateHotel } from "@/api/apiHotels"
import { useToast } from "@/components/toast/use-toast"

export default function HotelForm({ hotel, onClose, hotels, setHotels }) {
  const isEditing = !!hotel
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    hotel_name: "",
    address: "",
    city: "",
    country: "",
    agoda_link: "",
    traveloka_link: "",
    tripcom_link: "",
    ticketcom_link: "",
  })

  useEffect(() => {
    if (hotel) {
      setFormData({
        hotel_name: hotel.hotel_name || "",
        address: hotel.address || "",
        city: hotel.city || "",
        country: hotel.country || "",
        agoda_link: hotel.agoda_link || "",
        traveloka_link: hotel.traveloka_link || "",
        tripcom_link: hotel.tripcom_link || "",
        ticketcom_link: hotel.ticketcom_link || "",
      })
    }
  }, [hotel])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEditing && hotel) {
        // Update existing hotel
        const updatedHotel = await updateHotel(hotel._id, formData)
        setHotels(hotels.map((h) => (h._id === hotel._id ? { ...updatedHotel, _id: hotel._id } : h)))
        toast({
          title: "Success",
          description: "Hotel updated successfully",
        })
      } else {
        const newHotel = await inputHotels(formData)
        setHotels([...hotels, newHotel])
        toast({
          title: "Success",
          description: "Hotel added successfully",
        })
      }
      onClose(true)
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update hotel" : "Failed to add hotel",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hotel_name">Hotel Name *</Label>
              <Input id="hotel_name" name="hotel_name" value={formData.hotel_name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium mb-2">Booking Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agoda_link">Agoda Link</Label>
                <Input
                  id="agoda_link"
                  name="agoda_link"
                  value={formData.agoda_link}
                  onChange={handleChange}
                  placeholder="https://www.agoda.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="traveloka_link">Traveloka Link</Label>
                <Input
                  id="traveloka_link"
                  name="traveloka_link"
                  value={formData.traveloka_link}
                  onChange={handleChange}
                  placeholder="https://www.traveloka.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tripcom_link">Trip.com Link</Label>
                <Input
                  id="tripcom_link"
                  name="tripcom_link"
                  value={formData.tripcom_link}
                  onChange={handleChange}
                  placeholder="https://id.trip.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketcom_link">Tiket.com Link</Label>
                <Input
                  id="ticketcom_link"
                  name="ticketcom_link"
                  value={formData.ticketcom_link}
                  onChange={handleChange}
                  placeholder="https://www.tiket.com/..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Hotel" : "Add Hotel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
