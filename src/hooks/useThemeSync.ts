import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean.length === 3 ? clean.replace(/(.)/g, '$1$1') : clean, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r}, ${g}, ${b}`
}

export function useThemeSync() {
  const theme = useAppStore((s) => s.settings.theme)
  const accentColor = useAppStore((s) => s.settings.accentColor)
  const backgroundImage = useAppStore((s) => s.settings.backgroundImage)
  const locale = useAppStore((s) => s.settings.locale)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor)
    document.documentElement.style.setProperty('--accent-rgb', hexToRgb(accentColor))
  }, [accentColor])

  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `linear-gradient(rgba(6,7,15,0.55), rgba(6,7,15,0.75)), url("${backgroundImage}")`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.classList.add('has-bg-image')
    } else {
      document.body.style.backgroundImage = ''
      document.body.classList.remove('has-bg-image')
    }
  }, [backgroundImage])

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale)
  }, [locale])
}
