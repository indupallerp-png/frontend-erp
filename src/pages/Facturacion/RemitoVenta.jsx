import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import FormField from '../../components/forms/FormField'
import { useRemitosVenta } from '../../hooks/useRemitos'
import { useClientes } from '../../hooks/useClientes'
import { useStock } from '../../hooks/useStock'
import { useNotify } from '../../components/ui/Notification'
import { formatCurrency, formatDate, getEstadoBadge, todayString } from '../../utils/formatters'

const EMPTY_FORM = {
  clienteId: '',
  cliente: '',
  fecha: todayString(),
}

const EMPTY_ITEM = { productoId: '', producto: '', cantidad: 1, precioUnitario: 0 }

export default function RemitoVenta() {
  const { remitos, addRemito } = useRemitosVenta()
  const { clientes } = useClientes()
  const { productos } = useStock()
  const { addNotification } = useNotify()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [items, setItems] = useState([{ ...EMPTY_ITEM }])

  const clientesActivos = clientes.filter(c => c.estado === 'activo')
  const productosActivos = productos.filter(p => p.estado === 'activo')

  const handleOpen = () => {
    setForm({ ...EMPTY_FORM, fecha: todayString() })
    setItems([{ ...EMPTY_ITEM }])
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    if (name === 'clienteId') {
      const cliente = clientesActivos.find(c => c.id === Number(value))
      setForm(prev => ({
        ...prev,
        clienteId: Number(value),
        cliente: cliente?.razonSocial || '',
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
          precioUnitario: producto?.precio || 0,
        }
      } else if (field === 'cantidad') {
        updated[index] = { ...updated[index], cantidad: Number(value) }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      return updated
    })
  }

  const addItem = () => {
    setItems(prev => [...prev, { ...EMPTY_ITEM }])
  }

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, item) => sum + (Number(item.cantidad) * Number(item.precioUnitario)), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.clienteId) {
      addNotification('Seleccione un cliente', 'error')
      return
    }
    const validItems = items.filter(i => i.productoId && i.cantidad > 0)
    if (validItems.length === 0) {
      addNotification('Agregue al menos un ítem', 'error')
      return
    }

    try {
      await addRemito({ ...form, items: validItems })
      addNotification('Remito de venta creado correctamente', 'success')
      handleClose()
    } catch (err) {
      addNotification(err.message || 'Error al crear remito', 'error')
    }
  }

  const columns = [
    { key: 'numero', label: 'Número' },
    { key: 'cliente', label: 'Cliente' },
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
          Nuevo Remito de Venta
        </button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={[...remitos].reverse()}
            emptyMessage="No hay remitos de venta"
            emptyIcon="receipt"
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Nuevo Remito de Venta"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row form-row-2">
            <FormField
              label="Cliente"
              name="clienteId"
              type="select"
              value={form.clienteId}
              onChange={handleFormChange}
              required
              options={clientesActivos.map(c => ({ value: c.id, label: c.razonSocial }))}
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
            <div className="items-section-title">Productos</div>
            {items.map((item, index) => (
              <div key={index} className="item-row">
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
                        {p.nombre} (Stock: {p.stock})
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
              <span>Total: {formatCurrency(total)}</span>
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
