import { useState, useEffect } from 'react'
import * as api from '../api/proveedores'

export function useProveedores() {
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getAll()
      .then(data => setProveedores(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addProveedor = async (data) => {
    const result = await api.create(data)
    setProveedores(prev => [...prev, result])
    return result
  }

  const updateProveedor = async (id, data) => {
    const result = await api.update(id, data)
    setProveedores(prev => prev.map(p => (p.id === id ? result : p)))
    return result
  }

  const deleteProveedor = async (id) => {
    await api.remove(id)
    setProveedores(prev => prev.map(p => (p.id === id ? { ...p, estado: 'inactivo' } : p)))
  }

  return { proveedores, loading, error, addProveedor, updateProveedor, deleteProveedor }
}
