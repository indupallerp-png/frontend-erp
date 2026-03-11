import { useState, useEffect } from 'react'
import * as api from '../api/clientes'

export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getAll()
      .then(data => setClientes(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addCliente = async (data) => {
    const result = await api.create(data)
    setClientes(prev => [...prev, result])
    return result
  }

  const updateCliente = async (id, data) => {
    const result = await api.update(id, data)
    setClientes(prev => prev.map(c => (c.id === id ? result : c)))
    return result
  }

  const deleteCliente = async (id) => {
    await api.remove(id)
    setClientes(prev => prev.map(c => (c.id === id ? { ...c, estado: 'inactivo' } : c)))
  }

  return { clientes, loading, error, addCliente, updateCliente, deleteCliente }
}
