import {
  DEFAULT_MAPS,
  DEFAULT_PLAYERS,
  DEFAULT_ROSTERS,
  TEAM_NAME,
} from '../config.js'
import { THUB_KEYS } from './keys.js'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function defaultSchedule() {
  return {
    timezone: 'UTC',
    weekStart: getMonday(new Date()).toISOString(),
    events: [
      {
        id: uid(),
        title: 'Scrim block',
        day: 2,
        hour: 18,
        minute: 0,
        type: 'scrim',
        notes: 'Review Monaco setups',
      },
      {
        id: uid(),
        title: 'VOD review',
        day: 4,
        hour: 20,
        minute: 0,
        type: 'vod',
        notes: '',
      },
    ],
  }
}

export function defaultNotes() {
  return {
    players: DEFAULT_PLAYERS.map((p) => ({
      id: p.id,
      handle: p.handle,
      name: p.name,
      notes: [],
    })),
    teamNotes: [],
  }
}

export function defaultScouting() {
  return {
    teams: [
      {
        id: uid(),
        name: 'Shadow Force',
        collapsed: false,
        traits: 'Aggressive vault contest · prefers Medium anchor',
        players: ['SF_Ace', 'SF_Bolt', 'SF_Ghost'],
        results: [],
      },
    ],
    playerSearch: '',
  }
}

export function defaultMaps() {
  return {
    maps: DEFAULT_MAPS.map((m) => ({
      ...m,
      macro: '',
      rollouts: '',
      points: '',
      clips: [],
    })),
  }
}

export function defaultComps() {
  return {
    slots: { ...DEFAULT_ROSTERS },
    presets: [
      {
        id: uid(),
        name: 'Standard Finals',
        heavy: 'PHANTOM',
        medium: 'CIPHER',
        light: 'VORTEX',
        notes: 'Default tournament spread',
      },
    ],
    notes: '',
  }
}

export function defaultClips() {
  return {
    filter: 'all',
    clips: [
      {
        id: uid(),
        title: 'Monaco vault timing',
        url: 'https://www.twitch.tv/',
        tags: ['macro', 'monaco'],
        player: 'PHANTOM',
      },
    ],
  }
}

export function defaultAim() {
  return {
    players: DEFAULT_PLAYERS.map((p) => ({
      id: p.id,
      handle: p.handle,
      scenarios: [
        { id: uid(), name: '1wall6targets TE', target: '95k', best: '' },
        { id: uid(), name: 'Pasu Small Arms', target: '85%', best: '' },
      ],
      log: [],
    })),
  }
}

export function defaultBriefing() {
  return {
    nextMatch: '',
    opponent: '',
    mapPool: '',
    priorities: [],
    checklist: [
      { id: uid(), text: 'Review opponent scouting', done: false },
      { id: uid(), text: 'Confirm comp slots', done: false },
      { id: uid(), text: 'Warm-up Kovaaks (15m)', done: false },
      { id: uid(), text: 'Comms check + OBS', done: false },
    ],
    standupNotes: [],
  }
}

export function defaultVods() {
  return { queue: [] }
}

export function defaultResources() {
  return {
    links: [
      { id: uid(), label: 'FINALS Esports Rulebook', url: 'https://www.reachthefinals.com/' },
      { id: uid(), label: 'THS Brand Assets', url: '#' },
      { id: uid(), label: 'Team Discord', url: '#' },
    ],
  }
}

export function defaultSettings() {
  return {
    teamName: TEAM_NAME,
    accent: '#c9a227',
    syncEnabled: false,
  }
}

export function defaultMeta() {
  return { lastLocalSave: null, lastRemoteSync: null, version: 1 }
}

export const DEFAULTS_BY_KEY = {
  [THUB_KEYS.schedule]: defaultSchedule,
  [THUB_KEYS.notes]: defaultNotes,
  [THUB_KEYS.scouting]: defaultScouting,
  [THUB_KEYS.maps]: defaultMaps,
  [THUB_KEYS.comps]: defaultComps,
  [THUB_KEYS.clips]: defaultClips,
  [THUB_KEYS.aim]: defaultAim,
  [THUB_KEYS.briefing]: defaultBriefing,
  [THUB_KEYS.vods]: defaultVods,
  [THUB_KEYS.resources]: defaultResources,
  [THUB_KEYS.settings]: defaultSettings,
  [THUB_KEYS.meta]: defaultMeta,
}

function getMonday(d) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export function loadAllFromStorage() {
  const out = {}
  for (const key of Object.keys(DEFAULTS_BY_KEY)) {
    try {
      const raw = localStorage.getItem(key)
      out[key] = raw ? JSON.parse(raw) : DEFAULTS_BY_KEY[key]()
    } catch {
      out[key] = DEFAULTS_BY_KEY[key]()
    }
  }
  return out
}

export function saveKey(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
  const meta = JSON.parse(localStorage.getItem(THUB_KEYS.meta) || '{}')
  localStorage.setItem(
    THUB_KEYS.meta,
    JSON.stringify({
      ...defaultMeta(),
      ...meta,
      lastLocalSave: new Date().toISOString(),
    }),
  )
}
