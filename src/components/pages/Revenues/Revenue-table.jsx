import { useState } from "react"
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { format } from "date-fns"
import PropTypes from "prop-types"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { RevenueDetails } from "./revenue-details"
import { parse } from "date-fns";


export function RevenueTable({ data, onEdit, onDelete, view = "all" }) {
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [viewingItem, setViewingItem] = useState(null)

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    let valueA, valueB

    switch (sortColumn) {
      case "date":
        valueA = new Date(a.date).getTime()
        valueB = new Date(b.date).getTime()
        break
      case "nett_revenue":
        valueA = a.nett_revenue ?? 0
        valueB = b.nett_revenue ?? 0
        break
      case "gross_revenue":
        valueA = a.gross_revenue ?? 0
        valueB = b.gross_revenue ?? 0
        break
      case "room_revenue":
        valueA = a.room_details?.total_room_revenue ?? 0
        valueB = b.room_details?.total_room_revenue ?? 0
        break
      case "restaurant_revenue":
        valueA = a.restaurant?.total_restaurant_revenue ?? 0
        valueB = b.restaurant?.total_restaurant_revenue ?? 0
        break
      case "other_revenue":
        valueA = a.other_revenue?.total_other_revenue ?? 0
        valueB = b.other_revenue?.total_other_revenue ?? 0
        break
      case "occupancy":
        valueA = a.room_stats?.occupancy ?? 0
        valueB = b.room_stats?.occupancy ?? 0
        break
      default:
        valueA = a.date
        valueB = b.date
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => handleSort("date")} className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              {(view === "all" || view === "room") && (
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("room_revenue")} className="flex items-center">
                    Room Revenue
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              )}

              {(view === "all" || view === "restaurant") && (
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("restaurant_revenue")}
                    className="flex items-center"
                  >
                    Restaurant
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              )}

              {(view === "all" || view === "other") && (
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("other_revenue")} className="flex items-center">
                    Other Revenue
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              )}

              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("nett_revenue")} className="flex items-center">
                  Nett Revenue
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("gross_revenue")} className="flex items-center">
                  Gross Revenue
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("occupancy")} className="flex items-center">
                  Occupancy
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => (
                <TableRow key={item._id.$oid}>
                <TableCell className="font-medium">
                  {item.date && !isNaN(parse(item.date, "dd-MM-yyyy", new Date())) 
                    ? format(parse(item.date, "dd-MM-yyyy", new Date()), "dd MMM yyyy") 
                    : "Invalid date"}
                </TableCell>
                
                  {(view === "all" || view === "room") && (
                    <TableCell>{formatCurrency(item.room_details?.total_room_revenue ?? 0)}</TableCell>
                  )}

                  {(view === "all" || view === "restaurant") && (
                    <TableCell>{formatCurrency(item.restaurant?.total_restaurant_revenue ?? 0)}</TableCell>
                  )}

                  {(view === "all" || view === "other") && (
                    <TableCell>{formatCurrency(item.other_revenue?.total_other_revenue ?? 0)}</TableCell>
                  )}

                  <TableCell>{formatCurrency(item.nett_revenue ?? 0)}</TableCell>
                  <TableCell>{formatCurrency(item.gross_revenue ?? 0)}</TableCell>
                  <TableCell>{(item.room_stats?.occupancy ?? 0).toFixed(2)}%</TableCell>
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
                          onClick={() => confirmDelete(item._id.$oid)}
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

      {/* Delete Confirmation Dialog */}
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
      {viewingItem && <RevenueDetails data={viewingItem} isOpen={!!viewingItem} onClose={() => setViewingItem(null)} />}
    </>
  )
}

RevenueTable.propTypes = {
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  view: PropTypes.oneOf(["all", "room", "restaurant", "other"]),
}
