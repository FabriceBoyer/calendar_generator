import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store/useAppStore'
import type { ActivityDef, ActivityField, FieldType } from '../../types'
import { resolveLabel } from '../../i18n'
import { COLOR_CHOICES, ICON_CHOICES } from '../../utils/defaultActivities'

const FIELD_TYPES: FieldType[] = ['duration', 'distance', 'number', 'text']

function emptyDraft(): Omit<ActivityDef, 'id'> {
  return { name: '', icon: '🏃', color: COLOR_CHOICES[0], fields: [] }
}

export function ActivityEditor() {
  const { t } = useTranslation()
  const activities = useAppStore((s) => s.activities)
  const addActivity = useAppStore((s) => s.addActivity)
  const updateActivity = useAppStore((s) => s.updateActivity)
  const deleteActivity = useAppStore((s) => s.deleteActivity)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Omit<ActivityDef, 'id'> | null>(null)

  const startAdd = () => {
    setEditingId('new')
    setDraft(emptyDraft())
  }

  const startEdit = (activity: ActivityDef) => {
    setEditingId(activity.id)
    setDraft({ ...activity, name: resolveLabel(t, activity.name), fields: activity.fields.map((f) => ({ ...f })) })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(null)
  }

  const saveDraft = () => {
    if (!draft || !draft.name.trim()) return
    if (editingId === 'new') {
      addActivity(draft)
    } else if (editingId) {
      updateActivity(editingId, draft)
    }
    cancelEdit()
  }

  const addField = () => {
    if (!draft) return
    const field: ActivityField = { id: `f${Date.now()}`, label: '', type: 'number', unit: '' }
    setDraft({ ...draft, fields: [...draft.fields, field] })
  }

  const updateField = (idx: number, patch: Partial<ActivityField>) => {
    if (!draft) return
    const fields = draft.fields.map((f, i) => (i === idx ? { ...f, ...patch } : f))
    setDraft({ ...draft, fields })
  }

  const removeField = (idx: number) => {
    if (!draft) return
    setDraft({ ...draft, fields: draft.fields.filter((_, i) => i !== idx) })
  }

  return (
    <div className="activity-editor">
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-list-item" style={{ '--legend-color': activity.color } as React.CSSProperties}>
            <span className="activity-icon-badge">{activity.icon}</span>
            <span className="activity-name">{resolveLabel(t, activity.name)}</span>
            <span className="activity-field-count">
              {activity.fields.length} {t('settings.activityFields').toLowerCase()}
            </span>
            <button className="btn btn-icon" type="button" onClick={() => startEdit(activity)}>
              ✏️
            </button>
            <button className="btn btn-icon" type="button" onClick={() => deleteActivity(activity.id)}>
              🗑
            </button>
          </div>
        ))}
      </div>

      {!draft && (
        <button className="btn btn-primary" type="button" onClick={startAdd}>
          ➕ {t('settings.addActivity')}
        </button>
      )}

      {draft && (
        <div className="activity-draft-form glass">
          <div className="settings-row">
            <label>{t('settings.activityName')}</label>
            <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>

          <div className="settings-row">
            <label>{t('settings.activityColor')}</label>
            <div className="color-swatches">
              {COLOR_CHOICES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch${draft.color === c ? ' active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setDraft({ ...draft, color: c })}
                />
              ))}
            </div>
          </div>

          <div className="settings-row">
            <label>{t('settings.activityIcon')}</label>
            <div className="icon-grid">
              {ICON_CHOICES.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-choice${draft.icon === icon ? ' active' : ''}`}
                  onClick={() => setDraft({ ...draft, icon })}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-row column">
            <label>{t('settings.activityFields')}</label>
            {draft.fields.map((field, idx) => (
              <div className="field-editor-row" key={field.id}>
                <input
                  type="text"
                  placeholder={t('settings.fieldLabel')}
                  value={field.label}
                  onChange={(e) => updateField(idx, { label: e.target.value })}
                />
                <select value={field.type} onChange={(e) => updateField(idx, { type: e.target.value as FieldType })}>
                  {FIELD_TYPES.map((ft) => (
                    <option key={ft} value={ft}>
                      {t(`fieldTypes.${ft}`)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="unit-input"
                  placeholder={t('settings.fieldUnit')}
                  value={field.unit ?? ''}
                  onChange={(e) => updateField(idx, { unit: e.target.value })}
                />
                <button className="btn btn-icon" type="button" onClick={() => removeField(idx)}>
                  ✕
                </button>
              </div>
            ))}
            <button className="btn" type="button" onClick={addField}>
              ➕ {t('settings.addField')}
            </button>
          </div>

          <div className="settings-row form-actions">
            <button className="btn btn-primary" type="button" onClick={saveDraft}>
              {t('settings.save')}
            </button>
            <button className="btn" type="button" onClick={cancelEdit}>
              {t('settings.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
