import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', exact: true },
  { to: '/clientes', label: 'Clientes', icon: 'people' },
  { to: '/proveedores', label: 'Proveedores', icon: 'local_shipping' },
  { to: '/facturacion', label: 'Facturación', icon: 'receipt_long' },
  { to: '/compra-stock', label: 'Control de stock', icon: 'inventory_2' },
  { to: '/productos', label: 'Productos', icon: 'category' },
  { to: '/administracion-cuentas', label: 'Cuentas', icon: 'account_balance' },
]

export default function Sidebar({ collapsed, onToggle, onLogout, mobileOpen }) {
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onToggle} />}
      <aside
        className={[
          'sidebar',
          collapsed ? 'sidebar--collapsed' : '',
          mobileOpen ? 'sidebar--mobile-open' : '',
        ].join(' ')}
      >
        <div className="sidebar-header">
          {!collapsed && (
            <div className="sidebar-brand">
              <span className="sidebar-brand-title">Menú</span>
              <span className="sidebar-brand-subtitle">Sistema de Gestión</span>
            </div>
          )}
          <button
            className="sidebar-toggle"
            onClick={onToggle}
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <span className="material-symbols-outlined">
              {collapsed ? 'menu' : 'menu_open'}
            </span>
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="material-symbols-outlined sidebar-icon">
                {item.icon}
              </span>
              {!collapsed && (
                <span className="sidebar-label">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-link sidebar-logout"
            onClick={onLogout}
            title={collapsed ? 'Cerrar sesión' : undefined}
          >
            <span className="material-symbols-outlined sidebar-icon">logout</span>
            {!collapsed && <span className="sidebar-label">Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
