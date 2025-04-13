import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Calendar, Download, FileText, Printer, Users } from "lucide-react"

export default function ReportPage() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true)

    try {
      // In a real implementation, you would use a library like react-to-pdf or jsPDF
      // This is a simulation of PDF generation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate PDF download
      const element = document.getElementById("report-content")
      if (element) {
        console.log("Generating PDF from element:", element)
        alert("PDF generated successfully! In a real implementation, this would download a PDF file.")
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF")
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 sm:pr-14">
        <header className="top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex flex-1 items-center gap-2">
            <FileText className="h-6 w-6" />
            <h1 className="font-semibold text-lg md:text-xl">Monthly Sales Report</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Print</span>
            </Button>
            <Button size="sm" className="h-8 gap-1" onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {isGeneratingPdf ? "Generating..." : "Export PDF"}
              </span>
            </Button>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8" id="report-content">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last hour</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full">
                  <RevenueChart />
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentSales.map((sale, index) => (
                    <div className="flex items-center" key={index}>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.customer}</p>
                        <p className="text-sm text-muted-foreground">{sale.email}</p>
                      </div>
                      <div className="ml-auto font-medium">{sale.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Top selling products for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium">
                    <div>Product</div>
                    <div>Category</div>
                    <div>Units Sold</div>
                    <div>Revenue</div>
                    <div>Growth</div>
                  </div>
                  <div className="divide-y">
                    {productData.map((product, index) => (
                      <div className="grid grid-cols-5 p-4" key={index}>
                        <div>{product.name}</div>
                        <div>{product.category}</div>
                        <div>{product.unitsSold}</div>
                        <div>{product.revenue}</div>
                        <div className={product.growth.startsWith("+") ? "text-green-500" : "text-red-500"}>
                          {product.growth}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

const recentSales = [
  {
    customer: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
  },
  {
    customer: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$1,499.00",
  },
  {
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$1,299.00",
  },
  {
    customer: "William Kim",
    email: "will@email.com",
    amount: "+$999.00",
  },
  {
    customer: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$699.00",
  },
]

const productData = [
  {
    name: "Premium Subscription",
    category: "Software",
    unitsSold: "1,245",
    revenue: "$124,500.00",
    growth: "+12.3%",
  },
  {
    name: "Basic Subscription",
    category: "Software",
    unitsSold: "2,868",
    revenue: "$86,040.00",
    growth: "+8.1%",
  },
  {
    name: "Enterprise Solution",
    category: "Services",
    unitsSold: "458",
    revenue: "$229,000.00",
    growth: "+19.4%",
  },
  {
    name: "Support Package",
    category: "Services",
    unitsSold: "985",
    revenue: "$49,250.00",
    growth: "-2.3%",
  },
  {
    name: "Mobile Add-on",
    category: "Add-ons",
    unitsSold: "3,587",
    revenue: "$35,870.00",
    growth: "+24.5%",
  },
]

// Simple chart component for visualization
function RevenueChart() {
  return (
    <div className="w-full h-full flex items-end justify-between gap-2 pt-2">
      {[65, 40, 75, 50, 85, 70, 60, 90, 80, 55, 75, 45].map((height, index) => (
        <div key={index} className="relative group">
          <div
            className="w-8 bg-primary/90 rounded-t transition-all duration-300 group-hover:bg-primary"
            style={{ height: `${height}%` }}
          ></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
          </div>
        </div>
      ))}
    </div>
  )
}
