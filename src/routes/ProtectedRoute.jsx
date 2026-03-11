import { Navigate } from 'react-router-dom'
import { storage } from '../utils/storage'

export default function ProtectedRoute({ children }) {
  const user = storage.get('session')
  if (!user) return <Navigate to="/login" replace />
  return children
}
