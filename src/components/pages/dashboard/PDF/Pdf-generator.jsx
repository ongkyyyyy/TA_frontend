import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { format } from "date-fns"
import "jspdf/dist/polyfills.es.js"

const COLORS = {
  primary: { r: 41, g: 128, b: 185 },
  secondary: { r: 44, g: 62, b: 80 },
  accent: { r: 26, g: 188, b: 156 },
  light: { r: 236, g: 240, b: 241 },
  dark: { r: 52, g: 73, b: 94 },
  white: { r: 255, g: 255, b: 255 },
}

export const generatePDF = async (hotelName, year, data) => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    pdf.setProperties({
      title: `Hotel Analytics Report - ${hotelName} - ${year}`,
      subject: `Comprehensive Revenue and Sentiment Analysis for ${year}`,
      author: "Hotel Analytics Dashboard",
      keywords: "hotel, analytics, revenue, sentiment, performance, metrics",
      creator: "Hotel Analytics System",
    })

    await addCoverPage(pdf, hotelName, year)

    // Make sure all charts are visible for capture
    const chartElements = document.querySelectorAll(".recharts-wrapper")

    if (chartElements.length === 0) {
      console.error("No charts found to export.")
      throw new Error("No charts found to export.")
    }

    addTableOfContents(pdf, chartElements.length)

    // Add summary page
    if (data && data.summary) {
      addSummaryPage(pdf, hotelName, year, data.summary)
    }

    let yPosition = 40
    let pageCount = 4 // Updated to account for cover, TOC, and summary pages

    pdf.addPage()
    addHeader(pdf, hotelName, year)

    for (let i = 0; i < chartElements.length; i++) {
      const dataUrl = await captureChart(chartElements[i])
      if (!dataUrl) {
        console.warn(`Skipping chart ${i + 1} - capture failed`)
        continue
      }

      try {
        const imgProps = pdf.getImageProperties(dataUrl)
        const pdfWidth = pdf.internal.pageSize.getWidth() - 40
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width

        if (yPosition + imgHeight + 25 > pdf.internal.pageSize.getHeight() - 30) {
          pdf.addPage()
          pageCount++
          addHeader(pdf, hotelName, year)
          yPosition = 40
        }

        addSectionDivider(pdf, yPosition - 5)
        yPosition += 5

        const chartTitle = getChartTitle(i)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(14)
        pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b)
        pdf.text(chartTitle, 20, yPosition)
        yPosition += 10

        pdf.addImage(dataUrl, "PNG", 20, yPosition, pdfWidth, imgHeight)
        yPosition += imgHeight + 5

        const description = getChartDescription(i)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(10)
        pdf.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b)

        const splitDescription = pdf.splitTextToSize(description, pdfWidth)
        pdf.text(splitDescription, 20, yPosition)
        yPosition += splitDescription.length * 5 + 15

        addFooter(pdf, pageCount)
      } catch (err) {
        console.error(`Failed to add chart ${i + 1}`, err)
      }
    }

    try {
      const formattedDate = format(new Date(), "yyyy-MM-dd")
      const fileName = `${hotelName.replace(/\s+/g, "_")}_Analytics_${year}_${formattedDate}.pdf`
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

const addSummaryPage = (pdf, hotelName, year, summary) => {
  pdf.addPage()
  addHeader(pdf, hotelName, year)

  const pageWidth = pdf.internal.pageSize.getWidth()
  let yPos = 40

  // Title
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(18)
  pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b)
  pdf.text("EXECUTIVE SUMMARY", 20, yPos)
  yPos += 15

  // Divider
  pdf.setDrawColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b)
  pdf.setLineWidth(1)
  pdf.line(20, yPos, pageWidth - 20, yPos)
  yPos += 15

  // Key Metrics Section
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(14)
  pdf.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b)
  pdf.text("Key Performance Metrics", 20, yPos)
  yPos += 12

  // Revenue Metrics
  addMetricBox(pdf, 20, yPos, 80, 25, "Total Revenue", `$${formatNumber(summary.total_revenue)}`, COLORS.primary)
  addMetricBox(
    pdf,
    110,
    yPos,
    80,
    25,
    "Avg Monthly Revenue",
    `$${formatNumber(summary.avg_monthly_revenue)}`,
    COLORS.accent,
  )
  yPos += 35

  addMetricBox(
    pdf,
    20,
    yPos,
    80,
    25,
    "Active Revenue Months",
    summary.active_revenue_months.toString(),
    COLORS.secondary,
  )
  addMetricBox(pdf, 110, yPos, 80, 25, "Total Reviews", summary.total_reviews.toString(), COLORS.dark)
  yPos += 40

  // Best/Worst Performance
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(14)
  pdf.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b)
  pdf.text("Performance Highlights", 20, yPos)
  yPos += 12

  // Best Month
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11)
  pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b)
  pdf.text("Best Revenue Month:", 20, yPos)
  pdf.setFont("helvetica", "normal")
  pdf.text(`${summary.best_month.month} - $${formatNumber(summary.best_month.revenue)}`, 70, yPos)
  yPos += 8

  // Worst Month
  pdf.setFont("helvetica", "bold")
  pdf.text("Lowest Revenue Month:", 20, yPos)
  pdf.setFont("helvetica", "normal")
  pdf.text(`${summary.worst_month.month} - $${formatNumber(summary.worst_month.revenue)}`, 70, yPos)
  yPos += 15

  // Sentiment Analysis
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(14)
  pdf.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b)
  pdf.text("Sentiment Analysis", 20, yPos)
  yPos += 12

  // Sentiment Metrics
  addMetricBox(pdf, 20, yPos, 50, 20, "Positive", summary.total_positive_sentiment.toString(), {
    r: 46,
    g: 204,
    b: 113,
  })
  addMetricBox(pdf, 75, yPos, 50, 20, "Neutral", summary.total_neutral_sentiment.toString(), { r: 241, g: 196, b: 15 })
  addMetricBox(pdf, 130, yPos, 50, 20, "Negative", summary.total_negative_sentiment.toString(), {
    r: 231,
    g: 76,
    b: 60,
  })
  yPos += 30

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(10)
  pdf.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b)
  pdf.text(`Average Sentiment Score: ${summary.avg_sentiment_score}%`, 20, yPos)
  yPos += 6
  pdf.text(`Latest Sentiment Score: ${summary.latest_sentiment_score}%`, 20, yPos)
  yPos += 6
  pdf.text(`Positive/Negative Ratio: ${summary.positive_negative_ratio}:1`, 20, yPos)
  yPos += 15

  // Best Sentiment Month
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11)
  pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b)
  pdf.text("Best Sentiment Month:", 20, yPos)
  pdf.setFont("helvetica", "normal")
  pdf.text(`${summary.best_sentiment_month.month} (${summary.best_sentiment_month.score}%)`, 70, yPos)
  yPos += 8

  pdf.setFont("helvetica", "bold")
  pdf.text("Worst Sentiment Month:", 20, yPos)
  pdf.setFont("helvetica", "normal")
  pdf.text(`${summary.worst_sentiment_month.month} (${summary.worst_sentiment_month.score}%)`, 70, yPos)

  addFooter(pdf, 3)
}

