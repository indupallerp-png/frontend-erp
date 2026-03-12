import { useState } from 'react'

const ESTADO_BADGE = {
  activo:   { label: 'Activo',   cls: 'badge badge-success' },
  inactivo: { label: 'Inactivo', cls: 'badge badge-danger'  },
}

const EMPTY = { nombre: '', descripcion: '', precio: '', unidad: '', estado: 'activo' }

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | { mode: 'create'|'edit', data }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.descripcion || '').toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => setModal({ mode: 'create', data: { ...EMPTY } })
  const openEdit   = (p) => setModal({ mode: 'edit', data: { ...p } })
  const closeModal = () => { setModal(null); setError('') }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (modal.mode === 'create') {
        const nuevo = { ...modal.data, id: Date.now() }
        setProductos(ps => [...ps, nuevo])
      } else {
        setProductos(ps => ps.map(p => p.id === modal.data.id ? modal.data : p))
      }
      closeModal()
    } catch (err) {
      setError(err.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    setProductos(ps => ps.filter(p => p.id !== id))
  }

  const set = (field) => (e) =>
    setModal(m => ({ ...m, data: { ...m.data, [field]: e.target.value } }))

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">{productos.length} producto{productos.length !== 1 ? 's' : ''} registrado{productos.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <span className="material-symbols-outlined">add</span>
          Nuevo producto
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>
            Limpiar
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Unidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px 0' }}>
                  {search ? 'No se encontraron productos' : 'No hay productos registrados'}
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nombre}</strong></td>
                  <td>{p.descripcion || '—'}</td>
                  <td>{p.precio ? `$${parseFloat(p.precio).toLocaleString('es-AR')}` : '—'}</td>
                  <td>{p.unidad || '—'}</td>
                  <td><span className={ESTADO_BADGE[p.estado]?.cls}>{ESTADO_BADGE[p.estado]?.label}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modal.mode === 'create' ? 'Nuevo producto' : 'Editar producto'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {error && (
              <div className="login-error" style={{ margin: '0 0 16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="form-control" value={modal.data.nombre} onChange={set('nombre')} required maxLength={150} autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <input className="form-control" value={modal.data.descripcion} onChange={set('descripcion')} maxLength={300} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Precio</label>
                  <input className="form-control" type="number" min="0" step="0.01" value={modal.data.precio} onChange={set('precio')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Unidad</label>
                  <input className="form-control" value={modal.data.unidad} onChange={set('unidad')} placeholder="ej: unidad, kg, m²" maxLength={30} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-control" value={modal.data.estado} onChange={set('estado')}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
