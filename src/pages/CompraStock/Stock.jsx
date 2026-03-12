import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import FormField from '../../components/forms/FormField'
import { useStock } from '../../hooks/useStock'
import { useNotify } from '../../components/ui/Notification'
import { formatCurrency, getEstadoBadge } from '../../utils/formatters'
import { exportToExcel } from '../../utils/exportExcel'

function getStockBadge(producto) {
  if (producto.stock <= 0) return { variant: 'danger', label: 'Sin stock' }
  if (producto.stock <= producto.stockMinimo) return { variant: 'warning', label: 'Stock bajo' }
  return { variant: 'success', label: 'Normal' }
}

export default function Stock() {
  const { productos, aumentarStock, reducirStock } = useStock()
  const { addNotification } = useNotify()

  const [search, setSearch] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')
  const [adjustModal, setAdjustModal] = useState(null) // null | { producto }
  const [ajuste, setAjuste] = useState({ tipo: 'aumentar', cantidad: '' })

  const filtered = productos.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = p.nombre?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
    const matchCategoria = !filterCategoria || p.categoria === filterCategoria
    return matchSearch && matchCategoria
  })

  const handleOpenAdjust = (producto) => {
    setAdjustModal({ producto })
    setAjuste({ tipo: 'aumentar', cantidad: '' })
  }

  const handleCloseAdjust = () => {
    setAdjustModal(null)
    setAjuste({ tipo: 'aumentar', cantidad: '' })
  }

  const handleSubmitAjuste = async (e) => {
    e.preventDefault()
    const cant = Number(ajuste.cantidad)
    if (!cant || cant <= 0) {
      addNotification('Ingresá una cantidad válida', 'error')
      return
    }
    try {
      if (ajuste.tipo === 'aumentar') {
        await aumentarStock(adjustModal.producto.id, cant)
        addNotification(`Stock aumentado en ${cant} unidades`, 'success')
      } else {
        await reducirStock(adjustModal.producto.id, cant)
        addNotification(`Stock reducido en ${cant} unidades`, 'success')
      }
      handleCloseAdjust()
    } catch (err) {
      addNotification(err.message || 'Error al ajustar stock', 'error')
    }
  }

  const handleExport = () => {
    exportToExcel({
      filename: 'stock',
      title: 'Control de Stock',
      columns: [
        { label: 'SKU',           key: 'sku' },
        { label: 'Nombre',        key: 'nombre' },
        { label: 'Categoría',     key: 'categoria' },
        { label: 'Stock Actual',  key: 'stock' },
        { label: 'Stock Mínimo',  key: 'stockMinimo' },
        { label: 'Estado Stock',  key: 'id', format: r => getStockBadge(r).label },
        { label: 'Costo',         key: 'costo',  format: r => formatCurrency(r.costo) },
        { label: 'Precio Venta',  key: 'precio', format: r => formatCurrency(r.precio) },
        { label: 'Estado',        key: 'estado' },
      ],
      data: filtered,
    })
  }

  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))]

  const columns = [
    { key: 'sku',    label: 'SKU',    render: row => <code style={{ fontSize: 12 }}>{row.sku}</code> },
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
    { key: 'costo',  label: 'Costo',        render: row => formatCurrency(row.costo) },
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
        <button className="btn btn-sm btn-secondary" onClick={() => handleOpenAdjust(row)}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>tune</span>
          Ajustar
        </button>
      ),
    },
  ]

  const sinStockCount   = productos.filter(p => p.stock <= 0 && p.estado === 'activo').length
  const stockBajoCount  = productos.filter(p => p.stock > 0 && p.stock <= p.stockMinimo && p.estado === 'activo').length

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
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-secondary" onClick={handleExport}>
          <span className="material-symbols-outlined">download</span>
          Exportar Excel
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

      {/* Modal ajuste de stock */}
      <Modal
        isOpen={!!adjustModal}
        onClose={handleCloseAdjust}
        title={`Ajustar stock — ${adjustModal?.producto.nombre}`}
        size="sm"
      >
        <p className="text-muted" style={{ marginBottom: 16, fontSize: 13 }}>
          Stock actual: <strong>{adjustModal?.producto.stock}</strong> unidades
        </p>

        <form onSubmit={handleSubmitAjuste}>
          <FormField
            label="Operación"
            name="tipo"
            type="select"
            value={ajuste.tipo}
            onChange={e => setAjuste(a => ({ ...a, tipo: e.target.value }))}
            options={[
              { value: 'aumentar', label: 'Aumentar stock' },
              { value: 'reducir',  label: 'Reducir stock'  },
            ]}
          />
          <FormField
            label="Cantidad"
            name="cantidad"
            type="number"
            value={ajuste.cantidad}
            onChange={e => setAjuste(a => ({ ...a, cantidad: e.target.value }))}
            required
            min="1"
            placeholder="0"
          />

          <div className="modal-footer" style={{ padding: 0, paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseAdjust}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Confirmar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