const addMetricBox = (pdf, x, y, width, height, label, value, color) => {
  // Background with lighter shade (no alpha needed)
  const lightColor = {
    r: Math.min(255, color.r + 200),
    g: Math.min(255, color.g + 200),
    b: Math.min(255, color.b + 200),
  }

  pdf.setFillColor(lightColor.r, lightColor.g, lightColor.b)
  pdf.roundedRect(x, y, width, height, 2, 2, "F")

  // Border
  pdf.setDrawColor(color.r, color.g, color.b)
  pdf.setLineWidth(0.5)
  pdf.roundedRect(x, y, width, height, 2, 2, "S")

  // Label
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(9)
  pdf.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b)
  pdf.text(label, x + 3, y + 8)

  // Value
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(12)
  pdf.setTextColor(color.r, color.g, color.b)
  pdf.text(value, x + 3, y + 18)
}

const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B"
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K"
  }
  return num.toFixed(2)
}

const captureChart = async (chartElement) => {
  try {
    const rect = chartElement.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      console.warn("Chart has zero dimensions, skipping.")
      return null
    }

    const canvas = await html2canvas(chartElement, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      allowTaint: false,
      imageTimeout: 15000,
    })

    const dataUrl = canvas.toDataURL("image/png", 0.95)

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

const addCoverPage = async (pdf, hotelName, year) => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  for (let i = 0; i < pageHeight; i += 0.5) {
    const ratio = i / pageHeight
    const r = Math.floor(COLORS.light.r * (1 - ratio) + COLORS.white.r * ratio)
    const g = Math.floor(COLORS.light.g * (1 - ratio) + COLORS.white.g * ratio)
    const b = Math.floor(COLORS.light.b * (1 - ratio) + COLORS.white.b * ratio)

    pdf.setDrawColor(r, g, b)
    pdf.setLineWidth(0.5)
    pdf.line(0, i, pageWidth, i)
  }

  pdf.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b)
  pdf.roundedRect(15, 15, pageWidth - 30, 10, 3, 3, "F")
  pdf.roundedRect(15, pageHeight - 25, pageWidth - 30, 10, 3, 3, "F")

  try {
    const logoImg = document.querySelector('img[src*="logo"]')
    if (logoImg) {
      const logoCanvas = document.createElement("canvas")
      logoCanvas.width = logoImg.width
      logoCanvas.height = logoImg.height
      const ctx = logoCanvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(logoImg, 0, 0)
        const logoDataUrl = logoCanvas.toDataURL("image/png")

        pdf.setFillColor(240, 240, 240)
        pdf.roundedRect((pageWidth - 65) / 2, 39, 65, 65, 5, 5, "F")
        pdf.addImage(logoDataUrl, "PNG", (pageWidth - 60) / 2, 40, 60, 60)
      }
    }
  } catch (error) {
    console.warn("Could not add logo to PDF", error)
  }

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(28)
  pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b)
  const title = "HOTEL ANALYTICS REPORT"
  const titleWidth = (pdf.getStringUnitWidth(title) * 28) / pdf.internal.scaleFactor
  const titleX = (pageWidth - titleWidth) / 2
  pdf.text(title, titleX, 130)

  pdf.setDrawColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b)
  pdf.setLineWidth(1)
  pdf.line(titleX, 135, titleX + titleWidth, 135)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(18)
  pdf.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b)
  const subtitle = "Revenue & Sentiment Analysis"
  const subtitleWidth = (pdf.getStringUnitWidth(subtitle) * 18) / pdf.internal.scaleFactor
  const subtitleX = (pageWidth - subtitleWidth) / 2
  pdf.text(subtitle, subtitleX, 145)

  pdf.setFontSize(16)
  pdf.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b)

  const hotelText = `Hotel: ${hotelName}`
  const hotelWidth = (pdf.getStringUnitWidth(hotelText) * 16) / pdf.internal.scaleFactor
  const hotelX = (pageWidth - hotelWidth) / 2
  pdf.text(hotelText, hotelX, 165)

  const yearText = `Year: ${year}`
  const yearWidth = (pdf.getStringUnitWidth(yearText) * 16) / pdf.internal.scaleFactor
  const yearX = (pageWidth - yearWidth) / 2
  pdf.text(yearText, yearX, 175)

  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  const today = new Date()
  const dateText = `Generated on: ${format(today, "MMMM d, yyyy 'at' h:mm a")}`
  const dateWidth = (pdf.getStringUnitWidth(dateText) * 10) / pdf.internal.scaleFactor
  const dateX = (pageWidth - dateWidth) / 2
  pdf.text(dateText, dateX, 190)

  pdf.setFontSize(8)
  pdf.setTextColor(120, 120, 120)
  const confidentialText = "CONFIDENTIAL - FOR INTERNAL USE ONLY"
  const confidentialWidth = (pdf.getStringUnitWidth(confidentialText) * 8) / pdf.internal.scaleFactor
  const confidentialX = (pageWidth - confidentialWidth) / 2
  pdf.text(confidentialText, confidentialX, pageHeight - 30)
}

