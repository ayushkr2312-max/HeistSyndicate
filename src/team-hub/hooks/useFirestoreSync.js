import { useCallback, useEffect, useRef, useState } from 'react'
import { ALL_DATA_KEYS, THUB_KEYS } from '../storage/keys.js'
import { DEFAULTS_BY_KEY } from '../storage/defaults.js'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

function isFirebaseConfigured() {
  return Boolean(firebaseConfig.projectId && firebaseConfig.apiKey)
}

let dbPromise = null

async function getDb() {
  if (!isFirebaseConfigured()) return null
  if (!dbPromise) {
    dbPromise = (async () => {
      const { initializeApp, getApps, getApp } = await import('firebase/app')
      const { getFirestore, doc, onSnapshot, setDoc } = await import('firebase/firestore')
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
      const firestore = getFirestore(app)
      return { firestore, doc, onSnapshot, setDoc }
    })()
  }
  return dbPromise
}

function collectPayload() {
  const payload = {}
  for (const key of ALL_DATA_KEYS) {
    try {
      const raw = localStorage.getItem(key)
      payload[key] = raw ? JSON.parse(raw) : DEFAULTS_BY_KEY[key]()
    } catch {
      payload[key] = DEFAULTS_BY_KEY[key]()
    }
  }
  payload.updatedAt = new Date().toISOString()
  return payload
}

function applyPayload(payload) {
  for (const key of ALL_DATA_KEYS) {
    if (payload[key] != null) {
      localStorage.setItem(key, JSON.stringify(payload[key]))
    }
  }
  const meta = JSON.parse(localStorage.getItem(THUB_KEYS.meta) || '{}')
  localStorage.setItem(
    THUB_KEYS.meta,
    JSON.stringify({
      ...meta,
      lastRemoteSync: payload.updatedAt || new Date().toISOString(),
    }),
  )
}

function initialSyncStatus() {
  if (!isFirebaseConfigured()) return 'unconfigured'
  return 'idle'
}

export function useFirestoreSync(syncEnabled) {
  const [status, setStatus] = useState(initialSyncStatus)
  const [remountKey, setRemountKey] = useState(0)
  const pushTimer = useRef(null)
  const skipPush = useRef(false)

  const push = useCallback(async () => {
    if (!syncEnabled) return
    const fb = await getDb()
    if (!fb) return
    setStatus('pushing')
    try {
      await fb.setDoc(fb.doc(fb.firestore, 'hub', 'main'), collectPayload(), { merge: true })
      setStatus('synced')
    } catch {
      setStatus('error')
    }
  }, [syncEnabled])

  const schedulePush = useCallback(() => {
    if (!syncEnabled || skipPush.current) return
    clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(() => push(), 1200)
  }, [syncEnabled, push])

  useEffect(() => {
    if (!syncEnabled) return undefined

    let cancelled = false
    let unsub = () => {}

    getDb().then((fb) => {
      if (cancelled || !fb) return
      setStatus('listening')
      unsub = fb.onSnapshot(
        fb.doc(fb.firestore, 'hub', 'main'),
        (snap) => {
          if (!snap.exists()) {
            setStatus('synced')
            return
          }
          skipPush.current = true
          applyPayload(snap.data())
          skipPush.current = false
          setRemountKey((k) => k + 1)
          setStatus('synced')
        },
        () => setStatus('error'),
      )
    })

    return () => {
      cancelled = true
      unsub()
    }
  }, [syncEnabled])

  useEffect(() => {
    if (!syncEnabled) return undefined
    const onStorage = (e) => {
      if (e.key?.startsWith('thub-') && e.key !== THUB_KEYS.auth) {
        schedulePush()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [syncEnabled, schedulePush])

  const notifyLocalChange = useCallback(() => {
    schedulePush()
  }, [schedulePush])

  return {
    status,
    remountKey,
    notifyLocalChange,
    pushNow: push,
    configured: isFirebaseConfigured(),
  }
}
