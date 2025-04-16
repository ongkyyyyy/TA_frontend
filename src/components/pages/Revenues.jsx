
import { useState } from "react"
import { ArrowUpDown, Calendar, ChevronDown, Download, Filter, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar as CalendarComponent } from "../ui/calendar"

const revenueData = [
  {
    id: 1,
    date: "2023-05-01",
    customer: "Acme Inc.",
    product: "Software License",
    amount: 1250.0,
    status: "Paid",
    channel: "Direct Sales",
  },
  {
    id: 2,
    date: "2023-05-03",
    customer: "TechCorp",
    product: "Consulting Services",
    amount: 3500.0,
    status: "Pending",
    channel: "Partner",
  },
  {
    id: 3,
    date: "2023-05-05",
    customer: "Global Enterprises",
    product: "Hardware",
    amount: 7800.0,
    status: "Paid",
    channel: "Online",
  },
  {
    id: 4,
    date: "2023-05-07",
    customer: "Startup Co.",
    product: "Support Plan",
    amount: 950.0,
    status: "Overdue",
    channel: "Direct Sales",
  },
  {
    id: 5,
    date: "2023-05-10",
    customer: "Local Business",
    product: "Software License",
    amount: 1250.0,
    status: "Paid",
    channel: "Online",
  },
  {
    id: 6,
    date: "2023-05-12",
    customer: "Enterprise Solutions",
    product: "Custom Development",
    amount: 12500.0,
    status: "Pending",
    channel: "Partner",
  },
  {
    id: 7,
    date: "2023-05-15",
    customer: "Small Shop",
    product: "Hardware",
    amount: 2300.0,
    status: "Paid",
    channel: "Direct Sales",
  },
  {
    id: 8,
    date: "2023-05-18",
    customer: "Medium Corp",
    product: "Consulting Services",
    amount: 4500.0,
    status: "Paid",
    channel: "Partner",
  },
]

export default function RevenuesDashboard() {
  const [data, setData] = useState(revenueData)
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })
  const [statusFilter, setStatusFilter] = useState("all")
  const [channelFilter, setChannelFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState(null)

  // Sort function
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1
      }
      return 0
    })

    setData(sortedData)
  }

  // Filter function
  const applyFilters = () => {
    let filteredData = [...revenueData]

    // Apply status filter
    if (statusFilter !== "all") {
      filteredData = filteredData.filter((item) => item.status === statusFilter)
    }

    // Apply channel filter
    if (channelFilter !== "all") {
      filteredData = filteredData.filter((item) => item.channel === channelFilter)
    }

    // Apply search term
    if (searchTerm) {
      filteredData = filteredData.filter(
        (item) =>
          item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply date filter
    if (date) {
      const selectedDate = new Date(date).toISOString().split("T")[0]
      filteredData = filteredData.filter((item) => item.date === selectedDate)
    }

    // Apply current sort
    filteredData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })

    setData(filteredData)
  }

  // Reset filters
  const resetFilters = () => {
    setStatusFilter("all")
    setChannelFilter("all")
    setSearchTerm("")
    setDate(null)
    setData(revenueData)
    setSortConfig({ key: "date", direction: "desc" })
  }

  // Calculate total revenue
  const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0).toFixed(2)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Revenues</h1>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Summary of all revenue transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue}</div>
            <p className="text-sm text-muted-foreground mt-1">{data.length} transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Revenue Transactions</h2>

          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="outline" onClick={resetFilters} className="h-9">
              Reset
            </Button>

            <Button variant="outline" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by customer or product..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setTimeout(applyFilters, 300)
              }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value)
                    setTimeout(applyFilters, 100)
                  }}
                >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Paid">Paid</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Pending">Pending</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Overdue">Overdue</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Channel
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Channel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={channelFilter}
                  onValueChange={(value) => {
                    setChannelFilter(value)
                    setTimeout(applyFilters, 100)
                  }}
                >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Direct Sales">Direct Sales</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Partner">Partner</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Online">Online</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date)
                    setTimeout(applyFilters, 100)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("date")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("customer")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Customer
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("product")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Product
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("amount")}
                    className="flex items-center gap-1 font-medium ml-auto"
                  >
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("status")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("channel")}
                    className="flex items-center gap-1 font-medium"
                  >
                    Channel
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>{item.channel}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No revenue data found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
