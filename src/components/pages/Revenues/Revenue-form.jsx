/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { inputRevenue, updateRevenue } from "@/api/apiRevenues"
import { toast } from "react-toastify"

const FormField = ({ label, value, onChange, readOnly = false, type = "number", hint }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={
        onChange
          ? (e) => {
              const val = type === "number" ? Number(e.target.value) : e.target.value;
              onChange(val);
            }
          : undefined
      }
      readOnly={readOnly}
      className={readOnly ? "bg-muted" : ""}
    />
    {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
  </div>
);

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

  useEffect(() => {
    if (initialData) {
      const newData = structuredClone(initialData)
      calculateTotals(newData)
      setFormData(newData)
    }
  }, [initialData])  

  const updateFormData = (path, value) => {
    setFormData((prev) => {
      const newData = structuredClone(prev);
      const keys = path.split(".");
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys.at(-1)] = value; 
      calculateTotals(newData);
      return newData;
    });
  };

  const calculateTotals = (data) => {
    const rd = data.room_details ?? {};
    const rs = data.restaurant ?? {};
    const or = data.other_revenue ?? {};
    const rst = data.room_stats ?? {};
  
    rd.total_room_revenue =
      (Number(rd.room_lodging) || 0) - (Number(rd.rebate_discount) || 0);
  
    rs.total_restaurant_revenue =
      (Number(rs.breakfast) || 0) +
      (Number(rs.restaurant_food) || 0) +
      (Number(rs.restaurant_beverage) || 0);
  
    or.total_other_revenue =
      (Number(or.other_room_revenue) || 0) +
      (Number(or.telephone) || 0) +
      (Number(or.business_center) || 0) +
      (Number(or.other_income) || 0) +
      (Number(or.spa_therapy) || 0) +
      (Number(or.misc) || 0) -
      (Number(or.allowance_other) || 0);
  
    data.room_details = rd;
    data.restaurant = rs;
    data.other_revenue = or;
  
    data.nett_revenue =
      rd.total_room_revenue + rs.total_restaurant_revenue + or.total_other_revenue;
  
    data.service_charge = data.nett_revenue * 0.1;
    data.government_tax = (data.nett_revenue + data.service_charge) * 0.11;
    data.gross_revenue =
      data.nett_revenue + data.service_charge + data.government_tax;
  
    data.grand_total_revenue =
      data.gross_revenue +
      (Number(data.ap_restaurant) || 0) +
      (Number(data.tips) || 0);
  
    rst.rooms_occupied =
      (Number(rst.house_use) || 0) +
      (Number(rst.complimentary) || 0) +
      (Number(rst.rooms_sold) || 0);
  
    rst.vacant_rooms =
      (Number(rst.room_available) || 0) - rst.rooms_occupied;
  
    rst.occupancy = rst.room_available
      ? (rst.rooms_occupied / Number(rst.room_available)) * 100
      : 0;
  
    rst.average_room_rate = rst.rooms_sold
      ? rd.total_room_revenue / Number(rst.rooms_sold)
      : 0;
  
    data.room_stats = rst;
    return data;
  };  

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      updateFormData("date", format(date, "yyyy-MM-dd"))
    }
  }  

  const renderFields = (fields, basePath) => (
    <div className={`grid grid-cols-${fields.length > 2 ? 3 : 2} gap-4`}>
      {fields.map(({ label, key, readOnly = false, hint }) => {
        const fullKey = basePath ? `${basePath}.${key}` : key
        const value = fullKey.split(".").reduce((o, k) => o?.[k], formData)

        return (
          <FormField
            key={fullKey}
            label={label}
            value={value}
            readOnly={readOnly}
            hint={hint}
            onChange={readOnly ? undefined : (v) => updateFormData(fullKey, v)}
          />
        )
      })}
    </div>
  )

  const handleSubmit = async () => {
    const payload = JSON.parse(
      JSON.stringify(
        {
          ...formData,
          hotel_id: initialData?.hotel_id,
        },
        (key, value) => (value === "" ? 0 : value) 
      )
    );
  
    try {
      if (initialData?._id) {
        await updateRevenue(initialData._id, payload);
      } else {
        const payload = flattenRevenueData({
          ...formData,
          hotel_id: initialData?.hotel_id || "67fcca4e852775d38fc10853",
        });
        
        console.log("Submitting payload:", payload);
        await inputRevenue(payload);
      }
  
      onSubmit?.();
      onClose?.();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit data. Please try again.");
    }
  };

  function flattenRevenueData(data) {
    const flat = {};
  
    for (const key in data) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        for (const subKey in data[key]) {
          flat[subKey] = data[key][subKey];
        }
      } else {
        flat[key] = data[key];
      }
    }
  
    return flat;
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

            {renderFields(
              [
                { label: "Nett Revenue", key: "nett_revenue", readOnly: true, hint: "Automatically calculated" },
                { label: "Gross Revenue", key: "gross_revenue", readOnly: true, hint: "Automatically calculated" },
              ],
              "",
            )}

            {renderFields(
              [
                { label: "Service Charge (10%)", key: "service_charge" },
                { label: "Government Tax (11%)", key: "government_tax" },
                { label: "Grand Total Revenue", key: "grand_total_revenue", readOnly: true },
              ],
              "",
            )}

            {renderFields(
              [
                { label: "AP Restaurant", key: "ap_restaurant" },
                { label: "Tips", key: "tips" },
              ],
              "",
            )}
          </TabsContent>

          <TabsContent value="room" className="space-y-4">
            {renderFields(
              [
                { label: "Room Lodging", key: "room_lodging" },
                { label: "Rebate/Discount", key: "rebate_discount" },
                { label: "Total Room Revenue", key: "total_room_revenue", readOnly: true, hint: "Automatically calculated" },
              ],
              "room_details",
            )}

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Room Statistics</h3>

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
            </div>
          </TabsContent>

          <TabsContent value="restaurant" className="space-y-4">
            {renderFields(
              [
                { label: "Breakfast", key: "breakfast" },
                { label: "Restaurant Food", key: "restaurant_food" },
                { label: "Restaurant Beverage", key: "restaurant_beverage" },
                { label: "Total Restaurant Revenue", key: "total_restaurant_revenue", readOnly: true, hint: "Automatically calculated" },
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
                { label: "Total Other Revenue", key: "total_other_revenue", readOnly: true, hint: "Automatically calculated" },
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
