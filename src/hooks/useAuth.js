import { useState } from 'react'
import { storage } from '../utils/storage'
import { setToken, removeToken } from '../api/client'
import * as authApi from '../api/auth'

export function useAuth() {
  const [user, setUser] = useState(() => storage.get('session'))

  const login = async (username, password) => {
    try {
      const data = await authApi.login(username, password)
      if (data.token) setToken(data.token)
      const userData = data.user ?? data
      storage.set('session', userData)
      setUser(userData)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Usuario o contraseña incorrectos' }
    }
  }

  const register = async (username, password, nombre, rol) => {
    try {
      await authApi.register(username, password, nombre, rol)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Error al registrar usuario' }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authApi.changePassword(currentPassword, newPassword)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Error al cambiar contraseña' }
    }
  }

  const logout = () => {
    removeToken()
    storage.remove('session')
    setUser(null)
  }

  return { user, login, logout, register, changePassword, isAuthenticated: !!user }
}
