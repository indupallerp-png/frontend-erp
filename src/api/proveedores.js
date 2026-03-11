import { apiFetch } from './client'

export const getAll = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return apiFetch(`/proveedores${q ? `?${q}` : ''}`)
}

export const getOne = (id) => apiFetch(`/proveedores/${id}`)

export const create = (data) =>
  apiFetch('/proveedores', { method: 'POST', body: data })

export const update = (id, data) =>
  apiFetch(`/proveedores/${id}`, { method: 'PUT', body: data })

export const remove = (id) =>
  apiFetch(`/proveedores/${id}`, { method: 'DELETE' })
