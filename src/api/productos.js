import { apiFetch } from './client'

export const getAll    = ()        => apiFetch('/productos')
export const getOne    = (id)      => apiFetch(`/productos/${id}`)
export const create    = (data)    => apiFetch('/productos', { method: 'POST', body: data })
export const update    = (id, data)=> apiFetch(`/productos/${id}`, { method: 'PUT', body: data })
export const remove    = (id)      => apiFetch(`/productos/${id}`, { method: 'DELETE' })
