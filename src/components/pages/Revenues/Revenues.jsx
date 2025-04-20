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

import { getRevenues } from "../../../api/apiRevenues"

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

  const handleUpdate = (updatedItem) => {
    setData(data.map((item) => (item._id.$oid === updatedItem._id.$oid ? updatedItem : item)))
    setEditingItem(null)
  }

  const handleDelete = (id) => {
    setData(data.filter((item) => item._id.$oid !== id))
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
        <h1 className="text-3xl font-bold">Hotel Revenue Management</h1>
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
            <TabsTrigger value="all">All Revenue</TabsTrigger>
            <TabsTrigger value="room">Room Revenue</TabsTrigger>
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="other">Other Revenue</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setAdvancedFiltersOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <RevenueTable data={filteredData} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="room" className="mt-0">
          <RevenueTable data={filteredData} onEdit={handleEdit} onDelete={handleDelete} view="room" />
        </TabsContent>

        <TabsContent value="restaurant" className="mt-0">
          <RevenueTable data={filteredData} onEdit={handleEdit} onDelete={handleDelete} view="restaurant" />
        </TabsContent>

        <TabsContent value="other" className="mt-0">
          <RevenueTable data={filteredData} onEdit={handleEdit} onDelete={handleDelete} view="other" />
        </TabsContent>
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
      {/* Advanced Filters Dialog */}
      <Dialog open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>Set additional filters to refine your revenue data.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min-revenue" className="text-right">
                Min Revenue
              </Label>
              <Input id="min-revenue" type="number" placeholder="0" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max-revenue" className="text-right">
                Max Revenue
              </Label>
              <Input id="max-revenue" type="number" placeholder="10000000" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min-occupancy" className="text-right">
                Min Occupancy
              </Label>
              <Input id="min-occupancy" type="number" placeholder="0" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max-occupancy" className="text-right">
                Max Occupancy
              </Label>
              <Input id="max-occupancy" type="number" placeholder="100" className="col-span-3" />
            </div>
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
