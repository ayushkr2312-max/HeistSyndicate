import { THUB_KEYS } from '../storage/keys.js'

const COOKIE_NAME = 'thub-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14

const TEAM_PASS = import.meta.env.VITE_TEAM_HUB_PASSWORD || ''
const OWNER_PASS = import.meta.env.VITE_TEAM_HUB_OWNER_PASSWORD || ''

function validAuth(auth) {
  return auth && (auth.role === 'team' || auth.role === 'owner')
}

export function readAuth() {
  try {
    const raw = localStorage.getItem(THUB_KEYS.auth)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (validAuth(parsed)) return parsed
    }
  } catch { /* empty */ }
  const cookie = getCookie(COOKIE_NAME)
  if (cookie === 'owner') return { role: 'owner', token: 'owner' }
  if (cookie === 'team') return { role: 'team', token: 'team' }
  return null
}

export function writeAuth(auth) {
  localStorage.setItem(THUB_KEYS.auth, JSON.stringify(auth))
  setCookie(COOKIE_NAME, auth.role === 'owner' ? 'owner' : 'team', COOKIE_MAX_AGE)
}

export function clearAuth() {
  localStorage.removeItem(THUB_KEYS.auth)
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}

export function verifyPassword(password) {
  if (!TEAM_PASS && !OWNER_PASS) {
    return password ? { role: 'team' } : null
  }
  if (OWNER_PASS && password === OWNER_PASS) {
    return { role: 'owner', token: 'owner' }
  }
  if (TEAM_PASS && password === TEAM_PASS) {
    return { role: 'team', token: 'team' }
  }
  return null
}

export function isOwner(auth) {
  return auth?.role === 'owner'
}

function setCookie(name, value, maxAge) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Strict`
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}
