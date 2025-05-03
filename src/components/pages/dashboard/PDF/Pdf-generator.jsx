import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Utility delay
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generatePDF = async () => {
  const pdf = new jsPDF("p", "mm", "a4");

  // Temporarily show all tabs to ensure charts are rendered
  const tabsContent = document.querySelectorAll('[role="tabpanel"]');
  const originalDisplay = [];

  tabsContent.forEach((el, i) => {
    originalDisplay[i] = el.style.display;
    el.style.display = "block";
  });

  await wait(300); // Allow rendering time

  const chartElements = document.querySelectorAll(".recharts-wrapper");

  if (chartElements.length === 0) {
    console.error("No charts found to export.");
    throw new Error("No charts found to export.");
  }

  let yPosition = 10;

  const captureChart = async (chartElement) => {
    try {
      const rect = chartElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn("Chart has zero dimensions, skipping.");
        return null;
      }

      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");

      if (!dataUrl.startsWith("data:image/png")) {
        console.warn("Invalid PNG data generated.");
        return null;
      }

      return dataUrl;
    } catch (error) {
      console.error("html2canvas failed:", error);
      return null;
    }
  };

  for (let i = 0; i < chartElements.length; i++) {
    const dataUrl = await captureChart(chartElements[i]);
    if (!dataUrl) {
      console.warn(`Skipping chart ${i + 1}`);
      continue;
    }

    try {
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - 10) {
        pdf.addPage();
        yPosition = 10;
      }

      pdf.addImage(dataUrl, "PNG", 10, yPosition, pdfWidth, imgHeight);
      yPosition += imgHeight + 10;
    } catch (err) {
      console.error(`Failed to add chart ${i + 1}`, err);
    }
  }

  // Restore original tab visibility
  tabsContent.forEach((el, i) => {
    el.style.display = originalDisplay[i];
  });

  try {
    pdf.save("charts.pdf");
    return true;
  } catch (err) {
    console.error("PDF save failed:", err);
    throw new Error("Failed to generate PDF");
  }
};
