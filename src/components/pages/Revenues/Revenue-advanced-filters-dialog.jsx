/* eslint-disable react/prop-types */
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const advancedFilterFields = [
  { id: "min-revenue", label: "Min Revenue", type: "number", placeholder: "0" },
  { id: "max-revenue", label: "Max Revenue", type: "number", placeholder: "10000000" },
  { id: "min-occupancy", label: "Min Occupancy", type: "number", placeholder: "0" },
  { id: "max-occupancy", label: "Max Occupancy", type: "number", placeholder: "100" },
]

export function RevenueAdvancedFiltersDialog({
  open,
  onOpenChange,
  minRevenue,
  maxRevenue,
  minOccupancy,
  maxOccupancy,
  setMinRevenue,
  setMaxRevenue,
  setMinOccupancy,
  setMaxOccupancy,
  onApplyFilters,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>Set additional filters to refine your revenue data.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {advancedFilterFields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="col-span-3"
                value={
                  field.id === "min-revenue"
                    ? minRevenue ?? ""
                    : field.id === "max-revenue"
                    ? maxRevenue ?? ""
                    : field.id === "min-occupancy"
                    ? minOccupancy ?? ""
                    : field.id === "max-occupancy"
                    ? maxOccupancy ?? ""
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value
                  const parsed = value === "" ? null : Number(value)

                  if (field.id === "min-revenue") setMinRevenue(parsed)
                  else if (field.id === "max-revenue") setMaxRevenue(parsed)
                  else if (field.id === "min-occupancy") setMinOccupancy(parsed)
                  else if (field.id === "max-occupancy") setMaxOccupancy(parsed)
                }}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onApplyFilters}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
