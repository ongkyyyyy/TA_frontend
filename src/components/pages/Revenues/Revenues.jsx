import { useState, useEffect } from "react"
import { PlusCircle} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueTable } from "./revenue-table"
import { RevenueForm } from "./revenue-form"
import { getRevenues, deleteRevenue } from "@/api/apiRevenues"
import { RevenueFiltersBar } from "./revenue-filter"
import { RevenueAdvancedFiltersDialog } from "./revenue-advanced-filters-dialog"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"

const revenueTabs = [
  { label: "All", value: "all", color: "bg-primary" },
  { label: "Room", value: "room", color: "bg-emerald-500" },
  { label: "Restaurant", value: "restaurant", color: "bg-amber-500" },
  { label: "Other", value: "other", color: "bg-violet-500" },
]

export default function RevenuePage() {
  const [data, setData] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const revenuesPerHotel = 10
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState(-1)
  const [activeTab, setActiveTab] = useState("all")
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [minDate, setMinDate] = useState()
  const [maxDate, setMaxDate] = useState()
  const [minRevenue, setMinRevenue] = useState(null)
  const [maxRevenue, setMaxRevenue] = useState(null)
  const [minOccupancy, setMinOccupancy] = useState(null)
  const [maxOccupancy, setMaxOccupancy] = useState(null)
  const [resetSignal, setResetSignal] = useState(false)
  const [sortSelectValue, setSortSelectValue] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const params = {
          page,
          per_page: revenuesPerHotel,
          hotelId: selectedHotel.length > 0 ? selectedHotel : undefined,
          minDate: formatToBackendDate(minDate),
          maxDate: formatToBackendDate(maxDate),
          sort_by: sortBy,
          sort_order: sortOrder,
          minRevenue: minRevenue ?? undefined,
          maxRevenue: maxRevenue ?? undefined,
          minOccupancy: minOccupancy ?? undefined,
          maxOccupancy: maxOccupancy ?? undefined,
        }

        const response = await getRevenues(params)
        setData(response.data?.data || [])
        setTotalPages(response.data.total_pages || 1)
      } catch (error) {
        console.error("Failed to load revenue data", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [page, selectedHotel, sortBy, sortOrder, minRevenue, maxRevenue, minOccupancy, maxOccupancy, minDate, maxDate])

  const formatToBackendDate = (date) => {
    if (!date) return undefined
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const refreshData = async () => {
    try {
      setIsLoading(true)
      const params = {
        page,
        per_page: revenuesPerHotel,
        hotelId: selectedHotel.length > 0 ? selectedHotel : undefined,
        minDate: formatToBackendDate(minDate),
        maxDate: formatToBackendDate(maxDate),
        sort_by: sortBy,
        sort_order: sortOrder,
        minRevenue: minRevenue ?? undefined,
        maxRevenue: maxRevenue ?? undefined,
        minOccupancy: minOccupancy ?? undefined,
        maxOccupancy: maxOccupancy ?? undefined,
      }

      const response = await getRevenues(params)
      setData(response.data?.data || [])
      setTotalPages(response.data.total_pages || 1)
    } catch (error) {
      console.error("Failed to load revenue data", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    setIsFormOpen(false)
    await refreshData()
  }

  const handleUpdate = async () => {
    setEditingItem(null)
    await refreshData()
  }

  const handleDelete = async (_hotelName, revenueId) => {
    try {
      await deleteRevenue(revenueId)
      setData((prev) => prev.filter((r) => r._id !== revenueId))
    } catch (error) {
      console.error("Failed to delete revenue", error)
    }
  }

  const handleEdit = (item, hotelId) => {
    setEditingItem({ ...item, hotel_id: hotelId })
  }

  const handleSortChange = (value) => {
    const sortMapping = {
      "date-asc": { key: "date", order: 1 },
      "date-desc": { key: "date", order: -1 },
      "revenue-asc": { key: "revenue", order: 1 },
      "revenue-desc": { key: "revenue", order: -1 },
    }
    const selected = sortMapping[value]
    if (selected) {
      setSortBy(selected.key)
      setSortOrder(selected.order)
      setSortSelectValue(value)
    }
  }

  const handleClearFilters = () => {
    setSelectedHotel([])
    setMinDate(undefined)
    setMaxDate(undefined)
    setMinRevenue(null)
    setMaxRevenue(null)
    setMinOccupancy(null)
    setMaxOccupancy(null)
    setSortBy("date")
    setSortOrder(-1)
    setSortSelectValue("")
    setResetSignal(Date.now())
    setPage(1)
    refreshData()
  }

  const handleDateRangeFilterChange = (range) => {
    setMinDate(range?.from)
    setMaxDate(range?.to)
  }

  const handleApplyFilters = async () => {
    await refreshData()
    setAdvancedFiltersOpen(false)
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <div className="mb-6">
          <CardTitle className="text-3xl font-bold">Hotel Revenues Management</CardTitle>
          <CardDescription className="mt-2">
            Manage and analyze revenue data across all hotel properties
          </CardDescription>
        </div>

        <Separator className="mb-4" />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <RevenueFiltersBar
            onHotelFilterChange={(id) => {
              setSelectedHotel(id)
            }}
            onDateRangeFilterChange={handleDateRangeFilterChange}
            handleSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            setAdvancedFiltersOpen={setAdvancedFiltersOpen}
            resetSignal={resetSignal}
            sortValue={sortSelectValue}
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setIsFormOpen(true)} size="lg" className="gap-2 whitespace-nowrap">
              <PlusCircle className="h-5 w-5" /> Add New Revenue
            </Button>
          </motion.div>
        </div>
      </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-4 grid grid-cols-4 gap-2">
              {revenueTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="relative overflow-hidden">
                  {tab.label}
                  {activeTab === tab.value && (
                    <motion.div
                      className={`absolute bottom-0 left-0 h-1 w-full ${tab.color}`}
                      layoutId="activeTabIndicator"
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {revenueTabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    <RevenueTable
                      data={data
                        .filter((r) => {
                          if (tab.value === "room") return !!r.room_details
                          if (tab.value === "restaurant") return !!r.restaurant
                          if (tab.value === "other") return !!r.other_revenue
                          return true
                        })
                        .map((r) => ({
                          ...r,
                          filteredCategoryRevenue:
                            tab.value === "room"
                              ? r.room_details
                              : tab.value === "restaurant"
                                ? r.restaurant
                                : tab.value === "other"
                                  ? r.other_revenue
                                  : undefined,
                        }))}
                      view={tab.value}
                      onEdit={(item) => handleEdit(item, item.hotel_id)}
                      onDelete={(revenueId) => handleDelete("flat", revenueId)}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                ))}
              </motion.div>
            </AnimatePresence>
          </Tabs>

          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={i}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    className="w-9 h-9"
                    onClick={() => setPage(pageNum)}
                    disabled={isLoading}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              {totalPages > 5 && (
                <>
                  <span className="mx-1">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-9 h-9"
                    onClick={() => setPage(totalPages)}
                    disabled={isLoading}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages || isLoading}>
              Next
            </Button>
        </div>
      <AnimatePresence>
        {(isFormOpen || editingItem) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <RevenueForm
              isOpen={isFormOpen || !!editingItem}
              onClose={() => {
                setIsFormOpen(false)
                setEditingItem(null)
              }}
              onSubmit={editingItem ? handleUpdate : handleCreate}
              initialData={editingItem || undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <RevenueAdvancedFiltersDialog
        open={advancedFiltersOpen}
        onOpenChange={setAdvancedFiltersOpen}
        minRevenue={minRevenue}
        maxRevenue={maxRevenue}
        minOccupancy={minOccupancy}
        maxOccupancy={maxOccupancy}
        setMinRevenue={setMinRevenue}
        setMaxRevenue={setMaxRevenue}
        setMinOccupancy={setMinOccupancy}
        setMaxOccupancy={setMaxOccupancy}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  )
}
