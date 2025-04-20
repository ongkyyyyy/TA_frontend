import { useState, useEffect } from "react"
import { CalendarIcon, Download, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "../../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { RevenueTable } from "./revenue-table"
import { RevenueForm } from "./revenue-form"
import { DatePickerWithRange } from "../../datepicker/datepicker"
import { Label } from "../../ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"

import { getRevenues, deleteRevenue } from "../../../api/apiRevenues"

const revenueTabs = [
  { label: "All Revenue", value: "all" },
  { label: "Room Revenue", value: "room" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Other Revenue", value: "other" },
]

const advancedFilterFields = [
  { id: "min-revenue", label: "Min Revenue", type: "number", placeholder: "0" },
  { id: "max-revenue", label: "Max Revenue", type: "number", placeholder: "10000000" },
  { id: "min-occupancy", label: "Min Occupancy", type: "number", placeholder: "0" },
  { id: "max-occupancy", label: "Max Occupancy", type: "number", placeholder: "100" },
]

export default function RevenuePage() {
  const [data, setData] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  })
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRevenues()
        setData(response.data)
      } catch (error) {
        console.error("Failed to load revenue data", error)
      }
    }

    fetchData()
  }, [])

  const handleCreate = async () => {
    try {
      const response = await getRevenues() 
      setData(response.data)
    } catch (error) {
      console.error("Failed to refresh revenue data after create", error)
    } finally {
      setIsFormOpen(false)
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await getRevenues()
      setData(response.data)
    } catch (error) {
      console.error("Failed to refresh revenue data after update", error)
    } finally {
      setEditingItem(null)
    }
  }  
  
  const handleDelete = async (id) => {
    try {
      await deleteRevenue(id)
      setData(data.filter((item) => item._id.$oid !== id))
    } catch (error) {
      console.error("Failed to delete revenue", error)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
  }

  const filteredData = data.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.date.includes(searchTerm) ||
      item.nett_revenue.toString().includes(searchTerm) ||
      item.gross_revenue.toString().includes(searchTerm)

    const matchesDateRange =
      !dateRange.from || !dateRange.to || (new Date(item.date) >= dateRange.from && new Date(item.date) <= dateRange.to)

    return matchesSearch && matchesDateRange
  })

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by date or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
            </div>

            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-asc">Date (Ascending)</SelectItem>
                  <SelectItem value="date-desc">Date (Descending)</SelectItem>
                  <SelectItem value="revenue-asc">Revenue (Ascending)</SelectItem>
                  <SelectItem value="revenue-desc">Revenue (Descending)</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            {revenueTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setAdvancedFiltersOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {revenueTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            <RevenueTable
              data={filteredData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              view={tab.value === "all" ? undefined : tab.value}
            />
          </TabsContent>
        ))}
      </Tabs>

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
      
      <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdvancedFiltersOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