const addTableOfContents = (pdf, chartCount) => {
  pdf.addPage()

  const pageWidth = pdf.internal.pageSize.getWidth()

  // Calculate page numbers based on content
  const summaryPageNumber = 3
  const firstChartPageNumber = summaryPageNumber + 1

  // Estimate how many pages the charts will take (assuming ~2 charts per page)
  const chartPagesEstimate = Math.ceil(chartCount / 2)
  const correlationChartsStartPage = firstChartPageNumber + Math.min(3, chartPagesEstimate)

  pdf.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b)
  pdf.rect(0, 0, pageWidth, 20, "F")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(16)
  pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b)
  pdf.text("TABLE OF CONTENTS", 20, 15)

  pdf.setDrawColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b)
  pdf.setLineWidth(0.5)
  pdf.line(20, 20, pageWidth - 20, 20)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(12)
  pdf.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b)

  let yPos = 40

  // Summary Section
  pdf.setFont("helvetica", "bold")
  pdf.text("Executive Summary", 20, yPos)
  pdf.text(summaryPageNumber.toString(), 180, yPos, { align: "right" })
  yPos += 20

  // Charts Section
  pdf.setFont("helvetica", "bold")
  pdf.text("Performance and Trends", 20, yPos)
  pdf.text(firstChartPageNumber.toString(), 180, yPos, { align: "right" })
  yPos += 15

  pdf.setFont("helvetica", "normal")
  pdf.text("1. Monthly Revenue Trends", 30, yPos)
  yPos += 10

  pdf.text("2. Sentiment Ratios", 30, yPos)
  yPos += 10

  pdf.text("3. Composite Sentiment Index", 30, yPos)
  yPos += 15

  pdf.setFont("helvetica", "bold")
  pdf.text("Performance Correlations", 20, yPos)
  pdf.text(correlationChartsStartPage.toString(), 180, yPos, { align: "right" })
  yPos += 15

  pdf.setFont("helvetica", "normal")
  pdf.text("4. Review Volume vs Revenue", 30, yPos)
  yPos += 10

  pdf.text("5. CSI Revenue Correlation", 30, yPos)
  yPos += 10

  pdf.text("6. Revenue vs Sentiment", 30, yPos)

  addFooter(pdf, 2)
}

