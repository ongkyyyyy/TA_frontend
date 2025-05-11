import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "../../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { RevenueTable } from "./revenue-table"
import { RevenueForm } from "./revenue-form"
import { getRevenues, deleteRevenue } from "../../../api/apiRevenues"
import { RevenueFiltersBar } from "./Revenue-filter"
import { RevenueAdvancedFiltersDialog } from "./Revenue-advanced-filters-dialog"

const revenueTabs = [
  { label: "All Revenue", value: "all" },
  { label: "Room Revenue", value: "room" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Other Revenue", value: "other" },
]

export default function RevenuePage() {
  const [data, setData] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Hotel Revenues Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Revenue
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <RevenueFiltersBar
          onHotelFilterChange={(id) => {
            setSelectedHotel(id)
          }}
          onDateRangeFilterChange={handleDateRangeFilterChange}
          handleSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          setAdvancedFiltersOpen={setAdvancedFiltersOpen}
          resetSignal={resetSignal}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          {revenueTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

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
            />
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-center items-center space-x-4 mt-8">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev Page
        </Button>
        <span className="text-lg font-semibold">{`Page ${page}`}</span>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
          Next Page
        </Button>
      </div>

      {(isFormOpen || editingItem) && (
        <RevenueForm
          isOpen={isFormOpen || !!editingItem}
          onClose={() => {
            setIsFormOpen(false)
            setEditingItem(null)
          }}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          initialData={editingItem || undefined}
        />
      )}

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
