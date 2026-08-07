import { Document, ImageRun, Packer, Paragraph } from 'docx'
import type { PaperSize } from '../types'
import { captureCalendarPage } from './captureCalendar'
import { PAPER_MM } from './paper'

const MM_TO_TWIP = 56.6929
const MM_TO_PX = 96 / 25.4

export async function exportMonthToDocx(monthKey: string, paperSize: PaperSize, fileName: string) {
  const canvas = await captureCalendarPage(monthKey)
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas.toBlob failed'))), 'image/png', 0.95),
  )
  const arrayBuffer = await blob.arrayBuffer()

  const { width: mmW, height: mmH } = PAPER_MM[paperSize]
  const marginMm = 8
  const pageWpx = Math.round((mmW - marginMm * 2) * MM_TO_PX)
  const pageHpx = Math.round((mmH - marginMm * 2) * MM_TO_PX)
  const imgRatio = canvas.width / canvas.height
  const pageRatio = pageWpx / pageHpx
  let w = pageWpx
  let h = Math.round(pageWpx / imgRatio)
  if (imgRatio < pageRatio) {
    h = pageHpx
    w = Math.round(pageHpx * imgRatio)
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: Math.round(mmW * MM_TO_TWIP),
              height: Math.round(mmH * MM_TO_TWIP),
              orientation: 'landscape',
            },
            margin: {
              top: Math.round(marginMm * MM_TO_TWIP),
              bottom: Math.round(marginMm * MM_TO_TWIP),
              left: Math.round(marginMm * MM_TO_TWIP),
              right: Math.round(marginMm * MM_TO_TWIP),
            },
          },
        },
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                type: 'png',
                data: arrayBuffer,
                transformation: { width: w, height: h },
              }),
            ],
          }),
        ],
      },
    ],
  })

  const outBlob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(outBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}
