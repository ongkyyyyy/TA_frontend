/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-toastify"
import { inputRevenue, updateRevenue } from "@/api/apiRevenues"
import { getHotelsDropdown } from "@/api/apiHotels"
import { parse } from "date-fns"

const FormField = ({ label, value, onChange, readOnly = false, type = "number", hint }) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={
        !readOnly && onChange
          ? (e) => onChange(type === "number" ? Number.parseFloat(e.target.value) || 0 : e.target.value)
          : undefined
      }
      disabled={readOnly}
      className={readOnly ? "bg-muted cursor-not-allowed" : ""}
    />
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
)

const defaultFormData = {
  date: format(new Date(), "dd-MM-yyyy"),
  room_details: { room_lodging: 0, rebate_discount: 0, total_room_revenue: 0 },
  restaurant: { breakfast: 0, restaurant_food: 0, restaurant_beverage: 0, total_restaurant_revenue: 0 },
  other_revenue: {
    other_room_revenue: 0,
    telephone: 0,
    business_center: 0,
    other_income: 0,
    spa_therapy: 0,
    misc: 0,
    allowance_other: 0,
    total_other_revenue: 0,
  },
  nett_revenue: 0,
  service_charge: 0,
  government_tax: 0,
  gross_revenue: 0,
  ap_restaurant: 0,
  tips: 0,
  grand_total_revenue: 0,
  room_stats: {
    active_rooms: 100,
    room_available: 90,
    house_use: 0,
    complimentary: 0,
    rooms_occupied: 0,
    rooms_sold: 0,
    vacant_rooms: 0,
    occupancy: 0,
    guests_in_house: 0,
    average_room_rate: 0,
  },
}

