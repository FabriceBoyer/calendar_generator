import { useTranslation } from 'react-i18next'

const GARMIN_CONNECT_URL = 'https://connect.garmin.com/modern/activities'

function StepBrowserActivities() {
  return (
    <svg viewBox="0 0 200 120" className="garmin-step-svg" role="img" aria-hidden="true">
      <rect x="1" y="1" width="198" height="118" rx="8" className="mock-window" />
      <rect x="1" y="1" width="198" height="18" rx="8" className="mock-titlebar" />
      <circle cx="10" cy="10" r="2.5" className="mock-dot" />
      <circle cx="18" cy="10" r="2.5" className="mock-dot" />
      <circle cx="26" cy="10" r="2.5" className="mock-dot" />
      <rect x="40" y="6" width="120" height="8" rx="4" className="mock-url" />
      <text x="100" y="12.5" textAnchor="middle" className="mock-url-text">
        connect.garmin.com
      </text>
      <rect x="8" y="26" width="46" height="86" rx="4" className="mock-sidebar" />
      <rect x="14" y="34" width="34" height="7" rx="2" className="mock-sidebar-item active" />
      <rect x="14" y="46" width="30" height="6" rx="2" className="mock-sidebar-item" />
      <rect x="14" y="57" width="26" height="6" rx="2" className="mock-sidebar-item" />
      <rect x="14" y="68" width="32" height="6" rx="2" className="mock-sidebar-item" />
      <rect x="60" y="30" width="132" height="14" rx="3" className="mock-row" />
      <rect x="60" y="50" width="132" height="14" rx="3" className="mock-row" />
      <rect x="60" y="70" width="132" height="14" rx="3" className="mock-row" />
      <rect x="60" y="90" width="132" height="14" rx="3" className="mock-row" />
    </svg>
  )
}

function StepDateFilter() {
  return (
    <svg viewBox="0 0 200 120" className="garmin-step-svg" role="img" aria-hidden="true">
      <rect x="1" y="1" width="198" height="118" rx="8" className="mock-window" />
      <rect x="20" y="14" width="160" height="20" rx="5" className="mock-datebar" />
      <text x="100" y="27.5" textAnchor="middle" className="mock-datebar-text">
        📅 3 derniers mois ▾
      </text>
      <g className="mock-calendar-pop">
        <rect x="55" y="40" width="90" height="66" rx="6" />
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={62 + col * 13}
              y={50 + row * 13}
              width="9"
              height="9"
              rx="2"
              className={row === 1 && col > 1 && col < 5 ? 'day-selected' : 'day-cell'}
            />
          )),
        )}
      </g>
    </svg>
  )
}

function StepExportCsv() {
  return (
    <svg viewBox="0 0 200 120" className="garmin-step-svg" role="img" aria-hidden="true">
      <rect x="1" y="1" width="198" height="118" rx="8" className="mock-window" />
      <rect x="60" y="30" width="132" height="14" rx="3" className="mock-row" />
      <rect x="60" y="50" width="132" height="14" rx="3" className="mock-row" />
      <rect x="8" y="26" width="46" height="86" rx="4" className="mock-sidebar" />
      <circle cx="170" cy="15" r="10" className="mock-export-btn" />
      <text x="170" y="18.5" textAnchor="middle" className="mock-export-icon">
        ⬇
      </text>
      <g className="mock-menu">
        <rect x="118" y="28" width="80" height="34" rx="5" />
        <rect x="124" y="34" width="60" height="8" rx="2" className="menu-item" />
        <rect x="124" y="46" width="60" height="8" rx="2" className="menu-item selected" />
      </g>
      <text x="154" y="52" textAnchor="middle" className="mock-menu-text">
        Exporter CSV
      </text>
    </svg>
  )
}

function StepImportHere() {
  return (
    <svg viewBox="0 0 200 120" className="garmin-step-svg" role="img" aria-hidden="true">
      <rect x="6" y="30" width="70" height="60" rx="6" className="mock-file" />
      <path d="M46 30 L62 30 L62 42 L46 42 Z" className="mock-file-fold" />
      <text x="41" y="66" textAnchor="middle" className="mock-file-text">
        CSV
      </text>
      <text x="41" y="98" textAnchor="middle" className="mock-file-label">
        Activities.csv
      </text>
      <path d="M84 60 L128 60" className="mock-arrow-line" markerEnd="url(#garmin-arrowhead)" />
      <rect x="134" y="34" width="60" height="52" rx="8" className="mock-app" />
      <text x="164" y="55" textAnchor="middle" className="mock-app-icon">
        ⌚
      </text>
      <text x="164" y="74" textAnchor="middle" className="mock-app-text">
        Import
      </text>
      <defs>
        <marker id="garmin-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="mock-arrow-head" />
        </marker>
      </defs>
    </svg>
  )
}

export function GarminExportGuide() {
  const { t } = useTranslation()
  const steps = [
    { Illustration: StepBrowserActivities, titleKey: 'step1Title', bodyKey: 'step1Body' },
    { Illustration: StepDateFilter, titleKey: 'step2Title', bodyKey: 'step2Body' },
    { Illustration: StepExportCsv, titleKey: 'step3Title', bodyKey: 'step3Body' },
    { Illustration: StepImportHere, titleKey: 'step4Title', bodyKey: 'step4Body' },
  ]

  return (
    <div className="garmin-guide">
      <p>{t('docs.sections.garmin.intro')}</p>
      <a href={GARMIN_CONNECT_URL} target="_blank" rel="noreferrer noopener" className="btn garmin-guide-link">
        🔗 {t('docs.sections.garmin.linkLabel')}
      </a>

      <div className="garmin-guide-steps">
        {steps.map(({ Illustration, titleKey, bodyKey }) => (
          <div key={titleKey} className="garmin-guide-step">
            <Illustration />
            <h4>{t(`docs.sections.garmin.${titleKey}`)}</h4>
            <p>{t(`docs.sections.garmin.${bodyKey}`)}</p>
          </div>
        ))}
      </div>

      <p className="garmin-guide-disclaimer">{t('docs.sections.garmin.disclaimer')}</p>
    </div>
  )
}
