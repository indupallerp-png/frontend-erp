import { useState, useEffect } from 'react'
import * as api from '../api/cuentas'

export function useCuentas() {
  const [cuentas, setCuentas] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = async () => {
    try {
      const [c, m] = await Promise.all([api.getCuentas(), api.getMovimientos()])
      setCuentas(c)
      setMovimientos(m)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const addCuenta = async (data) => {
    const result = await api.createCuenta(data)
    await fetchAll()
    return result
  }

  const updateCuenta = async (id, data) => {
    const result = await api.updateCuenta(id, data)
    await fetchAll()
    return result
  }

  const deleteCuenta = async (id) => {
    await api.deleteCuenta(id)
    setCuentas(prev => prev.map(c => (c.id === id ? { ...c, estado: 'inactiva' } : c)))
  }

  const addMovimiento = async (data) => {
    const result = await api.createMovimiento(data)
    await fetchAll()
    return result
  }

  const deleteMovimiento = async (id) => {
    await api.deleteMovimiento(id)
    // Recargar cuentas para reflejar el saldo actualizado
    const updated = await api.getCuentas()
    setCuentas(updated)
    setMovimientos(prev => prev.filter(m => m.id !== id))
  }

  return {
    cuentas,
    movimientos,
    loading,
    error,
    addCuenta,
    updateCuenta,
    deleteCuenta,
    addMovimiento,
    deleteMovimiento,
  }
}
