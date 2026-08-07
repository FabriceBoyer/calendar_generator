import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { Toolbar } from '../components/Calendar/Toolbar'
import { MonthPage } from '../components/Calendar/MonthPage'
import { Modal } from '../components/Layout/Modal'
import { SettingsPanel } from '../components/Settings/SettingsPanel'
import { ExportMenu } from '../components/Export/ExportMenu'
import { GarminImport } from '../components/Garmin/GarminImport'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useFitCalendarSize } from '../hooks/useFitCalendarSize'
import { PAPER_RATIOS } from '../utils/paper'

export function HomePage() {
  const { t } = useTranslation()
  const settings = useAppStore((s) => s.settings)
  const activities = useAppStore((s) => s.activities)
  const entries = useAppStore((s) => s.entries)
  const currentMonth = useAppStore((s) => s.currentMonth)

  const [modal, setModal] = useState<'settings' | 'export' | 'garmin' | null>(null)

  const isDesktop = useMediaQuery('(min-width: 901px)')
  const ratio = PAPER_RATIOS[settings.paperSize]
  const { containerRef, size: fitSize } = useFitCalendarSize(ratio, isDesktop)

  return (
    <>
      <Toolbar
        onOpenSettings={() => setModal('settings')}
        onOpenExport={() => setModal('export')}
        onOpenGarmin={() => setModal('garmin')}
      />

      <div className="scroll-area print-area" ref={containerRef}>
        <MonthPage
          monthKey={currentMonth}
          settings={settings}
          activities={activities}
          entries={entries}
          interactive={settings.onlineMode}
          fitSize={fitSize}
        />
      </div>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={
          modal === 'settings' ? t('settings.title') : modal === 'garmin' ? t('garmin.title') : t('header.export')
        }
        wide={modal === 'settings'}
      >
        {modal === 'settings' && <SettingsPanel />}
        {modal === 'export' && <ExportMenu onClose={() => setModal(null)} />}
        {modal === 'garmin' && <GarminImport />}
      </Modal>
    </>
  )
}
