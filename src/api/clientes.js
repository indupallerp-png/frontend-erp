import { apiFetch } from './client'

// El backend devuelve snake_case → el cliente lo convierte a camelCase automáticamente
// razon_social → razonSocial, condicion_iva → condicionIva, etc.

export const getAll = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return apiFetch(`/clientes${q ? `?${q}` : ''}`)
}

export const getOne = (id) => apiFetch(`/clientes/${id}`)

export const create = (data) =>
  apiFetch('/clientes', { method: 'POST', body: data })

export const update = (id, data) =>
  apiFetch(`/clientes/${id}`, { method: 'PUT', body: data })

export const remove = (id) =>
  apiFetch(`/clientes/${id}`, { method: 'DELETE' })
