/* eslint-disable react/prop-types */
import { useState } from "react"
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { format, parse } from "date-fns"
import { Button } from "../../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog"
import { RevenueDetails } from "./revenue-details"

export function RevenueTable({ data, onEdit, onDelete, view = "all" }) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [viewingItem, setViewingItem] = useState(null)

  const getSafeRevenue = (item, viewKey, fallbackKey) => {
    if (view === viewKey && item.filteredCategoryRevenue) {
      return item.filteredCategoryRevenue[fallbackKey] ?? 0
    }

    let source = null
    if (viewKey === "room") {
      source = item.room_details
    } else if (viewKey === "restaurant") {
      source = item.restaurant
    } else if (viewKey === "other") {
      source = item.other_revenue
    }

    return source?.[fallbackKey] ?? 0
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  const confirmDelete = (id) => {
    setItemToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      onDelete(itemToDelete)
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">Date</TableHead>
              {(view === "all" || view === "room") && <TableHead className="text-center">Room Revenue</TableHead>}
              {(view === "all" || view === "restaurant") && <TableHead className="text-center">Restaurant Revenue</TableHead>}
              {(view === "all" || view === "other") && <TableHead className="text-center">Other Revenue</TableHead>}
              <TableHead className="text-center">Nett Revenue</TableHead>
              <TableHead className="text-center">Gross Revenue</TableHead>
              <TableHead className="text-center">Occupancy</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-center font-medium">
                    {item.date && !isNaN(parse(item.date, "dd-MM-yyyy", new Date()))
                      ? format(parse(item.date, "dd-MM-yyyy", new Date()), "dd MMM yyyy")
                      : "Invalid date"}
                  </TableCell>

                  {(view === "all" || view === "room") && (
                    <TableCell className="text-center">{formatCurrency(getSafeRevenue(item, "room", "total_room_revenue"))}</TableCell>
                  )}

                  {(view === "all" || view === "restaurant") && (
                    <TableCell className="text-center">
                      {formatCurrency(getSafeRevenue(item, "restaurant", "total_restaurant_revenue"))}
                    </TableCell>
                  )}

                  {(view === "all" || view === "other") && (
                    <TableCell className="text-center">{formatCurrency(getSafeRevenue(item, "other", "total_other_revenue"))}</TableCell>
                  )}

                  <TableCell className="text-center">{formatCurrency(item.nett_revenue ?? 0)}</TableCell>
                  <TableCell className="text-center">{formatCurrency(item.gross_revenue ?? 0)}</TableCell>
                  <TableCell className="text-center">{(item.room_stats?.occupancy ?? 0).toFixed(2)}%</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setViewingItem(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(item._id?.$oid || item._id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this revenue record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {viewingItem && (
        <RevenueDetails
          data={viewingItem}
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
        />
      )}
    </>
  )
}
