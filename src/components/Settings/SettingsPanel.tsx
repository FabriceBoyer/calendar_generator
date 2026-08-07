import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'
import type { PaperSize } from '../../types'
import { COLOR_CHOICES } from '../../utils/defaultActivities'
import { ActivityEditor } from './ActivityEditor'

const PAPER_SIZES: PaperSize[] = ['A4', 'Letter', 'A3', 'Legal']

export function SettingsPanel() {
  const { t } = useTranslation()
  const settings = useAppStore((s) => s.settings)
  const setAccentColor = useAppStore((s) => s.setAccentColor)
  const setBackgroundImage = useAppStore((s) => s.setBackgroundImage)
  const setPaperSize = useAppStore((s) => s.setPaperSize)
  const setWeightRange = useAppStore((s) => s.setWeightRange)
  const setWeightUnit = useAppStore((s) => s.setWeightUnit)
  const setOnlineMode = useAppStore((s) => s.setOnlineMode)
  const setTheme = useAppStore((s) => s.setTheme)
  const resetAll = useAppStore((s) => s.resetAll)

  const handleReset = () => {
    if (window.confirm(t('settings.resetConfirm'))) resetAll()
  }

  return (
    <div className="settings-panel">
      <section className="settings-section">
        <h4>{t('settings.appearance')}</h4>
        <div className="settings-row">
          <label>{t('header.theme')}</label>
          <div className="segmented">
            <button className={settings.theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')} type="button">
              🌙 {t('settings.dark')}
            </button>
            <button className={settings.theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')} type="button">
              ☀️ {t('settings.light')}
            </button>
          </div>
        </div>

        <div className="settings-row">
          <label>{t('settings.accentColor')}</label>
          <div className="color-picker-row">
            <input type="color" value={settings.accentColor} onChange={(e) => setAccentColor(e.target.value)} />
            <div className="color-swatches">
              {COLOR_CHOICES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch${settings.accentColor === c ? ' active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setAccentColor(c)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="settings-row">
          <label>{t('settings.backgroundImage')}</label>
          <div className="bg-image-row">
            <input
              type="url"
              placeholder={t('settings.backgroundImagePlaceholder')}
              value={settings.backgroundImage ?? ''}
              onChange={(e) => setBackgroundImage(e.target.value || null)}
            />
            {settings.backgroundImage && (
              <button className="btn" type="button" onClick={() => setBackgroundImage(null)}>
                {t('settings.removeImage')}
              </button>
            )}
          </div>
        </div>

        <div className="settings-row">
          <label>{t('settings.paperSize')}</label>
          <select value={settings.paperSize} onChange={(e) => setPaperSize(e.target.value as PaperSize)}>
            {PAPER_SIZES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="settings-section">
        <h4>{t('settings.weightRange')}</h4>
        <div className="settings-row">
          <label>{t('settings.min')}</label>
          <input
            type="number"
            value={settings.weightRange.min}
            onChange={(e) => setWeightRange({ ...settings.weightRange, min: Number(e.target.value) })}
          />
          <label>{t('settings.max')}</label>
          <input
            type="number"
            value={settings.weightRange.max}
            onChange={(e) => setWeightRange({ ...settings.weightRange, max: Number(e.target.value) })}
          />
          <select value={settings.weightUnit} onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lb')}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </section>

      <section className="settings-section">
        <h4>{t('settings.onlineMode')}</h4>
        <div className="settings-row">
          <label className="switch-label">
            <input type="checkbox" checked={settings.onlineMode} onChange={(e) => setOnlineMode(e.target.checked)} />
            <span>{t('settings.onlineModeDesc')}</span>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h4>{t('settings.activities')}</h4>
        <ActivityEditor />
      </section>

      <section className="settings-section">
        <h4>{t('settings.dataSection')}</h4>
        <button className="btn" onClick={handleReset} type="button">
          ♻️ {t('settings.reset')}
        </button>
      </section>
    </div>
  )
}