const addHeader = (pdf, hotelName, year) => {
  const pageWidth = pdf.internal.pageSize.getWidth()

  pdf.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b)
  pdf.rect(0, 0, pageWidth, 20, "F")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(10)
  pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b)
  pdf.text(`Hotel Analytics Report - ${hotelName} - ${year}`, 20, 15)

  const today = format(new Date(), "MMMM d, yyyy")
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8)
  pdf.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b)
  pdf.text(today, pageWidth - 20, 15, { align: "right" })

  pdf.setDrawColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b)
  pdf.setLineWidth(0.2)
  pdf.line(10, 20, pageWidth - 10, 20)
}

const addFooter = (pdf, pageNumber) => {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  pdf.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b)
  pdf.rect(0, pageHeight - 15, pageWidth, 15, "F")

  pdf.setDrawColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b)
  pdf.setLineWidth(0.2)
  pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8)
  pdf.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b)
  pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" })

  pdf.setFontSize(7)
  pdf.text("© Hotel Analytics Dashboard", 20, pageHeight - 10)

  pdf.text("Confidential", pageWidth - 20, pageHeight - 10, { align: "right" })
}

const addSectionDivider = (pdf, yPosition) => {
  pdf.setDrawColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b)
  pdf.setLineWidth(0.3)
  pdf.line(20, yPosition, 60, yPosition)
}

const getChartTitle = (index) => {
  const chartTitles = [
    "Monthly Revenue Trends",
    "Sentiment Ratios Distribution",
    "Composite Sentiment Index",
    "Review Volume vs Revenue",
    "CSI Revenue Correlation",
    "Revenue vs Sentiment Analysis",
  ]
  return chartTitles[index] || `Chart ${index + 1}`
}

const getChartDescription = (index) => {
  const descriptions = [
    "This chart illustrates the monthly revenue trends across different revenue streams, highlighting seasonal fluctuations and peak financial periods throughout the year.",
    "This chart shows the distribution of positive, negative, and neutral sentiment ratios, providing insights into overall customer satisfaction patterns.",
    "The Composite Sentiment Index aggregates customer satisfaction levels, offering a comprehensive view of sentiment trends over time.",
    "This analysis explores the relationship between review volume and revenue performance, showing how customer engagement correlates with business outcomes.",
    "This scatter plot visualizes the correlation between composite sentiment index, revenue, and review volume to assess their combined impact on business performance.",
    "This chart demonstrates the direct relationship between revenue performance and sentiment scores, revealing how customer satisfaction impacts financial outcomes.",
  ]
  return descriptions[index] || "Detailed analysis of hotel performance metrics and customer satisfaction indicators."
}
