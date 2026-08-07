import type { ActivityDef } from '../types'

export const defaultActivities: ActivityDef[] = [
  {
    id: 'walk',
    name: 'activities.walk',
    icon: '🚶',
    color: '#4ade80',
    builtin: true,
    fields: [
      { id: 'duration', label: 'fields.duration', type: 'duration', unit: 'min' },
      { id: 'distance', label: 'fields.distance', type: 'distance', unit: 'km' },
    ],
  },
  {
    id: 'swim',
    name: 'activities.swim',
    icon: '🏊',
    color: '#38bdf8',
    builtin: true,
    fields: [
      { id: 'duration', label: 'fields.duration', type: 'duration', unit: 'min' },
      { id: 'distance', label: 'fields.distance', type: 'distance', unit: 'm' },
    ],
  },
  {
    id: 'pilates',
    name: 'activities.pilates',
    icon: '🧘',
    color: '#c084fc',
    builtin: true,
    fields: [{ id: 'duration', label: 'fields.duration', type: 'duration', unit: 'min' }],
  },
  {
    id: 'bike',
    name: 'activities.bike',
    icon: '🚴',
    color: '#fb923c',
    builtin: true,
    fields: [
      { id: 'duration', label: 'fields.duration', type: 'duration', unit: 'min' },
      { id: 'distance', label: 'fields.distance', type: 'distance', unit: 'km' },
    ],
  },
  {
    id: 'plank',
    name: 'activities.plank',
    icon: '🏋️',
    color: '#f472b6',
    builtin: true,
    fields: [
      { id: 'duration', label: 'fields.duration', type: 'duration', unit: 'sec' },
      { id: 'sets', label: 'fields.sets', type: 'number', unit: '' },
    ],
  },
  {
    id: 'run',
    name: 'activities.run',
    icon: '🏃',
    color: '#f87171',
    builtin: true,
    fields: [
      { id: 'duration', label: 'fields.duration', type: 'duration', unit: 'min' },
      { id: 'distance', label: 'fields.distance', type: 'distance', unit: 'km' },
    ],
  },
]

export const ICON_CHOICES = [
  '🚶', '🏊', '🧘', '🚴', '🏋️', '🏃', '⛹️', '🤸', '🧗', '⛷️', '🏂', '🤾',
  '🥊', '🏓', '🎾', '⚽', '🏀', '🏐', '🧘‍♀️', '🚣', '🛼', '⛸️', '🤺', '🏹',
  '💪', '❤️', '⭐', '🔥', '💧', '🌙',
]

export const COLOR_CHOICES = [
  '#4ade80', '#38bdf8', '#c084fc', '#fb923c', '#f472b6', '#f87171',
  '#facc15', '#2dd4bf', '#a3e635', '#818cf8', '#fb7185', '#e879f9',
]
