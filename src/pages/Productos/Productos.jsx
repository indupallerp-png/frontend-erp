import { useState, useEffect } from 'react'
import * as api from '../../api/productos'
import Modal from '../../components/ui/Modal'
import FormField from '../../components/forms/FormField'
import Badge from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatters'
import { exportToExcel } from '../../utils/exportExcel'

const EMPTY = {
  nombre: '',
  sku: '',
  categoria: '',
  costo: '',
  precio: '',
  stock: '',
  stockMinimo: '',
  estado: 'activo',
  tipoCarga: '',
  uso: '',
  tipoMadera: '',
  dimensiones: '',
  entrada: '',
}

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | { mode: 'create'|'edit', data }
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getAll()
      .then(setProductos)
      .catch(err => setError(err.message))
      .finally(() => setFetching(false))
  }, [])

  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.categoria || '').toLowerCase().includes(search.toLowerCase())
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
        const nuevo = await api.create(modal.data)
        setProductos(ps => [...ps, nuevo])
      } else {
        const actualizado = await api.update(modal.data.id, modal.data)
        setProductos(ps => ps.map(p => p.id === modal.data.id ? actualizado : p))
      }
      closeModal()
    } catch (err) {
      setError(err.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await api.remove(id)
      setProductos(ps => ps.filter(p => p.id !== id))
    } catch (err) {
      alert(err.message || 'Error al eliminar')
    }
  }

  const set = (field) => (e) =>
    setModal(m => ({ ...m, data: { ...m.data, [field]: e.target.value } }))

  const handleExport = () => {
    exportToExcel({
      filename: 'productos',
      title: 'Productos',
      columns: [
        { label: 'Nombre',        key: 'nombre' },
        { label: 'SKU',           key: 'sku' },
        { label: 'Categoría',     key: 'categoria' },
        { label: 'Costo',         key: 'costo',  format: r => formatCurrency(r.costo) },
        { label: 'Precio',        key: 'precio', format: r => formatCurrency(r.precio) },
        { label: 'Stock',         key: 'stock' },
        { label: 'Stock Mínimo',  key: 'stockMinimo' },
        { label: 'Estado',        key: 'estado' },
        { label: 'Tipo Madera',   key: 'tipoMadera' },
        { label: 'Dimensiones',   key: 'dimensiones' },
        { label: 'Entrada',       key: 'entrada' },
        { label: 'Tipo Carga',    key: 'tipoCarga' },
        { label: 'Uso',           key: 'uso' },
      ],
      data: filtered,
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">
            {productos.length} producto{productos.length !== 1 ? 's' : ''} registrado{productos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <span className="material-symbols-outlined">download</span>
            Exportar Excel
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            <span className="material-symbols-outlined">add</span>
            Nuevo producto
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Buscar por nombre, SKU o categoría..."
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
        {fetching ? (
          <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>Cargando...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Costo</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px 0' }}>
                    {search ? 'No se encontraron productos' : 'No hay productos registrados'}
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.nombre}</strong></td>
                    <td><code style={{ fontSize: 12 }}>{p.sku || '—'}</code></td>
                    <td>{p.categoria || '—'}</td>
                    <td>{p.costo != null && p.costo !== '' ? formatCurrency(p.costo) : '—'}</td>
                    <td>{p.precio != null && p.precio !== '' ? formatCurrency(p.precio) : '—'}</td>
                    <td>
                      <span className={
                        p.stock === 0 ? 'saldo-negativo' :
                        p.stock <= (p.stockMinimo || 0) ? 'text-warning' :
                        'saldo-positivo'
                      }>
                        {p.stock ?? '—'}
                      </span>
                    </td>
                    <td>
                      <Badge variant={p.estado === 'activo' ? 'success' : 'danger'}>
                        {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
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
        )}
      </div>

      <Modal
        isOpen={!!modal}
        onClose={closeModal}
        title={modal?.mode === 'create' ? 'Nuevo producto' : 'Editar producto'}
        size="lg"
      >
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 16 }}>
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Identificación */}
          <div className="form-row form-row-2">
            <FormField
              label="Nombre"
              name="nombre"
              value={modal?.data.nombre ?? ''}
              onChange={set('nombre')}
              required
              placeholder="Nombre del producto"
            />
            <FormField
              label="SKU"
              name="sku"
              value={modal?.data.sku ?? ''}
              onChange={set('sku')}
              placeholder="ej: PAL-TIR-FRE"
            />
          </div>

          <div className="form-row form-row-2">
            <FormField
              label="Categoría"
              name="categoria"
              value={modal?.data.categoria ?? ''}
              onChange={set('categoria')}
              placeholder="ej: Tirantes Fresados"
            />
            <FormField
              label="Estado"
              name="estado"
              type="select"
              value={modal?.data.estado ?? 'activo'}
              onChange={set('estado')}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
            />
          </div>

          {/* Precios y stock */}
          <div className="form-row form-row-2">
            <FormField
              label="Costo"
              name="costo"
              type="number"
              value={modal?.data.costo ?? ''}
              onChange={set('costo')}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <FormField
              label="Precio de venta"
              name="precio"
              type="number"
              value={modal?.data.precio ?? ''}
              onChange={set('precio')}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-row form-row-2">
            <FormField
              label="Stock actual"
              name="stock"
              type="number"
              value={modal?.data.stock ?? ''}
              onChange={set('stock')}
              min="0"
              placeholder="0"
            />
            <FormField
              label="Stock mínimo"
              name="stockMinimo"
              type="number"
              value={modal?.data.stockMinimo ?? ''}
              onChange={set('stockMinimo')}
              min="0"
              placeholder="0"
            />
          </div>

          {/* Características técnicas */}
          <div className="form-row form-row-2">
            <FormField
              label="Tipo de madera"
              name="tipoMadera"
              value={modal?.data.tipoMadera ?? ''}
              onChange={set('tipoMadera')}
              placeholder="ej: Pino eliotis / Eucaliptus Saligna"
            />
            <FormField
              label="Dimensiones"
              name="dimensiones"
              value={modal?.data.dimensiones ?? ''}
              onChange={set('dimensiones')}
              placeholder="ej: 1000 x 1200"
            />
          </div>

          <div className="form-row form-row-2">
            <FormField
              label="Entrada"
              name="entrada"
              value={modal?.data.entrada ?? ''}
              onChange={set('entrada')}
              placeholder="ej: 4 lados"
            />
            <FormField
              label="Tipo de carga"
              name="tipoCarga"
              value={modal?.data.tipoCarga ?? ''}
              onChange={set('tipoCarga')}
              placeholder="ej: bolsas, big bag, cajas"
            />
          </div>

          <FormField
            label="Uso"
            name="uso"
            value={modal?.data.uso ?? ''}
            onChange={set('uso')}
            placeholder="ej: rack, estanco"
          />

          <div className="modal-footer" style={{ padding: 0, paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : modal?.mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
