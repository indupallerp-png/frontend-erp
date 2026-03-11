import { useState, useEffect } from 'react'
import * as api from '../api/compras'

export function useRemitosCompra() {
  const [remitos, setRemitos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getRemitosCompra()
      .then(data => setRemitos(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addRemito = async (data) => {
    // data = { proveedorId, proveedor, fecha, items: [{ productoId, producto, cantidad, precioUnitario }] }
    // El cliente API convierte camelCase → snake_case antes de enviar
    const result = await api.createRemitoCompra(data)
    // Recargar lista para obtener remito completo con items
    const updated = await api.getRemitosCompra()
    setRemitos(updated)
    return result
  }

  const deleteRemito = async (id) => {
    await api.deleteRemitoCompra(id)
    setRemitos(prev => prev.filter(r => r.id !== id))
  }

  return { remitos, loading, error, addRemito, deleteRemito }
}

export function useRemitosVenta() {
  const [remitos, setRemitos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getRemitosVenta()
      .then(data => setRemitos(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addRemito = async (data) => {
    // El backend valida el stock y lanza error si es insuficiente
    const result = await api.createRemitoVenta(data)
    const updated = await api.getRemitosVenta()
    setRemitos(updated)
    return result
  }

  const deleteRemito = async (id) => {
    await api.deleteRemitoVenta(id)
    setRemitos(prev => prev.filter(r => r.id !== id))
  }

  return { remitos, loading, error, addRemito, deleteRemito }
}
