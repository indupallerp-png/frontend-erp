import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import FormField from '../../components/forms/FormField'
import { useRecibos } from '../../hooks/useFacturacion'
import { useClientes } from '../../hooks/useClientes'
import { useNotify } from '../../components/ui/Notification'
import { formatCurrency, formatDate, todayString } from '../../utils/formatters'
import { FORMAS_PAGO } from '../../data/mockData'

const EMPTY_FORM = {
  clienteId: '',
  cliente: '',
  fecha: todayString(),
  monto: '',
  concepto: '',
  formaPago: '',
}

export default function Recibo() {
  const { recibos, addRecibo } = useRecibos()
  const { clientes } = useClientes()
  const { addNotification } = useNotify()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const clientesActivos = clientes.filter(c => c.estado === 'activo')

  const handleOpen = () => {
    setForm({ ...EMPTY_FORM, fecha: todayString() })
    setModalOpen(true)
  }

  const handleClose = () => setModalOpen(false)

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.clienteId) {
      addNotification('Seleccione un cliente', 'error')
      return
    }
    if (!form.monto || Number(form.monto) <= 0) {
      addNotification('El monto debe ser mayor a cero', 'error')
      return
    }

    try {
      await addRecibo(form)
      addNotification('Recibo registrado correctamente', 'success')
      handleClose()
    } catch (err) {
      addNotification(err.message || 'Error al registrar recibo', 'error')
    }
  }

  const columns = [
    { key: 'numero', label: 'Número' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'fecha', label: 'Fecha', render: row => formatDate(row.fecha) },
    { key: 'monto', label: 'Monto', render: row => <strong>{formatCurrency(row.monto)}</strong> },
    { key: 'concepto', label: 'Concepto' },
    { key: 'formaPago', label: 'Forma de Pago' },
  ]

  return (
    <div>
      <div className="d-flex justify-between align-center mb-3">
        <span className="text-muted">{recibos.length} recibos registrados</span>
        <button className="btn btn-primary" onClick={handleOpen}>
          <span className="material-symbols-outlined">add</span>
          Nuevo Recibo
        </button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={[...recibos].reverse()}
            emptyMessage="No hay recibos registrados"
            emptyIcon="payments"
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Nuevo Recibo"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row form-row-2">
            <FormField
              label="Cliente"
              name="clienteId"
              type="select"
              value={form.clienteId}
              onChange={handleChange}
              required
              options={clientesActivos.map(c => ({ value: c.id, label: c.razonSocial }))}
            />
            <FormField
              label="Fecha"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row form-row-2">
            <FormField
              label="Monto"
              name="monto"
              type="number"
              value={form.monto}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <FormField
              label="Forma de Pago"
              name="formaPago"
              type="select"
              value={form.formaPago}
              onChange={handleChange}
              required
              options={FORMAS_PAGO}
            />
          </div>

          <FormField
            label="Concepto"
            name="concepto"
            type="textarea"
            value={form.concepto}
            onChange={handleChange}
            placeholder="Descripción del pago..."
          />

          <div className="modal-footer" style={{ padding: 0, paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Registrar Recibo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
