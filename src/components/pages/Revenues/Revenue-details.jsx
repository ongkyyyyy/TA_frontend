import { format, parse } from "date-fns"
import PropTypes from "prop-types"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"

export function RevenueDetails({ data, isOpen, onClose }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto top-[7%] translate-y-0">
        <DialogHeader>
          <DialogTitle>Revenue Details</DialogTitle>
          <DialogDescription>Revenue data for {format(parse(data.date, "dd-MM-yyyy", new Date()), "PPP")
          }</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="summary">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="room">Room Details</TabsTrigger>
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="other">Other Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg">{format(parse(data.date, "dd-MM-yyyy", new Date()), "PPP")
                }</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Hotel Name</p>
                <p className="text-lg">{data.hotel_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Room Revenue</p>
                <p className="text-lg">{formatCurrency(data.room_details.total_room_revenue)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Restaurant Revenue</p>
                <p className="text-lg">{formatCurrency(data.restaurant.total_restaurant_revenue)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Other Revenue</p>
                <p className="text-lg">{formatCurrency(data.other_revenue.total_other_revenue)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Nett Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(data.nett_revenue)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Service Charge</p>
                <p className="text-lg">{formatCurrency(data.service_charge)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Government Tax</p>
                <p className="text-lg">{formatCurrency(data.government_tax)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Gross Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(data.gross_revenue)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">AP Restaurant</p>
                <p className="text-lg">{formatCurrency(data.ap_restaurant)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Tips</p>
                <p className="text-lg">{formatCurrency(data.tips)}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Grand Total Revenue</p>
                <p className="text-xl font-bold">{formatCurrency(data.grand_total_revenue)}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="room" className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Room Lodging</p>
                <p className="text-lg">{formatCurrency(data.room_details.room_lodging)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Rebate/Discount</p>
                <p className="text-lg">{formatCurrency(data.room_details.rebate_discount)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Room Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(data.room_details.total_room_revenue)}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Room Statistics</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Rooms</p>
                  <p className="text-lg">{data.room_stats.active_rooms}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Room Available</p>
                  <p className="text-lg">{data.room_stats.room_available}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">House Use</p>
                  <p className="text-lg">{data.room_stats.house_use}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Complimentary</p>
                  <p className="text-lg">{data.room_stats.complimentary}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Rooms Occupied</p>
                  <p className="text-lg">{data.room_stats.rooms_occupied}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Rooms Sold</p>
                  <p className="text-lg">{data.room_stats.rooms_sold}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Vacant Rooms</p>
                  <p className="text-lg">{data.room_stats.vacant_rooms}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Occupancy</p>
                  <p className="text-lg">{data.room_stats.occupancy.toFixed(2)}%</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Guests In House</p>
                  <p className="text-lg">{data.room_stats.guests_in_house}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Average Room Rate</p>
                  <p className="text-lg">{formatCurrency(data.room_stats.average_room_rate)}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="restaurant" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Breakfast</p>
                <p className="text-lg">{formatCurrency(data.restaurant.breakfast)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Restaurant Food</p>
                <p className="text-lg">{formatCurrency(data.restaurant.restaurant_food)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Restaurant Beverage</p>
                <p className="text-lg">{formatCurrency(data.restaurant.restaurant_beverage)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Restaurant Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(data.restaurant.total_restaurant_revenue)}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Other Room Revenue</p>
                <p className="text-lg">{formatCurrency(data.other_revenue.other_room_revenue)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Telephone</p>
                <p className="text-lg">{formatCurrency(data.other_revenue.telephone)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Business Center</p>
                <p className="text-lg">{formatCurrency(data.other_revenue.business_center)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Other Income</p>
                <p className="text-lg">{formatCurrency(data.other_revenue.other_income)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Spa Therapy</p>
                <p className="text-lg">{formatCurrency(data.other_revenue.spa_therapy)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Miscellaneous</p>
                <p className="text-lg">{formatCurrency(data.other_revenue.misc)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Allowance Other</p>
                <p className="text-lg">{formatCurrency(data.other_revenue.allowance_other)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Other Revenue</p>
                <p className="text-lg font-semibold">{formatCurrency(data.other_revenue.total_other_revenue)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

RevenueDetails.propTypes = {
  data: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
