/** The Heist Syndicate — Finals roster hub defaults */
export const TEAM_NAME = 'THE HEIST SYNDICATE'
export const TEAM_TAG = 'THS'

export const COLORS = {
  accent: '#c9a227',
  accentDim: '#8a7020',
  bg: '#0a0a0c',
  surface: '#121218',
  border: '#2a2830',
  text: '#e8e4dc',
  muted: '#7a7688',
  success: '#3d9a6a',
  danger: '#c44a4a',
}

export const DEFAULT_PLAYERS = [
  { id: 'p1', handle: 'PHANTOM', name: 'Alex Reyes', role: 'IGL / Heavy' },
  { id: 'p2', handle: 'CIPHER', name: 'Jordan Lee', role: 'Medium / Flex' },
  { id: 'p3', handle: 'VORTEX', name: 'Sam Torres', role: 'Light / Entry' },
]

export const DEFAULT_MAPS = [
  { id: 'monaco', name: 'Monaco', imageUrl: '' },
  { id: 'seoul', name: 'Seoul', imageUrl: '' },
  { id: 'vegas', name: 'Las Vegas', imageUrl: '' },
  { id: 'kyoto', name: 'Kyoto', imageUrl: '' },
  { id: 'horizon', name: 'SYS$HORIZON', imageUrl: '' },
  { id: 'skyway', name: 'Skyway Stadium', imageUrl: '' },
]

export const DEFAULT_ROSTERS = {
  heavy: 'PHANTOM',
  medium: 'CIPHER',
  light: 'VORTEX',
}

export const NAV_SECTIONS = [
  { id: 'schedule', label: 'Schedule', icon: '◷' },
  {
    id: 'notes',
    label: 'Player Notes',
    icon: '▤',
    children: [
      { id: 'notes-p1', label: 'Player 1' },
      { id: 'notes-p2', label: 'Player 2' },
      { id: 'notes-p3', label: 'Player 3' },
      { id: 'notes-team', label: 'Team Notes' },
    ],
  },
  { id: 'scouting', label: 'Opponent Scouting', icon: '◎' },
  {
    id: 'maps',
    label: 'Map Strategy',
    icon: '▦',
    children: DEFAULT_MAPS.map((m) => ({
      id: `map-${m.id}`,
      label: m.name,
    })),
  },
  { id: 'comps', label: 'Team Comps', icon: '⚔' },
  { id: 'clips', label: 'Clips', icon: '▶' },
  { id: 'aim', label: 'Aim Training', icon: '⊕' },
  { id: 'briefing', label: 'Match Briefing', icon: '◈' },
  { id: 'vods', label: 'VOD Queue', icon: '▣' },
  { id: 'resources', label: 'Resources', icon: '⬡' },
]

export const OWNER_SECTION = { id: 'owner', label: 'Owner Dashboard', icon: '◆' }

export const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Seoul',
  'Asia/Tokyo',
]
