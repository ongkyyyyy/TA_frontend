/* eslint-disable react/prop-types */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { generatePDF } from "./Pdf-generator"
import { toast } from "react-toastify"

export function PDFButton({ hotelName, year, data }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)

    try {
      const success = await generatePDF(hotelName, year, data)

      if (success) {
        toast.success("PDF generated successfully! Your analytics report has been downloaded.")
      } else {
        throw new Error("Failed to generate PDF")
      }
    } catch (error) {
      console.error("PDF generation error:", error)
      toast.error("PDF generation failed. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleDownload} className="gap-2" disabled={isGenerating} variant="default">
      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  )
}
