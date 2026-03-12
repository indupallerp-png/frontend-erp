import { apiFetch } from './client'

// stock_minimo → stockMinimo, tipo_carga → tipoCarga, etc. — conversión automática

export const getAll = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return apiFetch(`/productos${q ? `?${q}` : ''}`)
}

export const getOne = (id) => apiFetch(`/productos/${id}`)

export const create = (data) =>
  apiFetch('/productos', { method: 'POST', body: data })

export const update = (id, data) =>
  apiFetch(`/productos/${id}`, { method: 'PUT', body: data })

export const remove = (id) =>
  apiFetch(`/productos/${id}`, { method: 'DELETE' })

export const aumentar = (id, cantidad) =>
  apiFetch(`/stock/${id}/aumentar`, { method: 'PATCH', body: { cantidad } })

export const reducir = (id, cantidad) =>
  apiFetch(`/stock/${id}/reducir`, { method: 'PATCH', body: { cantidad } })
