import { apiFetch } from './client'

export async function login(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { username, password },
  })
}

export async function me() {
  return apiFetch('/auth/me')
}
