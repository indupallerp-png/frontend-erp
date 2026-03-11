import { apiFetch } from './client'

// ─── Normalización ────────────────────────────────────────────────────────────

function normFactura(f) {
  return { ...f, cliente: f.clienteNombre ?? f.cliente }
}

function normRecibo(r) {
  return {
    ...r,
    cliente: r.clienteNombre ?? r.cliente,
    formaPago: r.formaPago ?? r.forma_pago,
  }
}

// ─── Facturas ────────────────────────────────────────────────────────────────

export const getFacturas = async (params = {}) => {
  const q = new URLSearchParams(params).toString()
  const data = await apiFetch(`/facturacion/facturas${q ? `?${q}` : ''}`)
  return Array.isArray(data) ? data.map(normFactura) : data
}

export const getFactura = async (id) => {
  const data = await apiFetch(`/facturacion/facturas/${id}`)
  return normFactura(data)
}

export const createFactura = (data) =>
  apiFetch('/facturacion/facturas', { method: 'POST', body: data })

export const updateFactura = (id, data) =>
  apiFetch(`/facturacion/facturas/${id}`, { method: 'PUT', body: data })

export const deleteFactura = (id) =>
  apiFetch(`/facturacion/facturas/${id}`, { method: 'DELETE' })

// ─── Recibos ─────────────────────────────────────────────────────────────────

export const getRecibos = async (params = {}) => {
  const q = new URLSearchParams(params).toString()
  const data = await apiFetch(`/facturacion/recibos${q ? `?${q}` : ''}`)
  return Array.isArray(data) ? data.map(normRecibo) : data
}

export const createRecibo = (data) =>
  apiFetch('/facturacion/recibos', { method: 'POST', body: data })

export const deleteRecibo = (id) =>
  apiFetch(`/facturacion/recibos/${id}`, { method: 'DELETE' })