export function RevenueForm({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(defaultFormData)
  const [hotels, setHotels] = useState([])

  useEffect(() => {
    if (initialData) {
      const newData = structuredClone(initialData)
      newData.hotel_id = getIdString(initialData.hotel_id)
      calculateTotals(newData)
      setFormData(newData)
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData])

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotelsDropdown()
        setHotels(data)
      } catch (err) {
        console.error(err)
        toast.error("Failed to fetch hotel list")
      }
    }

    if (isOpen) {
      fetchHotels()
    }
  }, [isOpen])

  const updateFormData = (path, value) => {
    setFormData((prev) => {
      const newData = structuredClone(prev)
      const keys = path.split(".")
      let curr = newData
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!curr[key]) curr[key] = {}
        curr = curr[key]
      }
      curr[keys[keys.length - 1]] = value
      return calculateTotals(newData)
    })
  }

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      updateFormData("date", format(date, "dd-MM-yyyy"))
    }
  }

  const getIdString = (id) => {
    if (!id) return ""
    if (typeof id === "string") return id
    if (id.$oid) return id.$oid
    if (id._id) return typeof id._id === "string" ? id._id : id._id.$oid || ""
    return String(id)
  }

  const handleSubmit = async () => {
    if (!formData.hotel_id) {
      toast.error("Please select a hotel.")
      return
    }

    console.log("Submitting form data:", formData)

    const payload = {
      hotel_id: formData.hotel_id,
      date: formData.date,
      room_details: formData.room_details,
      restaurant: formData.restaurant,
      other_revenue: formData.other_revenue,
      room_stats: formData.room_stats,
      nett_revenue: formData.nett_revenue,
      service_charge: formData.service_charge,
      government_tax: formData.government_tax,
      gross_revenue: formData.gross_revenue,
      ap_restaurant: formData.ap_restaurant,
      tips: formData.tips,
      grand_total_revenue: formData.grand_total_revenue,
    }

    try {
      let result
      if (initialData?._id) {
       result = await updateRevenue(getIdString(initialData._id), payload)
        toast.success("Revenue data updated successfully.")
      } else {
        result = await inputRevenue(payload)
        toast.success("Revenue data created successfully.")
      }

      if (result?.data) {
        onSubmit?.(result?.data)
      }
      onClose?.()
    } catch (err) {
      console.error(err)
      toast.error("Failed to submit data. Please try again.")
    }
  }

  const renderFields = (fields, basePath = "") => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {fields.map(({ label, key, readOnly, hint }) => {
        const fullKey = basePath ? `${basePath}.${key}` : key
        const value = fullKey.split(".").reduce((o, k) => o?.[k], formData)
        return (
          <FormField
            key={fullKey}
            label={label}
            value={value}
            readOnly={readOnly}
            hint={hint}
            onChange={readOnly ? undefined : (val) => updateFormData(fullKey, val)}
          />
        )
      })}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto top-[7%] translate-y-0">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Revenue Data" : "Add New Revenue Data"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the revenue information." : "Fill in the revenue record details."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-4 mb-4">
            {["basic", "room", "restaurant", "other"].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="capitalize">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-1">
              <Label>Hotel</Label>
              <select
                value={formData.hotel_id || ""}
                onChange={(e) => updateFormData("hotel_id", e.target.value)}
                className="w-full border rounded-md p-2 bg-background text-foreground"
              >
                <option value="">Select a hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={getIdString(hotel._id)}>
                    {hotel.hotel_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {formData.date && parse(formData.date, "dd-MM-yyyy", new Date()).toString() !== "Invalid Date"
                      ? format(parse(formData.date, "dd-MM-yyyy", new Date()), "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date ? parse(formData.date, "dd-MM-yyyy", new Date()) : undefined}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {renderFields([
              { label: "Nett Revenue", key: "nett_revenue", readOnly: true, hint: "Auto-calculated" },
              { label: "Gross Revenue", key: "gross_revenue", readOnly: true },
              { label: "Service Charge (10%)", key: "service_charge", readOnly: true },
              { label: "Government Tax (11%)", key: "government_tax", readOnly: true },
              { label: "Grand Total Revenue", key: "grand_total_revenue", readOnly: true },
            ])}

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <FormField
                label="AP Restaurant"
                value={formData.ap_restaurant}
                onChange={(val) => updateFormData("ap_restaurant", val)}
              />
              <FormField label="Tips" value={formData.tips} onChange={(val) => updateFormData("tips", val)} />
            </div>
          </TabsContent>
          <TabsContent value="room" className="space-y-4">
            {renderFields(
              [
                { label: "Room Lodging", key: "room_lodging" },
                { label: "Rebate/Discount", key: "rebate_discount" },
                { label: "Total Room Revenue", key: "total_room_revenue", readOnly: true },
              ],
              "room_details",
            )}
            <h4 className="pt-4 font-medium">Room Statistics</h4>
            {renderFields(
              [
                { label: "Active Rooms", key: "active_rooms" },
                { label: "Room Available", key: "room_available" },
                { label: "House Use", key: "house_use" },
                { label: "Complimentary", key: "complimentary" },
                { label: "Rooms Sold", key: "rooms_sold" },
                { label: "Guests In House", key: "guests_in_house" },
                { label: "Rooms Occupied", key: "rooms_occupied", readOnly: true },
                { label: "Vacant Rooms", key: "vacant_rooms", readOnly: true },
                { label: "Occupancy (%)", key: "occupancy", readOnly: true },
                { label: "Average Room Rate", key: "average_room_rate", readOnly: true },
              ],
              "room_stats",
            )}
          </TabsContent>

          <TabsContent value="restaurant" className="space-y-4">
            {renderFields(
              [
                { label: "Breakfast", key: "breakfast" },
                { label: "Restaurant Food", key: "restaurant_food" },
                { label: "Restaurant Beverage", key: "restaurant_beverage" },
                { label: "Total Restaurant Revenue", key: "total_restaurant_revenue", readOnly: true },
              ],
              "restaurant",
            )}
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            {renderFields(
              [
                { label: "Other Room Revenue", key: "other_room_revenue" },
                { label: "Telephone", key: "telephone" },
                { label: "Business Center", key: "business_center" },
                { label: "Other Income", key: "other_income" },
                { label: "Spa Therapy", key: "spa_therapy" },
                { label: "Miscellaneous", key: "misc" },
                { label: "Allowance Other", key: "allowance_other" },
                { label: "Total Other Revenue", key: "total_other_revenue", readOnly: true },
              ],
              "other_revenue",
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{initialData ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function calculateTotals(data) {
  const rd = data.room_details ?? {}
  const rs = data.restaurant ?? {}
  const or = data.other_revenue ?? {}
  const rst = data.room_stats ?? {}

  rd.total_room_revenue = (rd.room_lodging || 0) - (rd.rebate_discount || 0)
  rs.total_restaurant_revenue = (rs.breakfast || 0) + (rs.restaurant_food || 0) + (rs.restaurant_beverage || 0)
  or.total_other_revenue =
    (or.other_room_revenue || 0) +
    (or.telephone || 0) +
    (or.business_center || 0) +
    (or.other_income || 0) +
    (or.spa_therapy || 0) +
    (or.misc || 0) -
    (or.allowance_other || 0)

  data.nett_revenue = rd.total_room_revenue + rs.total_restaurant_revenue + or.total_other_revenue
  data.service_charge = data.nett_revenue * 0.1
  data.government_tax = (data.nett_revenue + data.service_charge) * 0.11
  data.gross_revenue = data.nett_revenue + data.service_charge + data.government_tax
  data.grand_total_revenue = data.gross_revenue + (data.ap_restaurant || 0) + (data.tips || 0)

  rst.rooms_occupied = (rst.house_use || 0) + (rst.complimentary || 0) + (rst.rooms_sold || 0)
  rst.vacant_rooms = (rst.room_available || 0) - rst.rooms_occupied
  rst.occupancy = rst.room_available ? (rst.rooms_occupied / rst.room_available) * 100 : 0
  rst.average_room_rate = rst.rooms_sold ? rd.total_room_revenue / rst.rooms_sold : 0

  return { ...data, room_details: rd, restaurant: rs, other_revenue: or, room_stats: rst }
}
