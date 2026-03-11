import { apiFetch } from './client'

// ─── Cuentas ─────────────────────────────────────────────────────────────────

export const getCuentas = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return apiFetch(`/cuentas${q ? `?${q}` : ''}`)
}

export const createCuenta = (data) =>
  apiFetch('/cuentas', { method: 'POST', body: data })

export const updateCuenta = (id, data) =>
  apiFetch(`/cuentas/${id}`, { method: 'PUT', body: data })

export const deleteCuenta = (id) =>
  apiFetch(`/cuentas/${id}`, { method: 'DELETE' })

export const resumen = () => apiFetch('/cuentas/resumen')

// ─── Movimientos ─────────────────────────────────────────────────────────────

export const getMovimientos = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return apiFetch(`/cuentas/movimientos/todos${q ? `?${q}` : ''}`)
}

export const createMovimiento = (data) =>
  apiFetch('/cuentas/movimientos', { method: 'POST', body: data })

export const deleteMovimiento = (id) =>
  apiFetch(`/cuentas/movimientos/${id}`, { method: 'DELETE' })
