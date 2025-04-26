/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Loader2 } from "lucide-react"
import { inputHotels, updateHotel } from "@/api/apiHotels"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function HotelForm({ hotel, onClose }) {
  const isEditing = !!hotel
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
        await updateHotel(hotel._id, formData)
        toast.success("Hotel updated successfully")
        onClose(formData, true) // 👈 pass true to refetch
      } else {
        await inputHotels(formData)
        toast.success("Hotel added successfully")
        onClose(formData, true) // 👈 pass true to refetch
      }
    } catch (error) {
      console.log(error)
      toast.error(isEditing ? "Failed to update hotel" : "Failed to add hotel")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the hotel’s information below."
              : "Fill in the details to add a new hotel."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["hotel_name", "address", "city", "country"].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>{field.split("_").join(" ").toUpperCase()} *</Label>
                <Input
                  id={field}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium mb-2">Booking Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["agoda_link", "traveloka_link", "tripcom_link", "ticketcom_link"].map((linkField) => (
                <div key={linkField} className="space-y-2">
                  <Label htmlFor={linkField}>{linkField.split("_")[0]} Link</Label>
                  <Input
                    id={linkField}
                    name={linkField}
                    value={formData[linkField] || ""}
                    onChange={handleChange}
                    placeholder={`https://${linkField.split("_")[0]}.com/...`}
                  />
                </div>
              ))}
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
