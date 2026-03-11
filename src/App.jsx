import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider } from './components/ui/Notification'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </BrowserRouter>
  )
}
