import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'
import { downloadText, readFileAsText } from '../../utils/download'

export function ExportMenu({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const settings = useAppStore((s) => s.settings)
  const currentMonth = useAppStore((s) => s.currentMonth)
  const exportJson = useAppStore((s) => s.exportJson)
  const importJson = useAppStore((s) => s.importJson)
  const [busy, setBusy] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePrint = () => {
    onClose()
    setTimeout(() => window.print(), 150)
  }

  const handlePdf = async () => {
    setBusy('pdf')
    try {
      const { exportMonthToPdf } = await import('../../utils/pdfExport')
      await exportMonthToPdf(currentMonth, settings.paperSize, `calendrier-${currentMonth}.pdf`)
    } finally {
      setBusy(null)
    }
  }

  const handleDocx = async () => {
    setBusy('docx')
    try {
      const { exportMonthToDocx } = await import('../../utils/docxExport')
      await exportMonthToDocx(currentMonth, settings.paperSize, `calendrier-${currentMonth}.docx`)
    } finally {
      setBusy(null)
    }
  }

  const handleJsonExport = () => {
    downloadText(exportJson(), `calfit-data-${currentMonth}.json`)
  }

  const handleJsonImportClick = () => fileInputRef.current?.click()

  const handleJsonImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await readFileAsText(file)
    importJson(text)
    e.target.value = ''
  }

  return (
    <div className="export-menu">
      <button className="btn btn-primary export-row" onClick={handlePrint} type="button">
        🖨 {t('header.print')}
      </button>
      <button className="btn export-row" onClick={handlePdf} type="button" disabled={busy === 'pdf'}>
        📄 {busy === 'pdf' ? '…' : t('header.exportPdf')}
      </button>
      <button className="btn export-row" onClick={handleDocx} type="button" disabled={busy === 'docx'}>
        📝 {busy === 'docx' ? '…' : t('header.exportDocx')}
      </button>
      <hr className="menu-sep" />
      <button className="btn export-row" onClick={handleJsonExport} type="button">
        💾 {t('header.exportJson')}
      </button>
      <button className="btn export-row" onClick={handleJsonImportClick} type="button">
        📂 {t('header.importJson')}
      </button>
      <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleJsonImportFile} />
    </div>
  )
}
