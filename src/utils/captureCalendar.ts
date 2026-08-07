import html2canvas from 'html2canvas'

export async function captureCalendarPage(monthKey: string): Promise<HTMLCanvasElement> {
  const el = document.querySelector<HTMLElement>(`.calendar-page[data-month="${monthKey}"]`)
  if (!el) throw new Error(`Calendar page for month ${monthKey} not found`)
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  return html2canvas(el, {
    backgroundColor: isDark ? '#12152e' : '#ffffff',
    scale: 2,
    useCORS: true,
  })
}
