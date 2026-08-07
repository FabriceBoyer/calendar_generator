import { useTranslation } from 'react-i18next'
import { GarminExportGuide } from '../components/Docs/GarminExportGuide'

const SECTION_KEYS = ['overview', 'activities', 'weight', 'persistence', 'online', 'export', 'garmin', 'paper']

export function DocsPage() {
  const { t } = useTranslation()

  return (
    <div className="scroll-area">
      <div className="docs-page glass">
        <h2>{t('docs.title')}</h2>
        <p className="docs-intro">{t('docs.intro')}</p>
        {SECTION_KEYS.map((key) => (
          <section key={key} className="docs-section">
            <h3>{t(`docs.sections.${key}.title`)}</h3>
            {key === 'garmin' ? <GarminExportGuide /> : <p>{t(`docs.sections.${key}.body`)}</p>}
          </section>
        ))}
      </div>
    </div>
  )
}
