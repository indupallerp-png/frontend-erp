import { useState, useCallback } from 'react'

export function useNotification() {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3500)
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return { notifications, addNotification, removeNotification }
}
