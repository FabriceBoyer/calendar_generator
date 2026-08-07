import html2canvas from 'html2canvas'

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
}

// Faint on-screen border/text tints (tuned for a lit screen) read as almost
// invisible once rasterized into a PDF/DOCX image, so exports use stronger
// values for these variables while capturing.
const EXPORT_VAR_OVERRIDES: Record<string, string> = {
  '--border': '#94969e',
  '--text-2': '#55575f',
}

export async function captureCalendarPage(monthKey: string): Promise<HTMLCanvasElement> {
  const el = document.querySelector<HTMLElement>(`.calendar-page[data-month="${monthKey}"]`)
  if (!el) throw new Error(`Calendar page for month ${monthKey} not found`)

  // Exported documents always render on a light background: the dark theme's
  // translucent surfaces and light text don't reproduce well on paper/PDF.
  const root = document.documentElement
  const previousTheme = root.getAttribute('data-theme')
  const previousVars = Object.keys(EXPORT_VAR_OVERRIDES).map((key) => [key, root.style.getPropertyValue(key)] as const)

  root.setAttribute('data-theme', 'light')
  for (const [key, value] of Object.entries(EXPORT_VAR_OVERRIDES)) {
    root.style.setProperty(key, value)
  }
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
    for (const [key, value] of previousVars) {
      if (value) root.style.setProperty(key, value)
      else root.style.removeProperty(key)
    }
  }
}
