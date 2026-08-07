import html2canvas from 'html2canvas'

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
}

export async function captureCalendarPage(monthKey: string): Promise<HTMLCanvasElement> {
  const el = document.querySelector<HTMLElement>(`.calendar-page[data-month="${monthKey}"]`)
  if (!el) throw new Error(`Calendar page for month ${monthKey} not found`)

  // Exported documents always render on a light background: the dark theme's
  // translucent surfaces and light text don't reproduce well on paper/PDF.
  const root = document.documentElement
  const previousTheme = root.getAttribute('data-theme')
  root.setAttribute('data-theme', 'light')
  await waitForPaint()

  try {
    return await html2canvas(el, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    })
  } finally {
    if (previousTheme) root.setAttribute('data-theme', previousTheme)
    else root.removeAttribute('data-theme')
  }
}
