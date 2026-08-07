import { useEffect, useRef, useState } from 'react'

export interface FitSize {
  width: number
  height: number
}

/**
 * Measures a container and computes the largest box of the given aspect
 * ratio that fits entirely within it (like `object-fit: contain`, which
 * only applies to replaced elements natively). Returns null while disabled
 * so callers can fall back to normal CSS sizing (e.g. on mobile).
 */
export function useFitCalendarSize(ratio: number, enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<FitSize | null>(null)

  useEffect(() => {
    if (!enabled) {
      setSize(null)
      return
    }
    const container = containerRef.current
    if (!container) return

    const compute = () => {
      const cs = getComputedStyle(container)
      const availW = container.clientWidth - Number.parseFloat(cs.paddingLeft) - Number.parseFloat(cs.paddingRight)
      const availH = container.clientHeight - Number.parseFloat(cs.paddingTop) - Number.parseFloat(cs.paddingBottom)
      if (availW <= 0 || availH <= 0) return
      let width = availW
      let height = width / ratio
      if (height > availH) {
        height = availH
        width = height * ratio
      }
      setSize({ width: Math.floor(width), height: Math.floor(height) })
    }

    compute()
    const observer = new ResizeObserver(compute)
    observer.observe(container)
    return () => observer.disconnect()
  }, [ratio, enabled])

  return { containerRef, size }
}
