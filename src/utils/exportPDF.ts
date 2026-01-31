import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Wait for all images in an element to load
async function waitForImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll("img");
  const promises = Array.from(images).map((img) => {
    if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Continue even if image fails
      // Timeout fallback in case load event doesn't fire
      setTimeout(() => resolve(), 3000);
    });
  });
  await Promise.all(promises);
  // Small delay to ensure rendering is complete
  await new Promise((resolve) => setTimeout(resolve, 100));
}

export async function exportInvoicePDF(
  invoiceNumber: string,
  element: HTMLElement
): Promise<void> {
  try {
    // Wait for all images to load before capturing
    await waitForImages(element);

    // Create canvas from the invoice element
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Ensure white background for PDF regardless of dark mode
        const clonedElement = clonedDoc.getElementById("invoice-preview");
        if (clonedElement) {
          clonedElement.style.backgroundColor = "#ffffff";
          clonedElement.classList.remove("dark");
          // Force light mode text colors
          clonedElement.querySelectorAll("*").forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.classList.contains("dark:text-white")) {
              htmlEl.style.color = "#111827";
            }
            if (htmlEl.classList.contains("dark:text-gray-100")) {
              htmlEl.style.color = "#374151";
            }
            if (htmlEl.classList.contains("dark:text-gray-300")) {
              htmlEl.style.color = "#6b7280";
            }
            if (htmlEl.classList.contains("dark:text-gray-400")) {
              htmlEl.style.color = "#9ca3af";
            }
            if (htmlEl.classList.contains("dark:text-green-400")) {
              htmlEl.style.color = "#16a34a";
            }
            if (htmlEl.classList.contains("dark:border-gray-700")) {
              htmlEl.style.borderColor = "#e5e7eb";
            }
            if (htmlEl.classList.contains("dark:border-green-700")) {
              htmlEl.style.borderColor = "#86efac";
            }
            if (htmlEl.classList.contains("dark:bg-slate-900")) {
              htmlEl.style.backgroundColor = "#ffffff";
            }
          });
        }
      },
    });

    // Get canvas dimensions
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? "portrait" : "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add image to PDF
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Download the PDF
    pdf.save(`INV-${invoiceNumber}.pdf`);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw new Error("Failed to export invoice as PDF");
  }
}
