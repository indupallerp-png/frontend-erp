import { useState, useEffect } from 'react'
import * as api from '../api/stock'

export function useStock() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getAll()
      .then(data => setProductos(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addProducto = async (data) => {
    const result = await api.create(data)
    setProductos(prev => [...prev, result])
    return result
  }

  const updateProducto = async (id, data) => {
    const result = await api.update(id, data)
    setProductos(prev => prev.map(p => (p.id === id ? result : p)))
    return result
  }

  const deleteProducto = async (id) => {
    await api.remove(id)
    setProductos(prev => prev.map(p => (p.id === id ? { ...p, estado: 'inactivo' } : p)))
  }

  const aumentarStock = async (productoId, cantidad) => {
    const result = await api.aumentar(productoId, cantidad)
    setProductos(prev => prev.map(p => (p.id === productoId ? result : p)))
  }

  const reducirStock = async (productoId, cantidad) => {
    const result = await api.reducir(productoId, cantidad)
    setProductos(prev => prev.map(p => (p.id === productoId ? result : p)))
  }

  const getStockDisponible = (productoId) => {
    const p = productos.find(p => p.id === productoId)
    return p ? p.stock : 0
  }

  return {
    productos,
    loading,
    error,
    addProducto,
    updateProducto,
    deleteProducto,
    aumentarStock,
    reducirStock,
    getStockDisponible,
  }
}
