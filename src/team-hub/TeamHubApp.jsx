import { useCallback, useEffect, useState } from 'react'
import { COLORS } from './config.js'
import { isOwner } from './auth/auth.js'
import Sidebar from './components/Sidebar.jsx'
import { useFirestoreSync } from './hooks/useFirestoreSync.js'
import { THUB_KEYS } from './storage/keys.js'
import { useThubStorage } from './hooks/useThubStorage.js'
import ScheduleSection from './sections/ScheduleSection.jsx'
import PlayerNotesSection from './sections/PlayerNotesSection.jsx'
import ScoutingSection from './sections/ScoutingSection.jsx'
import MapStrategySection from './sections/MapStrategySection.jsx'
import TeamCompsSection from './sections/TeamCompsSection.jsx'
import ClipsSection from './sections/ClipsSection.jsx'
import AimTrainingSection from './sections/AimTrainingSection.jsx'
import BriefingSection from './sections/BriefingSection.jsx'
import VodsSection from './sections/VodsSection.jsx'
import ResourcesSection from './sections/ResourcesSection.jsx'
import OwnerDashboard from './sections/OwnerDashboard.jsx'

export default function TeamHubApp({ auth, onLock }) {
  const [active, setActive] = useState('schedule')
  const [settings, setSettings] = useThubStorage(THUB_KEYS.settings)

  const syncEnabled = Boolean(settings?.syncEnabled)
  const { status, remountKey, notifyLocalChange, pushNow, configured } =
    useFirestoreSync(syncEnabled)

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--hub-accent',
      settings?.accent || COLORS.accent,
    )
  }, [settings?.accent])

  const onLocalChange = useCallback(() => {
    notifyLocalChange()
  }, [notifyLocalChange])

  const toggleSync = () => {
    setSettings((s) => ({ ...s, syncEnabled: !s.syncEnabled }))
    onLocalChange()
  }

  const owner = isOwner(auth)

  const renderSection = () => {
    const common = { onChange: onLocalChange }
    if (active === 'owner' && owner) {
      return (
        <OwnerDashboard
          syncStatus={status}
          onPush={configured ? pushNow : null}
        />
      )
    }
    if (active.startsWith('notes')) {
      return <PlayerNotesSection subId={active} {...common} />
    }
    if (active.startsWith('map-')) {
      return <MapStrategySection subId={active} {...common} />
    }
    switch (active) {
      case 'schedule':
        return <ScheduleSection {...common} />
      case 'scouting':
        return <ScoutingSection {...common} />
      case 'comps':
        return <TeamCompsSection {...common} />
      case 'clips':
        return <ClipsSection {...common} />
      case 'aim':
        return <AimTrainingSection {...common} />
      case 'briefing':
        return <BriefingSection {...common} />
      case 'vods':
        return <VodsSection {...common} />
      case 'resources':
        return <ResourcesSection {...common} />
      default:
        return <ScheduleSection {...common} />
    }
  }

  return (
    <div className="hub-app">
      <Sidebar
        active={active}
        onNavigate={setActive}
        syncStatus={status}
        syncEnabled={syncEnabled}
        onToggleSync={configured ? toggleSync : null}
        onLock={onLock}
        isOwner={owner}
        settings={settings}
      />
      <main className="hub-main" key={remountKey}>
        {renderSection()}
      </main>
    </div>
  )
}
