import { createContext, useContext } from 'react'
import { useNotification } from '../../hooks/useNotification'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { notifications, addNotification, removeNotification } = useNotification()

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map(n => (
          <div key={n.id} className={`notification notification-${n.type}`}>
            <span className="material-symbols-outlined notification-icon">
              {n.type === 'success'
                ? 'check_circle'
                : n.type === 'error'
                ? 'error'
                : n.type === 'warning'
                ? 'warning'
                : 'info'}
            </span>
            <span className="notification-message">{n.message}</span>
            <button
              className="notification-close"
              onClick={() => removeNotification(n.id)}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotify() {
  const ctx = useContext(NotificationContext)
  if (!ctx) return { addNotification: () => {} }
  return ctx
}
