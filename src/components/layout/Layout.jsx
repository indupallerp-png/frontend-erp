import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAuth } from '../../hooks/useAuth'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleToggle = () => {
    // On mobile: toggle mobileOpen; on desktop: toggle collapsed
    if (window.innerWidth <= 768) {
      setMobileOpen(prev => !prev)
    } else {
      setCollapsed(prev => !prev)
    }
  }

  const handleMobileToggle = () => {
    setMobileOpen(prev => !prev)
  }

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
      />
      <div className={`app-main ${collapsed ? 'app-main--collapsed' : ''}`}>
        <Header user={user} onMobileToggle={handleMobileToggle} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
