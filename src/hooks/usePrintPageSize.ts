import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { PAPER_CSS_SIZE } from '../utils/paper'

export function usePrintPageSize() {
  const paperSize = useAppStore((s) => s.settings.paperSize)

  useEffect(() => {
    let styleEl = document.getElementById('print-page-size') as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'print-page-size'
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = `@page { size: ${PAPER_CSS_SIZE[paperSize]} landscape; margin: 8mm; }`
  }, [paperSize])
}
