import jsPDF from "jspdf"
import html2canvas from "html2canvas"

// Utility delay
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const generatePDF = async (hotelId, year, activeTab) => {
  try {
    // Create PDF with professional settings
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    // Get hotel name from the dropdown
    let hotelName = "All Hotels"
    if (hotelId !== "All") {
      const hotelSelect = document.querySelector("[data-hotel-select] .select-value")
      if (hotelSelect && hotelSelect.textContent) {
        hotelName = hotelSelect.textContent.trim()
      }
    }

    // Set document properties
    pdf.setProperties({
      title: `Hotel Analytics Report - ${hotelName} - ${year}`,
      subject: `Revenue and Sentiment Analysis for ${year}`,
      author: "Hotel Analytics Dashboard",
      keywords: "hotel, analytics, revenue, sentiment",
      creator: "Hotel Analytics System",
    })

    // Add cover page
    addCoverPage(pdf, hotelName, year, activeTab)

    // Temporarily show all tabs to ensure charts are rendered
    const tabsContent = document.querySelectorAll('[role="tabpanel"]')
    const originalDisplay = []

    tabsContent.forEach((el, i) => {
      originalDisplay[i] = el.style.display
      el.style.display = "block"
    })

    await wait(500) // Allow rendering time

    const chartElements = document.querySelectorAll(".recharts-wrapper")

    if (chartElements.length === 0) {
      console.error("No charts found to export.")
      throw new Error("No charts found to export.")
    }

    let yPosition = 30 // Start position after header
    let pageCount = 2 // Start from page 2 (after cover)

    // Add first page header
    pdf.addPage()
    addHeader(pdf, hotelName, year)

    for (let i = 0; i < chartElements.length; i++) {
      const dataUrl = await captureChart(chartElements[i])
      if (!dataUrl) {
        console.warn(`Skipping chart ${i + 1}`)
        continue
      }

      try {
        const imgProps = pdf.getImageProperties(dataUrl)
        const pdfWidth = pdf.internal.pageSize.getWidth() - 40 // Margins
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width

        // Check if we need a new page
        if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - 30) {
          pdf.addPage()
          pageCount++
          addHeader(pdf, hotelName, year)
          yPosition = 30 // Reset position after header
        }

        // Add chart title based on index
        const chartTitle = getChartTitle(i, activeTab)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(12)
        pdf.text(chartTitle, 20, yPosition)
        yPosition += 8

        // Add chart image
        pdf.addImage(dataUrl, "PNG", 20, yPosition, pdfWidth, imgHeight)
        yPosition += imgHeight + 15 // Add space after chart

        // Add footer with page number
        addFooter(pdf, pageCount)
      } catch (err) {
        console.error(`Failed to add chart ${i + 1}`, err)
      }
    }

    // Restore original tab visibility
    tabsContent.forEach((el, i) => {
      el.style.display = originalDisplay[i]
    })

    try {
      const fileName = `${hotelName.replace(/\s+/g, "_")}_Analytics_${year}.pdf`
      pdf.save(fileName)
      return true
    } catch (err) {
      console.error("PDF save failed:", err)
      throw new Error("Failed to generate PDF")
    }
  } catch (error) {
    console.error("PDF generation error:", error)
    return false
  }
}

// Helper function to capture chart
const captureChart = async (chartElement) => {
  try {
    const rect = chartElement.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      console.warn("Chart has zero dimensions, skipping.")
      return null
    }

    const canvas = await html2canvas(chartElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    })

    const dataUrl = canvas.toDataURL("image/png")

    if (!dataUrl.startsWith("data:image/png")) {
      console.warn("Invalid PNG data generated.")
      return null
    }

    return dataUrl
  } catch (error) {
    console.error("html2canvas failed:", error)
    return null
  }
}

