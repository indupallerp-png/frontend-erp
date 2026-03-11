import { useState, useEffect } from 'react'
import * as api from '../api/facturacion'

export function useFacturas() {
  const [facturas, setFacturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getFacturas()
      .then(data => setFacturas(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addFactura = async (data) => {
    const result = await api.createFactura(data)
    // Recargar la lista para obtener los datos completos con items y cliente
    const updated = await api.getFacturas()
    setFacturas(updated)
    return result
  }

  const updateFactura = async (id, data) => {
    const result = await api.updateFactura(id, data)
    setFacturas(prev => prev.map(f => (f.id === id ? { ...f, ...result } : f)))
    return result
  }

  const deleteFactura = async (id) => {
    await api.deleteFactura(id)
    setFacturas(prev => prev.filter(f => f.id !== id))
  }

  return { facturas, loading, error, addFactura, updateFactura, deleteFactura }
}

export function useRecibos() {
  const [recibos, setRecibos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getRecibos()
      .then(data => setRecibos(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addRecibo = async (data) => {
    const result = await api.createRecibo(data)
    const updated = await api.getRecibos()
    setRecibos(updated)
    return result
  }

  const deleteRecibo = async (id) => {
    await api.deleteRecibo(id)
    setRecibos(prev => prev.filter(r => r.id !== id))
  }

  return { recibos, loading, error, addRecibo, deleteRecibo }
}
