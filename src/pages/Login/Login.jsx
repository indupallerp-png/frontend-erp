import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { sanitizeText } from '../../utils/formatters'
import logo from '../../public/logo_indupall.png'
import catemImg from '../../public/indupall_centro_de_tratamiento_de_embalajes_de_madera_CATEM.jpg'

// ─── Vista: Login ─────────────────────────────────────────────────────────────
function LoginView({ onRegister, onForgotPassword }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(username.trim(), password.trim())
    setLoading(false)
    if (result.ok) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <>
      <div className="login-header">
        <img src={logo} alt="Indupall" style={{ height: 72, objectFit: 'contain', marginBottom: 12 }} />
        <span className="login-title">Bienvenido</span>
        <span className="login-subtitle">Sistema de Gestión Integral</span>
      </div>

      {error && (
        <div className="login-error">
          <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }}>error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(sanitizeText(e.target.value))}
            placeholder="Ingrese su usuario"
            required
            autoFocus
            autoComplete="username"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
              autoComplete="current-password"
              maxLength={100}
              style={{ paddingRight: 42 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className="login-links">
        <button className="login-link-btn" onClick={onForgotPassword}>¿Olvidaste tu contraseña?</button>
        <button className="login-link-btn" onClick={onRegister}>Crear cuenta</button>
      </div>
    </>
  )
}

// ─── Vista: Registrar ─────────────────────────────────────────────────────────
function RegisterView({ onBack }) {
  const [form, setForm] = useState({ username: '', password: '', nombre: '', rol: 'user' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await register(form.username.trim(), form.password, form.nombre.trim(), form.rol)
    setLoading(false)
    if (result.ok) {
      setSuccess(true)
    } else {
      setError(result.error)
    }
  }

  if (success) {
    return (
      <>
        <div className="login-header">
          <img src={logo} alt="Indupall" style={{ height: 72, objectFit: 'contain', marginBottom: 12 }} />
          <span className="login-title">¡Cuenta creada!</span>
          <span className="login-subtitle">El usuario fue registrado exitosamente</span>
        </div>
        <button className="btn btn-primary w-100" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={onBack}>
          Ir al inicio de sesión
        </button>
      </>
    )
  }

  return (
    <>
      <div className="login-header">
        <img src={logo} alt="Indupall" style={{ height: 72, objectFit: 'contain', marginBottom: 12 }} />
        <span className="login-title">Crear cuenta</span>
        <span className="login-subtitle">Registrá un nuevo usuario</span>
      </div>

      {error && (
        <div className="login-error">
          <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }}>error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre completo</label>
          <input type="text" className="form-control" value={form.nombre} onChange={set('nombre')} placeholder="Juan Pérez" required maxLength={100} autoFocus />
        </div>

        <div className="form-group">
          <label className="form-label">Usuario</label>
          <input type="text" className="form-control" value={form.username} onChange={e => setForm(f => ({ ...f, username: sanitizeText(e.target.value) }))} placeholder="nombre_usuario" required maxLength={50} autoComplete="username" />
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={form.password}
              onChange={set('password')}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              maxLength={100}
              autoComplete="new-password"
              style={{ paddingRight: 42 }}
            />
            <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Rol</label>
          <select className="form-control" value={form.rol} onChange={set('rol')}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
            <option value="ventas">Ventas</option>
            <option value="deposito">Depósito</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>

      <div className="login-links">
        <button className="login-link-btn" onClick={onBack}>← Volver al inicio de sesión</button>
      </div>
    </>
  )
}

// ─── Vista: Olvidé mi contraseña (pendiente de API) ──────────────────────────
function ForgotPasswordView({ onBack }) {
  return (
    <>
      <div className="login-header">
        <img src={logo} alt="Indupall" style={{ height: 72, objectFit: 'contain', marginBottom: 12 }} />
        <span className="login-title">Recuperar contraseña</span>
        <span className="login-subtitle">Próximamente disponible</span>
      </div>
      <div className="login-links">
        <button className="login-link-btn" onClick={onBack}>← Volver al inicio de sesión</button>
      </div>
    </>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Login() {
  const [view, setView] = useState('login')

  return (
    <div className="login-page">
      <div className="login-image-panel">
        <img src={catemImg} alt="Centro de Tratamiento CATEM - Indupall" />
      </div>
      <div className="login-form-panel">
        <div className="login-card">
          {view === 'login'          && <LoginView onRegister={() => setView('register')} onForgotPassword={() => setView('forgotPassword')} />}
          {view === 'register'       && <RegisterView onBack={() => setView('login')} />}
          {view === 'forgotPassword' && <ForgotPasswordView onBack={() => setView('login')} />}
        </div>
      </div>
    </div>
  )
}