// Add cover page
const addCoverPage = (pdf, hotelName, year, activeTab) => {
  // Set background color
  pdf.setFillColor(240, 240, 245)
  pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), "F")

  // Add logo (placeholder - you should replace with actual logo)
  try {
    const logoImg = document.querySelector('img[src*="logo"]')
    if (logoImg) {
      const logoCanvas = document.createElement("canvas")
      logoCanvas.width = logoImg.width
      logoCanvas.height = logoImg.height
      const ctx = logoCanvas.getContext("2d")
      ctx.drawImage(logoImg, 0, 0)
      const logoDataUrl = logoCanvas.toDataURL("image/png")

      pdf.addImage(logoDataUrl, "PNG", (pdf.internal.pageSize.getWidth() - 60) / 2, 40, 60, 60)
    }
  } catch (error) {
    console.warn("Could not add logo to PDF", error)
  }

  // Add title
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(24)
  pdf.setTextColor(44, 62, 80)
  const title = "Hotel Analytics Report"
  const titleWidth = (pdf.getStringUnitWidth(title) * 24) / pdf.internal.scaleFactor
  const titleX = (pdf.internal.pageSize.getWidth() - titleWidth) / 2
  pdf.text(title, titleX, 120)

  // Add subtitle
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(16)
  pdf.setTextColor(52, 73, 94)
  const subtitle = `${activeTab === "revenue" ? "Revenue" : "Sentiment"} Analysis`
  const subtitleWidth = (pdf.getStringUnitWidth(subtitle) * 16) / pdf.internal.scaleFactor
  const subtitleX = (pdf.internal.pageSize.getWidth() - subtitleWidth) / 2
  pdf.text(subtitle, subtitleX, 130)

  // Add hotel and year
  pdf.setFontSize(14)
  pdf.setTextColor(52, 73, 94)
  const hotelText = `Hotel: ${hotelName}`
  const hotelWidth = (pdf.getStringUnitWidth(hotelText) * 14) / pdf.internal.scaleFactor
  const hotelX = (pdf.internal.pageSize.getWidth() - hotelWidth) / 2
  pdf.text(hotelText, hotelX, 145)

  const yearText = `Year: ${year}`
  const yearWidth = (pdf.getStringUnitWidth(yearText) * 14) / pdf.internal.scaleFactor
  const yearX = (pdf.internal.pageSize.getWidth() - yearWidth) / 2
  pdf.text(yearText, yearX, 155)

  // Add date
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  const today = new Date()
  const dateText = `Generated on: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`
  const dateWidth = (pdf.getStringUnitWidth(dateText) * 10) / pdf.internal.scaleFactor
  const dateX = (pdf.internal.pageSize.getWidth() - dateWidth) / 2
  pdf.text(dateText, dateX, 170)

  // Add decorative element
  pdf.setDrawColor(52, 152, 219)
  pdf.setLineWidth(0.5)
  pdf.line(40, 180, pdf.internal.pageSize.getWidth() - 40, 180)
}

// Add header to each page
const addHeader = (pdf, hotelName, year) => {
  // Add header background
  pdf.setFillColor(245, 245, 250)
  pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), 20, "F")

  // Add header text
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(10)
  pdf.setTextColor(44, 62, 80)
  pdf.text(`Hotel Analytics Report - ${hotelName} - ${year}`, 20, 15)

  // Add date on right
  const today = new Date().toLocaleDateString()
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text(today, pdf.internal.pageSize.getWidth() - 40, 15, { align: "right" })

  // Add separator line
  pdf.setDrawColor(220, 220, 220)
  pdf.setLineWidth(0.2)
  pdf.line(10, 20, pdf.internal.pageSize.getWidth() - 10, 20)
}

// Add footer with page number
const addFooter = (pdf, pageNumber) => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Add footer background
  pdf.setFillColor(245, 245, 250)
  pdf.rect(0, pageHeight - 15, pageWidth, 15, "F")

  // Add separator line
  pdf.setDrawColor(220, 220, 220)
  pdf.setLineWidth(0.2)
  pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15)

  // Add page number
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" })

  // Add copyright
  pdf.setFontSize(7)
  pdf.text("© Hotel Analytics Dashboard", 20, pageHeight - 10)
}

// Get chart title based on index and active tab
const getChartTitle = (index, activeTab) => {
  if (activeTab === "revenue") {
    const revenueTitles = ["Monthly Revenue Trends", "Revenue vs Sentiment Analysis", "Review Volume vs Revenue"]
    return revenueTitles[index % revenueTitles.length]
  } else {
    const sentimentTitles = ["Composite Sentiment Index", "Sentiment Ratios", "CSI Revenue Correlation"]
    return sentimentTitles[index % sentimentTitles.length]
  }
}
