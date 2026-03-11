import { useState } from 'react'
import * as authApi from '../api/auth'
import { setToken, removeToken, getToken } from '../api/client'
import { storage } from '../utils/storage'

export function useAuth() {
  const [user, setUser] = useState(() => storage.get('session'))

  const login = async (username, password) => {
    try {
      const data = await authApi.login(username, password)
      // data = { token, user: { id, username, nombre, rol } }
      setToken(data.token)
      storage.set('session', data.user)
      setUser(data.user)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Usuario o contraseña incorrectos' }
    }
  }

  const logout = () => {
    removeToken()
    storage.remove('session')
    setUser(null)
  }

  return { user, login, logout, isAuthenticated: !!user }
}
