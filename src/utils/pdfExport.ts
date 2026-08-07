import { jsPDF } from 'jspdf'
import type { PaperSize } from '../types'
import { captureCalendarPage } from './captureCalendar'
import { PAPER_CSS_SIZE } from './paper'

export async function exportMonthToPdf(monthKey: string, paperSize: PaperSize, fileName: string) {
  const canvas = await captureCalendarPage(monthKey)
  const imgData = canvas.toDataURL('image/jpeg', 0.95)

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: PAPER_CSS_SIZE[paperSize],
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgRatio = canvas.width / canvas.height
  const pageRatio = pageWidth / pageHeight

  let renderWidth = pageWidth
  let renderHeight = pageWidth / imgRatio
  if (imgRatio < pageRatio) {
    renderHeight = pageHeight
    renderWidth = pageHeight * imgRatio
  }
  const x = (pageWidth - renderWidth) / 2
  const y = (pageHeight - renderHeight) / 2

  pdf.addImage(imgData, 'JPEG', x, y, renderWidth, renderHeight)
  pdf.save(fileName)
}
