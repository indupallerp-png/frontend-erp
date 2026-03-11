import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import FormField from '../../components/forms/FormField'
import { useStock } from '../../hooks/useStock'
import { useNotify } from '../../components/ui/Notification'
import { formatCurrency, getEstadoBadge } from '../../utils/formatters'
import { CATEGORIAS_PRODUCTO } from '../../data/mockData'

const EMPTY_FORM = {
  sku: '',
  nombre: '',
  categoria: '',
  costo: '',
  precio: '',
  stock: '',
  stockMinimo: '',
  estado: 'activo',
}

function getStockBadge(producto) {
  if (producto.stock <= 0) return { variant: 'danger', label: 'Sin stock' }
  if (producto.stock <= producto.stockMinimo) return { variant: 'warning', label: 'Stock bajo' }
  return { variant: 'success', label: 'Normal' }
}

export default function Stock() {
  const { productos, addProducto, updateProducto } = useStock()
  const { addNotification } = useNotify()

  const [search, setSearch] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = productos.filter(p => {
    const q = search.toLowerCase()
    const matchSearch =
      p.nombre?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    const matchCategoria = !filterCategoria || p.categoria === filterCategoria
    return matchSearch && matchCategoria
  })

  const handleOpen = (producto = null) => {
    if (producto) {
      setEditingId(producto.id)
      setForm({
        sku: producto.sku || '',
        nombre: producto.nombre || '',
        categoria: producto.categoria || '',
        costo: producto.costo ?? '',
        precio: producto.precio ?? '',
        stock: producto.stock ?? '',
        stockMinimo: producto.stockMinimo ?? '',
        estado: producto.estado || 'activo',
      })
    } else {
      setEditingId(null)
      setForm(EMPTY_FORM)
    }
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) {
      addNotification('El nombre es obligatorio', 'error')
      return
    }

    try {
      if (editingId) {
        await updateProducto(editingId, form)
        addNotification('Producto actualizado correctamente', 'success')
      } else {
        await addProducto(form)
        addNotification('Producto creado correctamente', 'success')
      }
      handleClose()
    } catch (err) {
      addNotification(err.message || 'Error al guardar', 'error')
    }
  }

  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))]

  const columns = [
    { key: 'sku', label: 'SKU', render: row => <code style={{ fontSize: 12 }}>{row.sku}</code> },
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    {
      key: 'stock',
      label: 'Stock Actual',
      render: row => (
        <strong style={{ color: row.stock <= 0 ? 'var(--color-danger)' : row.stock <= row.stockMinimo ? '#856404' : 'inherit' }}>
          {row.stock}
        </strong>
      ),
    },
    { key: 'stockMinimo', label: 'Stock Mín.' },
    {
      key: 'stockStatus',
      label: 'Estado Stock',
      render: row => {
        const s = getStockBadge(row)
        return <Badge variant={s.variant}>{s.label}</Badge>
      },
    },
    { key: 'costo', label: 'Costo', render: row => formatCurrency(row.costo) },
    { key: 'precio', label: 'Precio Venta', render: row => formatCurrency(row.precio) },
    {
      key: 'estado',
      label: 'Estado',
      render: row => <Badge variant={getEstadoBadge(row.estado)}>{row.estado}</Badge>,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: row => (
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => handleOpen(row)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
          Editar
        </button>
      ),
    },
  ]

  const sinStockCount = productos.filter(p => p.stock <= 0 && p.estado === 'activo').length
  const stockBajoCount = productos.filter(p => p.stock > 0 && p.stock <= p.stockMinimo && p.estado === 'activo').length

  return (
    <div>
      {sinStockCount > 0 && (
        <div className="alert alert-danger">
          <span className="material-symbols-outlined">error</span>
          <strong>{sinStockCount} producto(s) sin stock</strong>
        </div>
      )}
      {stockBajoCount > 0 && (
        <div className="alert alert-warning">
          <span className="material-symbols-outlined">warning</span>
          <strong>{stockBajoCount} producto(s) con stock bajo el mínimo</strong>
        </div>
      )}

      <div className="d-flex justify-between align-center mb-3">
        <div className="search-bar" style={{ marginBottom: 0 }}>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="form-control"
            value={filterCategoria}
            onChange={e => setFilterCategoria(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpen()}>
          <span className="material-symbols-outlined">add</span>
          Nuevo Producto
        </button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="No se encontraron productos"
            emptyIcon="inventory_2"
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editingId ? 'Editar producto' : 'Nuevo producto'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row form-row-2">
            <FormField
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="Código único del producto"
            />
            <FormField
              label="Categoría"
              name="categoria"
              type="select"
              value={form.categoria}
              onChange={handleChange}
              options={CATEGORIAS_PRODUCTO}
            />
          </div>

          <FormField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre descriptivo del producto"
          />

          <div className="form-row form-row-2">
            <FormField
              label="Costo"
              name="costo"
              type="number"
              value={form.costo}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <FormField
              label="Precio de Venta"
              name="precio"
              type="number"
              value={form.precio}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-row form-row-3">
            <FormField
              label="Stock Actual"
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
            <FormField
              label="Stock Mínimo"
              name="stockMinimo"
              type="number"
              value={form.stockMinimo}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
            <FormField
              label="Estado"
              name="estado"
              type="select"
              value={form.estado}
              onChange={handleChange}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
            />
          </div>

          <div className="modal-footer" style={{ padding: 0, paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
