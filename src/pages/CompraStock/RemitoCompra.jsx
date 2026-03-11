import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import FormField from '../../components/forms/FormField'
import { useRemitosCompra } from '../../hooks/useRemitos'
import { useProveedores } from '../../hooks/useProveedores'
import { useStock } from '../../hooks/useStock'
import { useNotify } from '../../components/ui/Notification'
import { formatCurrency, formatDate, getEstadoBadge, todayString } from '../../utils/formatters'

const EMPTY_FORM = {
  proveedorId: '',
  proveedor: '',
  fecha: todayString(),
}

const EMPTY_ITEM = { productoId: '', producto: '', cantidad: 1, precioUnitario: 0 }

export default function RemitoCompra() {
  const { remitos, addRemito } = useRemitosCompra()
  const { proveedores } = useProveedores()
  const { productos } = useStock()
  const { addNotification } = useNotify()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [items, setItems] = useState([{ ...EMPTY_ITEM }])

  const proveedoresActivos = proveedores.filter(p => p.estado === 'activo')
  const productosActivos = productos.filter(p => p.estado === 'activo')

  const handleOpen = () => {
    setForm({ ...EMPTY_FORM, fecha: todayString() })
    setItems([{ ...EMPTY_ITEM }])
    setModalOpen(true)
  }

  const handleClose = () => setModalOpen(false)

  const handleFormChange = (e) => {
    const { name, value } = e.target
    if (name === 'proveedorId') {
      const prov = proveedoresActivos.find(p => p.id === Number(value))
      setForm(prev => ({
        ...prev,
        proveedorId: Number(value),
        proveedor: prov?.razonSocial || '',
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev]
      if (field === 'productoId') {
        const producto = productosActivos.find(p => p.id === Number(value))
        updated[index] = {
          ...updated[index],
          productoId: Number(value),
          producto: producto?.nombre || '',
          precioUnitario: producto?.costo || 0,
        }
      } else if (field === 'cantidad') {
        updated[index] = { ...updated[index], cantidad: Number(value) }
      } else if (field === 'precioUnitario') {
        updated[index] = { ...updated[index], precioUnitario: Number(value) }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      return updated
    })
  }

  const addItem = () => setItems(prev => [...prev, { ...EMPTY_ITEM }])
  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index))

  const total = items.reduce((sum, i) => sum + (Number(i.cantidad) * Number(i.precioUnitario)), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.proveedorId) {
      addNotification('Seleccione un proveedor', 'error')
      return
    }
    const validItems = items.filter(i => i.productoId && i.cantidad > 0)
    if (validItems.length === 0) {
      addNotification('Agregue al menos un ítem', 'error')
      return
    }

    try {
      await addRemito({ ...form, items: validItems })
      addNotification('Remito de compra creado y stock actualizado', 'success')
      handleClose()
    } catch (err) {
      addNotification(err.message || 'Error al crear remito', 'error')
    }
  }

  const columns = [
    { key: 'numero', label: 'Número' },
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'fecha', label: 'Fecha', render: row => formatDate(row.fecha) },
    { key: 'total', label: 'Total', render: row => formatCurrency(row.total) },
    {
      key: 'estado',
      label: 'Estado',
      render: row => <Badge variant={getEstadoBadge(row.estado)}>{row.estado}</Badge>,
    },
    {
      key: 'items',
      label: 'Ítems',
      render: row => <span className="text-muted">{row.items?.length || 0} productos</span>,
    },
  ]

  return (
    <div>
      <div className="d-flex justify-between align-center mb-3">
        <span className="text-muted">{remitos.length} remitos registrados</span>
        <button className="btn btn-primary" onClick={handleOpen}>
          <span className="material-symbols-outlined">add</span>
          Nuevo Remito de Compra
        </button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={[...remitos].reverse()}
            emptyMessage="No hay remitos de compra"
            emptyIcon="local_shipping"
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Nuevo Remito de Compra"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row form-row-2">
            <FormField
              label="Proveedor"
              name="proveedorId"
              type="select"
              value={form.proveedorId}
              onChange={handleFormChange}
              required
              options={proveedoresActivos.map(p => ({ value: p.id, label: p.razonSocial }))}
            />
            <FormField
              label="Fecha"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="items-section">
            <div className="items-section-title">Productos recibidos</div>
            {items.map((item, index) => (
              <div key={index} className="item-row item-row-compra">
                <div>
                  <label className="form-label">Producto</label>
                  <select
                    className="form-control"
                    value={item.productoId}
                    onChange={e => handleItemChange(index, 'productoId', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {productosActivos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} (Stock actual: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.cantidad}
                    onChange={e => handleItemChange(index, 'cantidad', e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Precio Unit.</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.precioUnitario}
                    onChange={e => handleItemChange(index, 'precioUnitario', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="form-label">Subtotal</label>
                  <div className="form-control" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
                    {formatCurrency(Number(item.cantidad) * Number(item.precioUnitario))}
                  </div>
                </div>
                <div style={{ paddingTop: 22 }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary btn-sm add-item-btn"
              onClick={addItem}
            >
              <span className="material-symbols-outlined">add</span>
              Agregar ítem
            </button>

            <div className="items-total">
              Total: {formatCurrency(total)}
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Crear Remito
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
