import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HubErrorBoundary from './team-hub/components/HubErrorBoundary.jsx'
import TeamHub from './team-hub/TeamHub.jsx'
import './team-hub/hub.css'

const root = document.getElementById('team-hub-root')
if (!root) {
  document.body.innerHTML =
    '<p style="color:#c9a227;font-family:monospace;padding:2rem">Team hub root missing.</p>'
} else {
  createRoot(root).render(
    <StrictMode>
      <HubErrorBoundary>
        <TeamHub />
      </HubErrorBoundary>
    </StrictMode>,
  )
}
