import { useState, useEffect } from "react"
import { Plus,ChevronLeft, ChevronRight } from "lucide-react" 
import { Button } from "../../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { RevenueTable } from "./revenue-table"
import { RevenueForm } from "./revenue-form"
import { getRevenues, deleteRevenue } from "../../../api/apiRevenues"
import { getHotelsDropdown } from "@/api/apiHotels"
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
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [hotelTabs, setHotelTabs] = useState({})
  const [hotelOptions, setHotelOptions] = useState([])
  const [selectedHotel, setSelectedHotel] = useState("")
  
  const [page, setPage] = useState(1)
  const [revenuesPage, setRevenuesPage] = useState({})
  const perPageHotels = 5
  const revenuesPerHotel = 10
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState(-1)
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();

  const [minRevenue, setMinRevenue] = useState("")
  const [maxRevenue, setMaxRevenue] = useState("")
  const [minOccupancy, setMinOccupancy] = useState("")
  const [maxOccupancy, setMaxOccupancy] = useState("")

  const [resetSignal, setResetSignal] = useState(false);

  const handleTabChange = (hotelName, tabValue) => {
    setHotelTabs((prev) => ({
      ...prev,
      [hotelName]: tabValue,
    }))
  }

  const formatToBackendDate = (date, isEnd = false) => {
    if (!date) return undefined;
    if (isEnd) {
      date.setHours(23, 59, 59, 999);
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page,
          per_page_hotels: perPageHotels,
          revenues_per_hotel: revenuesPerHotel,
          hotel_id: selectedHotel || undefined,
          minRevenue: minRevenue || undefined,
          maxRevenue: maxRevenue || undefined,
          minOccupancy: minOccupancy || undefined,
          maxOccupancy: maxOccupancy || undefined,
          min_date:  formatToBackendDate(minDate),
          max_date: formatToBackendDate(maxDate),
          sort_by: sortBy,
          sort_order: sortOrder,
        }
        const response = await getRevenues(params)
        console.log(response.data)
        setData(response.data)

        const dropdownResponse = await getHotelsDropdown()
        setHotelOptions(dropdownResponse || [])
      } catch (error) {
        console.error("Failed to load revenue data", error)
      }
    }
    fetchData()
  }, [page, perPageHotels, revenuesPerHotel, selectedHotel, minRevenue, maxRevenue, minOccupancy, maxOccupancy, minDate, maxDate, sortBy, sortOrder])

  const handleCreate = async () => {
    setIsFormOpen(false)
    await refreshData()
  }

  const handleUpdate = async () => {
    setEditingItem(null)
    await refreshData()
  }

  const refreshData = async () => {
    const response = await getRevenues()
    setData(response.data)
  }

  const handleDelete = async (hotelName, revenueId) => {
    try {
      await deleteRevenue(revenueId)
      setData((prev) =>
        prev.map((hotel) =>
          hotel.name === hotelName ? { ...hotel, revenues: hotel.revenues.filter((r) => r._id !== revenueId) } : hotel,
        )
      )
    } catch (error) {
      console.error("Failed to delete revenue", error)
    }
  }

  const handleEdit = (item, hotelId) => {
    setEditingItem({ ...item, hotel_id: hotelId })
  }

  const handleApplyFilters = () => {
    setPage(1)
    setAdvancedFiltersOpen(false)
  }

  const handleSortChange = (value) => {
    if (value === "date-asc") {
      setSortBy("date")
      setSortOrder(1)
    } else if (value === "date-desc") {
      setSortBy("date")
      setSortOrder(-1)
    } else if (value === "revenue-asc") {
      setSortBy("revenue")
      setSortOrder(1)
    } else if (value === "revenue-desc") {
      setSortBy("revenue")
      setSortOrder(-1)
    }
  }

  const handleClearFilters = async () => {
    setMinDate(undefined);
    setMaxDate(undefined);
    setMinRevenue("");
    setMaxRevenue("");
    setMinOccupancy("");
    setMaxOccupancy("");
    setSelectedHotel("");
    setResetSignal(Date.now());
    await refreshData();
  };  

  const handleDateRangeFilterChange = (range) => {
    setMinDate(range?.from);
    setMaxDate(range?.to);
  };  

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Hotel Revenues Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Revenue
        </Button>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Revenue Filters</CardTitle>
          <CardDescription>Filter and search revenue data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <RevenueFiltersBar
              selectedHotel={selectedHotel}
              setSelectedHotel={setSelectedHotel}
              hotelOptions={hotelOptions}
              onDateRangeFilterChange={handleDateRangeFilterChange}
              handleSortChange={handleSortChange}
              setAdvancedFiltersOpen={setAdvancedFiltersOpen}
              resetSignal={resetSignal}
            />
            <Button variant="outline" onClick={handleClearFilters}>
              Refresh Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {data.map((hotel, index) => (
        <div key={`hotel-${index}-${hotel.name}`} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{hotel.name}</h2>
          <Tabs value={hotelTabs[hotel.name] || "all"} onValueChange={(val) => handleTabChange(hotel.name, val)}>
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
                  data={hotel.revenues.map((r) => ({
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
                  onEdit={(item) => handleEdit(item, hotel._id)}
                  onDelete={(revenueId) => handleDelete(hotel.name, revenueId)}
                />
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setRevenuesPage((prev) => ({ ...prev, [hotel.name]: (prev[hotel.name] || 1) - 1 }))} disabled={(revenuesPage[hotel.name] || 1) === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setRevenuesPage((prev) => ({ ...prev, [hotel.name]: (prev[hotel.name] || 1) + 1 }))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-center space-x-4 mt-8">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev Page
        </Button>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
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
