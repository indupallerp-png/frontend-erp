export default function Header({ user, onMobileToggle }) {
  const initials = user?.nombre
    ? user.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  return (
    <header className="app-header">
      <button
        className="header-mobile-toggle"
        onClick={onMobileToggle}
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <span className="header-title">ERP Indupall</span>

      <div className="header-user">
        <span className="header-user-name">{user?.nombre || 'Usuario'}</span>
        <div className="header-avatar" title={user?.nombre}>
          {initials}
        </div>
      </div>
    </header>
  )
}
