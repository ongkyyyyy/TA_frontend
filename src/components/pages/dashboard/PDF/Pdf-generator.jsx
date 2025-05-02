import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

const getSelectedHotelName = (hotelId, hotels) => {
  if (hotelId === "All") return "All Hotels"
  const hotel = hotels.find((h) => h._id === hotelId)
  return hotel ? hotel.hotel_name : "Unknown Hotel"
}

const captureChart = async (chartElement) => {
  if (!chartElement) return null

  const canvas = await html2canvas(chartElement, {
    scale: 2, 
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  })

  return canvas.toDataURL("image/png")
}

export const generatePDF = async (hotelId, year, hotels, activeTab) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2

  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("Hotel Revenue & Sentiment Analytics", pageWidth / 2, margin, { align: "center" })

  const hotelName = getSelectedHotelName(hotelId, hotels)
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Hotel: ${hotelName}`, margin, margin + 10)
  doc.text(`Year: ${year}`, margin, margin + 16)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, margin + 22)

  doc.setDrawColor(200, 200, 200)
  doc.line(margin, margin + 25, pageWidth - margin, margin + 25)

  const chartElements = document.querySelectorAll(".recharts-wrapper")
  let currentY = margin + 30

  for (let i = 0; i < chartElements.length; i++) {
    const chartCard = chartElements[i].closest(".card")
    const chartTitle = chartCard ? chartCard.querySelector(".card-title")?.textContent : `Chart ${i + 1}`

    const chartImage = await captureChart(chartElements[i])
    if (!chartImage) continue

    if (currentY > pageHeight - 60) {
      doc.addPage()
      currentY = margin
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(chartTitle || `Chart ${i + 1}`, margin, currentY)
    currentY += 8

    const imgWidth = contentWidth
    const imgHeight = (chartElements[i].offsetHeight * imgWidth) / chartElements[i].offsetWidth

    doc.addImage(chartImage, "PNG", margin, currentY, imgWidth, imgHeight)
    currentY += imgHeight + 15
  }

  doc.save(`Hotel_Analytics_${hotelName.replace(/\s+/g, "_")}_${year}.pdf`)
}

window.downloadPDF = () => {
  const hotelId = document.querySelector('[placeholder="Select Hotel"]')?.closest("button")?.value || "All"
  const year =
    document.querySelector('[placeholder="Select Year"]')?.closest("button")?.value ||
    new Date().getFullYear().toString()
  const activeTab = document.querySelector('[role="tablist"] [data-state="active"]')?.value || "sentiment"

  const hotelsData = window.hotelsData || []

  generatePDF(hotelId, year, hotelsData, activeTab)
}
