import { apiFetch } from './client'

export async function login(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { username, password },
  })
}

export async function register(username, password, nombre, rol) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: { username, password, nombre, rol },
  })
}

export async function changePassword(currentPassword, newPassword) {
  return apiFetch('/auth/change-password', {
    method: 'POST',
    body: { currentPassword, newPassword },
  })
}

export async function me() {
  return apiFetch('/auth/me')
}
