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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @param {string} hotelName 
 * @param {string|number} year 
 * @param {string} activeTab 
 * @returns {Promise<boolean>} 
 */
export const generatePDF = async (hotelName, year, activeTab) => {
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

    await addCoverPage(pdf, hotelName, year, activeTab)

    const tabsContent = document.querySelectorAll('[role="tabpanel"]')
    const originalDisplay = []

    tabsContent.forEach((el, i) => {
      originalDisplay[i] = el.style.display
      el.style.display = "block"
    })

    await wait(800)

    const chartElements = document.querySelectorAll(".recharts-wrapper")

    if (chartElements.length === 0) {
      console.error("No charts found to export.")
      throw new Error("No charts found to export.")
    }

    addTableOfContents(pdf, chartElements.length, activeTab)

    let yPosition = 40
    let pageCount = 3 

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

        const chartTitle = getChartTitle(i, activeTab)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(14)
        pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b)
        pdf.text(chartTitle, 20, yPosition)
        yPosition += 10

        pdf.addImage(dataUrl, "PNG", 20, yPosition, pdfWidth, imgHeight)
        yPosition += imgHeight + 5

        const description = getChartDescription(i, activeTab)
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

    tabsContent.forEach((el, i) => {
      el.style.display = originalDisplay[i]
    })

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

/**
 * @param {Element} chartElement 
 * @returns {Promise<string|null>} 
 */
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

/**
 * @param {jsPDF} pdf
 * @param {string} hotelName
 * @param {string|number} year 
 * @param {string} activeTab 
 * @returns {Promise<void>}
 */
const addCoverPage = async (pdf, hotelName, year, activeTab) => {
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
  const subtitle = `${activeTab === "single" ? "Single" : "Hybrid"} Analysis`
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

/**
 * @param {jsPDF} pdf 
 * @param {number} chartCount 
 * @param {string} activeTab 
 */
const addTableOfContents = (pdf, chartCount, activeTab) => {
  pdf.addPage()

  const pageWidth = pdf.internal.pageSize.getWidth()

  pdf.setFillColor(COLORS.light.r, COLORS.light.g, COLORS.light.b)
  pdf.rect(0, 0, pageWidth, 20, "F")

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(16)
  pdf.setTextColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b)
  pdf.text("CHARTS LIST", 20, 15)

  pdf.setDrawColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b)
  pdf.setLineWidth(0.5)
  pdf.line(20, 20, pageWidth - 20, 20)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(12)
  pdf.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b)

  let yPos = 40

  pdf.setFont("helvetica", "bold")
  pdf.text(`${activeTab === "revenue" ? "Revenue" : "Sentiment"} Analysis Charts`, 20, yPos)
  yPos += 15

  for (let i = 0; i < chartCount; i++) {
    const chartTitle = getChartTitle(i, activeTab)
    pdf.setFont("helvetica", "normal")
    pdf.text(`${i + 1}. ${chartTitle}`, 30, yPos)
    pdf.text(`${i + 3}`, 180, yPos, { align: "right" })
    yPos += 10
  }

  addFooter(pdf, 2)
}

/**
 * @param {jsPDF} pdf 
 * @param {string} hotelName 
 * @param {string|number} year 
 */
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

/**
 * @param {jsPDF} pdf 
 * @param {number} pageNumber 
 */
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

/**
 * @param {jsPDF} pdf 
 * @param {number} yPosition
 */
const addSectionDivider = (pdf, yPosition) => {
  pdf.setDrawColor(COLORS.accent.r, COLORS.accent.g, COLORS.accent.b)
  pdf.setLineWidth(0.3)
  pdf.line(20, yPosition, 60, yPosition)
}

/**
 * @param {number} index 
 * @param {string} activeTab 
 * @returns {string}
 */
const getChartTitle = (index, activeTab) => {
  if (activeTab === "revenue") {
    const revenueTitles = [
      "Monthly Revenue Trends",
      "Revenue vs Sentiment Analysis",
      "Review Volume vs Revenue",
      "Revenue by Channel",
      "Year-over-Year Revenue Comparison",
    ]
    return revenueTitles[index % revenueTitles.length]
  } else {
    const sentimentTitles = [
      "Composite Sentiment Index (CSI)",
      "Sentiment Distribution Analysis",
      "CSI Revenue Correlation",
      "Sentiment Trends Over Time",
      "Category-Specific Sentiment Analysis",
    ]
    return sentimentTitles[index % sentimentTitles.length]
  }
}

/**
 * @param {number} index 
 * @param {string} activeTab 
 * @returns {string}
 */
const getChartDescription = (index, activeTab) => {
  if (activeTab === "single") {
    const singleAnalysisDescriptions = [
      "This chart illustrates the monthly revenue trends, highlighting seasonal fluctuations and peak financial periods.",
      "The Composite Sentiment Index aggregates customer satisfaction levels, offering a high-level view of overall sentiment throughout the year.",
      "This chart categorizes sentiment into positive, neutral, and negative segments, helping visualize customer feedback distribution."
    ]
    return singleAnalysisDescriptions[index % singleAnalysisDescriptions.length]
  } else {
    const hybridAnalysisDescriptions = [
      "This analysis explores how sentiment metrics correlate with revenue performance, revealing how customer satisfaction impacts financial outcomes.",
      "This chart shows the relationship between the number of reviews and revenue, highlighting the business effect of customer engagement.",
      "This scatter plot visualizes the correlation between composite sentiment, revenue, and review volume to assess their combined impact."
    ]
    return hybridAnalysisDescriptions[index % hybridAnalysisDescriptions.length]
  }
}

