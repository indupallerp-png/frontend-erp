import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function Header({ user, onMobileToggle, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const { changePassword } = useAuth()

  const initials = user?.nombre
    ? user.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  // Cerrar dropdown al clickear fuera
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openModal = () => {
    setDropdownOpen(false)
    setForm({ currentPassword: '', newPassword: '', confirm: '' })
    setError('')
    setSuccess(false)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setError('')
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.newPassword !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    const result = await changePassword(form.currentPassword, form.newPassword)
    setLoading(false)
    if (result.ok) {
      setSuccess(true)
    } else {
      setError(result.error)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <>
      <header className="app-header">
        <button
          className="header-mobile-toggle"
          onClick={onMobileToggle}
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <span className="header-title">ERP Indupall</span>

        <div className="header-user" ref={dropdownRef}>
          <span className="header-user-name">{user?.nombre || 'Usuario'}</span>
          <div
            className="header-avatar"
            title={user?.nombre}
            onClick={() => setDropdownOpen(o => !o)}
            style={{ cursor: 'pointer' }}
          >
            {initials}
          </div>

          {dropdownOpen && (
            <div className="header-dropdown">
              <button className="header-dropdown-item" onClick={openModal}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock_reset</span>
                Cambiar contraseña
              </button>
              <div className="header-dropdown-divider" />
              <button className="header-dropdown-item header-dropdown-item--danger" onClick={onLogout}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Cambiar contraseña</h2>
              <button className="modal-close" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-success)' }}>check_circle</span>
                <p style={{ marginTop: 12, fontWeight: 600 }}>¡Contraseña actualizada!</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={closeModal}>Cerrar</button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="login-error" style={{ marginBottom: 16 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }}>error</span>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Contraseña actual</label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="form-control"
                      value={form.currentPassword}
                      onChange={set('currentPassword')}
                      required
                      autoFocus
                      autoComplete="current-password"
                      maxLength={100}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nueva contraseña</label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="form-control"
                      value={form.newPassword}
                      onChange={set('newPassword')}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      maxLength={100}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirmar nueva contraseña</label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="form-control"
                      value={form.confirm}
                      onChange={set('confirm')}
                      required
                      autoComplete="new-password"
                      maxLength={100}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <input
                      type="checkbox"
                      id="show-pass"
                      checked={showPass}
                      onChange={e => setShowPass(e.target.checked)}
                    />
                    <label htmlFor="show-pass" style={{ fontSize: 13, color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                      Mostrar contraseñas
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
