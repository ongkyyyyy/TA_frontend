"use client"

import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import PropTypes from "prop-types"

import { Button } from "../../ui/button"
import { Calendar } from "../../ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { cn } from "@/lib/utils"

export function RevenueForm({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    room_details: {
      room_lodging: 0,
      rebate_discount: 0,
      total_room_revenue: 0,
    },
    restaurant: {
      breakfast: 0,
      restaurant_food: 0,
      restaurant_beverage: 0,
      total_restaurant_revenue: 0,
    },
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
  })

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  // Handle input changes
  const handleInputChange = (path, value) => {
    const pathParts = path.split(".")
    const newData = { ...formData }

    let current = newData
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {}
      }
      current = current[pathParts[i]]
    }

    current[pathParts[pathParts.length - 1]] =
      typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value

    // Calculate totals
    calculateTotals(newData)
  }

  // Calculate all totals based on input values
  const calculateTotals = (data) => {
    if (data.room_details) {
      data.room_details.total_room_revenue =
        (data.room_details.room_lodging || 0) - (data.room_details.rebate_discount || 0)
    }

    if (data.restaurant) {
      data.restaurant.total_restaurant_revenue =
        (data.restaurant.breakfast || 0) +
        (data.restaurant.restaurant_food || 0) +
        (data.restaurant.restaurant_beverage || 0)
    }

    if (data.other_revenue) {
      data.other_revenue.total_other_revenue =
        (data.other_revenue.other_room_revenue || 0) +
        (data.other_revenue.telephone || 0) +
        (data.other_revenue.business_center || 0) +
        (data.other_revenue.other_income || 0) +
        (data.other_revenue.spa_therapy || 0) +
        (data.other_revenue.misc || 0) -
        (data.other_revenue.allowance_other || 0)
    }

    // Calculate nett revenue
    data.nett_revenue =
      (data.room_details?.total_room_revenue || 0) +
      (data.restaurant?.total_restaurant_revenue || 0) +
      (data.other_revenue?.total_other_revenue || 0)

    // Calculate service charge (10%)
    data.service_charge = (data.nett_revenue || 0) * 0.1

    // Calculate government tax (11% of nett + service)
    data.government_tax = ((data.nett_revenue || 0) + (data.service_charge || 0)) * 0.11

    // Calculate gross revenue
    data.gross_revenue = (data.nett_revenue || 0) + (data.service_charge || 0) + (data.government_tax || 0)

    // Calculate grand total revenue
    data.grand_total_revenue = (data.gross_revenue || 0) + (data.ap_restaurant || 0) + (data.tips || 0)

    // Calculate room stats
    if (data.room_stats) {
      data.room_stats.rooms_occupied =
        (data.room_stats.house_use || 0) + (data.room_stats.complimentary || 0) + (data.room_stats.rooms_sold || 0)

      data.room_stats.vacant_rooms = (data.room_stats.room_available || 0) - (data.room_stats.rooms_occupied || 0)

      data.room_stats.occupancy = data.room_stats.room_available
        ? ((data.room_stats.rooms_occupied || 0) / data.room_stats.room_available) * 100
        : 0

      data.room_stats.average_room_rate = data.room_stats.rooms_sold
        ? (data.room_details?.total_room_revenue || 0) / data.room_stats.rooms_sold
        : 0
    }

    setFormData(data)
  }

  const handleDateChange = (date) => {
    if (date) {
      handleInputChange("date", format(date, "yyyy-MM-dd"))
    }
  }

  const handleSubmit = () => {
    if (initialData) {
      onSubmit({
        ...formData,
        _id: initialData._id,
        hotel_id: initialData.hotel_id,
      })
    } else {
      onSubmit({
        ...formData,
        _id: { $oid: crypto.randomUUID() },
        hotel_id: { $oid: "67fcca4e852775d38fc10853" },
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Revenue Data" : "Add New Revenue Data"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the revenue information for this record."
              : "Fill in the details to create a new revenue record."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="room">Room Details</TabsTrigger>
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="other">Other Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(new Date(formData.date), "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date ? new Date(formData.date) : undefined}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nett Revenue</Label>
                <Input type="number" value={formData.nett_revenue} readOnly className="bg-muted" />
                <p className="text-sm text-muted-foreground">Automatically calculated</p>
              </div>

              <div className="space-y-2">
                <Label>Gross Revenue</Label>
                <Input type="number" value={formData.gross_revenue} readOnly className="bg-muted" />
                <p className="text-sm text-muted-foreground">Automatically calculated</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Service Charge (10%)</Label>
                <Input
                  type="number"
                  value={formData.service_charge}
                  onChange={(e) => handleInputChange("service_charge", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Government Tax (11%)</Label>
                <Input
                  type="number"
                  value={formData.government_tax}
                  onChange={(e) => handleInputChange("government_tax", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Grand Total Revenue</Label>
                <Input type="number" value={formData.grand_total_revenue} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>AP Restaurant</Label>
                <Input
                  type="number"
                  value={formData.ap_restaurant}
                  onChange={(e) => handleInputChange("ap_restaurant", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tips</Label>
                <Input
                  type="number"
                  value={formData.tips}
                  onChange={(e) => handleInputChange("tips", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="room" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Room Lodging</Label>
                <Input
                  type="number"
                  value={formData.room_details?.room_lodging}
                  onChange={(e) => handleInputChange("room_details.room_lodging", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Rebate/Discount</Label>
                <Input
                  type="number"
                  value={formData.room_details?.rebate_discount}
                  onChange={(e) => handleInputChange("room_details.rebate_discount", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Total Room Revenue</Label>
                <Input type="number" value={formData.room_details?.total_room_revenue} readOnly className="bg-muted" />
                <p className="text-sm text-muted-foreground">Automatically calculated</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Room Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Active Rooms</Label>
                  <Input
                    type="number"
                    value={formData.room_stats?.active_rooms}
                    onChange={(e) => handleInputChange("room_stats.active_rooms", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Room Available</Label>
                  <Input
                    type="number"
                    value={formData.room_stats?.room_available}
                    onChange={(e) => handleInputChange("room_stats.room_available", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>House Use</Label>
                  <Input
                    type="number"
                    value={formData.room_stats?.house_use}
                    onChange={(e) => handleInputChange("room_stats.house_use", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Complimentary</Label>
                  <Input
                    type="number"
                    value={formData.room_stats?.complimentary}
                    onChange={(e) => handleInputChange("room_stats.complimentary", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rooms Sold</Label>
                  <Input
                    type="number"
                    value={formData.room_stats?.rooms_sold}
                    onChange={(e) => handleInputChange("room_stats.rooms_sold", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Guests In House</Label>
                  <Input
                    type="number"
                    value={formData.room_stats?.guests_in_house}
                    onChange={(e) => handleInputChange("room_stats.guests_in_house", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Rooms Occupied</Label>
                  <Input type="number" value={formData.room_stats?.rooms_occupied} readOnly className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Vacant Rooms</Label>
                  <Input type="number" value={formData.room_stats?.vacant_rooms} readOnly className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label>Occupancy (%)</Label>
                  <Input
                    type="number"
                    value={formData.room_stats?.occupancy?.toFixed(2)}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="space-y-2">
                  <Label>Average Room Rate</Label>
                  <Input
                    type="number"
                    value={formData.room_stats?.average_room_rate?.toFixed(2)}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="restaurant" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Breakfast</Label>
                <Input
                  type="number"
                  value={formData.restaurant?.breakfast}
                  onChange={(e) => handleInputChange("restaurant.breakfast", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Restaurant Food</Label>
                <Input
                  type="number"
                  value={formData.restaurant?.restaurant_food}
                  onChange={(e) => handleInputChange("restaurant.restaurant_food", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Restaurant Beverage</Label>
                <Input
                  type="number"
                  value={formData.restaurant?.restaurant_beverage}
                  onChange={(e) => handleInputChange("restaurant.restaurant_beverage", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Total Restaurant Revenue</Label>
                <Input
                  type="number"
                  value={formData.restaurant?.total_restaurant_revenue}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">Automatically calculated</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Other Room Revenue</Label>
                <Input
                  type="number"
                  value={formData.other_revenue?.other_room_revenue}
                  onChange={(e) => handleInputChange("other_revenue.other_room_revenue", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Telephone</Label>
                <Input
                  type="number"
                  value={formData.other_revenue?.telephone}
                  onChange={(e) => handleInputChange("other_revenue.telephone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Business Center</Label>
                <Input
                  type="number"
                  value={formData.other_revenue?.business_center}
                  onChange={(e) => handleInputChange("other_revenue.business_center", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Other Income</Label>
                <Input
                  type="number"
                  value={formData.other_revenue?.other_income}
                  onChange={(e) => handleInputChange("other_revenue.other_income", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Spa Therapy</Label>
                <Input
                  type="number"
                  value={formData.other_revenue?.spa_therapy}
                  onChange={(e) => handleInputChange("other_revenue.spa_therapy", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Miscellaneous</Label>
                <Input
                  type="number"
                  value={formData.other_revenue?.misc}
                  onChange={(e) => handleInputChange("other_revenue.misc", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Allowance Other</Label>
                <Input
                  type="number"
                  value={formData.other_revenue?.allowance_other}
                  onChange={(e) => handleInputChange("other_revenue.allowance_other", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Total Other Revenue</Label>
                <Input
                  type="number"
                  value={formData.other_revenue?.total_other_revenue}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">Automatically calculated</p>
              </div>
            </div>
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

// Add prop validation
RevenueForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
}
