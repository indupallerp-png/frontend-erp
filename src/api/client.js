// ─── Conversión de claves camelCase ↔ snake_case ────────────────────────────

function toSnakeStr(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

function toCamelStr(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function convertKeys(obj, converter) {
  if (Array.isArray(obj)) return obj.map(item => convertKeys(item, converter))
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [converter(k), convertKeys(v, converter)])
    )
  }
  return obj
}

export const toSnakeCase = obj => convertKeys(obj, toSnakeStr)
export const toCamelCase = obj => convertKeys(obj, toCamelStr)

// ─── Token JWT ───────────────────────────────────────────────────────────────

const TOKEN_KEY = 'erp_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// ─── Fetch centralizado ──────────────────────────────────────────────────────

const BASE = '/api'

export async function apiFetch(path, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const config = { ...options, headers }

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(toSnakeCase(options.body))
  }

  const response = await fetch(`${BASE}${path}`, config)

  if (response.status === 401) {
    removeToken()
    window.location.href = '/login'
    throw new Error('Sesión expirada. Por favor volvé a ingresar.')
  }

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.message || `Error ${response.status}`)
  }

  return toCamelCase(json.data ?? json)
}
