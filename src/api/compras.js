import { apiFetch } from './client'

// ─── Normalización de respuestas ─────────────────────────────────────────────
// El backend devuelve proveedor_nombre / cliente_nombre desde el JOIN.
// El frontend espera el campo "proveedor" / "cliente" para mostrar en la tabla.

function normCompra(r) {
  return { ...r, proveedor: r.proveedorNombre ?? r.proveedor }
}

function normVenta(r) {
  return { ...r, cliente: r.clienteNombre ?? r.cliente }
}

// ─── Remitos de Compra ────────────────────────────────────────────────────────

export const getRemitosCompra = async () => {
  const data = await apiFetch('/compras/remitos-compra')
  return Array.isArray(data) ? data.map(normCompra) : data
}

export const getRemitoCompra = async (id) => {
  const data = await apiFetch(`/compras/remitos-compra/${id}`)
  return normCompra(data)
}

export const createRemitoCompra = (data) =>
  apiFetch('/compras/remitos-compra', { method: 'POST', body: data })

export const deleteRemitoCompra = (id) =>
  apiFetch(`/compras/remitos-compra/${id}`, { method: 'DELETE' })

// ─── Remitos de Venta ─────────────────────────────────────────────────────────

export const getRemitosVenta = async () => {
  const data = await apiFetch('/compras/remitos-venta')
  return Array.isArray(data) ? data.map(normVenta) : data
}

export const getRemitoVenta = async (id) => {
  const data = await apiFetch(`/compras/remitos-venta/${id}`)
  return normVenta(data)
}

export const createRemitoVenta = (data) =>
  apiFetch('/compras/remitos-venta', { method: 'POST', body: data })

export const deleteRemitoVenta = (id) =>
  apiFetch(`/compras/remitos-venta/${id}`, { method: 'DELETE' })
