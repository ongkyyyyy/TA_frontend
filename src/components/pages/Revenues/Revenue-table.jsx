/* eslint-disable react/prop-types */
import { useState } from "react"
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { format, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RevenueDetails } from "./revenue-details"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const categoryColors = {
  room: "bg-emerald-100 text-emerald-800 border-emerald-200",
  restaurant: "bg-amber-100 text-amber-800 border-amber-200",
  other: "bg-violet-100 text-violet-800 border-violet-200",
  all: "bg-primary/10 text-primary border-primary/20",
}

export function RevenueTable({ data, onEdit, onDelete, view = "all", isLoading = false }) {
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
      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table className="mx-2">
          <TableHeader>
            <TableRow className="mx-4">
              <TableHead className="w-[120px]">Date</TableHead>

              {(view === "all" || view === "room") && <TableHead>Room Revenue</TableHead>}

              {(view === "all" || view === "restaurant") && <TableHead>Restaurant Revenue</TableHead>}

              {(view === "all" || view === "other") && <TableHead>Other Revenue</TableHead>}

              <TableHead>Nett Revenue</TableHead>

              <TableHead>Gross Revenue</TableHead>

              <TableHead>Occupancy</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    {(view === "all" || view === "room") && (
                      <TableCell>
                        <Skeleton className="h-6 w-28" />
                      </TableCell>
                    )}
                    {(view === "all" || view === "restaurant") && (
                      <TableCell>
                        <Skeleton className="h-6 w-28" />
                      </TableCell>
                    )}
                    {(view === "all" || view === "other") && (
                      <TableCell>
                        <Skeleton className="h-6 w-28" />
                      </TableCell>
                    )}
                    <TableCell>
                      <Skeleton className="h-6 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <p className="mb-2 text-lg font-medium">No results found</p>
                    <p className="text-sm">Try adding new revenue data</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {data.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>
                          {item.date && !isNaN(parse(item.date, "dd-MM-yyyy", new Date()))
                            ? format(parse(item.date, "dd-MM-yyyy", new Date()), "dd MMM yyyy")
                            : "Invalid date"}
                        </span>
                        <Badge variant="outline" className={`mt-1 text-xs ${categoryColors[view]}`}>
                          {view === "room"
                            ? "Room"
                            : view === "restaurant"
                            ? "Restaurant"
                            : view === "other"
                            ? "Other"
                            : "All"}
                        </Badge>
                      </div>
                    </TableCell>

                    {(view === "all" || view === "room") && (
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency(getSafeRevenue(item, "room", "total_room_revenue"))}
                        </span>
                      </TableCell>
                    )}

                    {(view === "all" || view === "restaurant") && (
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency(getSafeRevenue(item, "restaurant", "total_restaurant_revenue"))}
                        </span>
                      </TableCell>
                    )}

                    {(view === "all" || view === "other") && (
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency(getSafeRevenue(item, "other", "total_other_revenue"))}
                        </span>
                      </TableCell>
                    )}

                    <TableCell>
                      <span className="font-medium">{formatCurrency(item.nett_revenue ?? 0)}</span>
                    </TableCell>

                    <TableCell>
                      <span className="font-medium">{formatCurrency(item.gross_revenue ?? 0)}</span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${Math.min(100, item.room_stats?.occupancy ?? 0)}%` }}
                          />
                        </div>
                        <span className="font-medium">{(item.room_stats?.occupancy ?? 0).toFixed(1)}%</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => setViewingItem(item)}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(item)} className="flex items-center cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => confirmDelete(item._id?.$oid || item._id)}
                            className="text-destructive focus:text-destructive flex items-center cursor-pointer"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="relative bg-background text-foreground w-full max-w-md p-6 rounded-xl shadow-lg">
            
            {/* Close Button */}
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
              aria-label="Close"
            >
              <X />
            </button>

            {/* Header */}
            <div className="space-y-2 mb-4">
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
              <p className="text-muted-foreground">
                Are you sure you want to delete this revenue record? This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {viewingItem && <RevenueDetails data={viewingItem} isOpen={!!viewingItem} onClose={() => setViewingItem(null)} />}
    </>
  )
}
