import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import FormField from '../../components/forms/FormField'
import { useFacturas } from '../../hooks/useFacturacion'
import { useClientes } from '../../hooks/useClientes'
import { useStock } from '../../hooks/useStock'
import { useNotify } from '../../components/ui/Notification'
import { formatCurrency, formatDate, getEstadoBadge, todayString } from '../../utils/formatters'
import { exportToExcel } from '../../utils/exportExcel'

const EMPTY_FORM = {
  tipo: 'A',
  clienteId: '',
  cliente: '',
  fecha: todayString(),
  estado: 'pendiente',
}

const EMPTY_ITEM = { productoId: '', producto: '', cantidad: 1, precioUnitario: 0 }

export default function Factura() {
  const { facturas, addFactura, updateFactura } = useFacturas()
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

  const handleClose = () => setModalOpen(false)

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

  const addItem = () => setItems(prev => [...prev, { ...EMPTY_ITEM }])
  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index))

  const subtotal = items.reduce((sum, i) => sum + (Number(i.cantidad) * Number(i.precioUnitario)), 0)
  const iva = form.tipo === 'A' ? Math.round(subtotal * 0.21) : 0
  const total = subtotal + iva

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
      await addFactura({ ...form, items: validItems })
      addNotification('Factura creada correctamente', 'success')
      handleClose()
    } catch (err) {
      addNotification(err.message || 'Error al crear factura', 'error')
    }
  }

  const handleVerPDF = (factura) => {
    const fmt = (n) =>
      new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n ?? 0)
    const fmtDate = (d) => {
      if (!d) return '-'
      const part = typeof d === 'string' && d.includes('T') ? d.split('T')[0] : String(d)
      const dt = new Date(part + 'T00:00:00')
      return isNaN(dt) ? '-' : dt.toLocaleDateString('es-AR')
    }
    const itemsRows = (factura.items || [])
      .map(
        (item) => `
        <tr>
          <td>${item.producto || '-'}</td>
          <td style="text-align:center">${item.cantidad}</td>
          <td style="text-align:right">${fmt(item.precioUnitario)}</td>
          <td style="text-align:right">${fmt(Number(item.cantidad) * Number(item.precioUnitario))}</td>
        </tr>`
      )
      .join('')
    const ivaRow =
      factura.tipo === 'A'
        ? `<tr><td colspan="3" style="text-align:right"><strong>IVA (21%)</strong></td><td style="text-align:right">${fmt(factura.iva)}</td></tr>`
        : ''
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Factura ${factura.numero}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #222; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #1a3a5c; padding-bottom: 20px; }
    .company-name { font-size: 22px; font-weight: 700; color: #1a3a5c; }
    .company-info { font-size: 12px; color: #555; margin-top: 4px; line-height: 1.6; }
    .invoice-box { text-align: right; }
    .invoice-title { font-size: 28px; font-weight: 700; color: #1a3a5c; }
    .invoice-tipo { display: inline-block; border: 2px solid #1a3a5c; padding: 2px 12px; font-size: 20px; font-weight: 700; margin-top: 4px; }
    .invoice-number { font-size: 16px; font-weight: 600; margin-top: 6px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 6px; }
    .client-box { background: #f5f7fa; border-radius: 6px; padding: 12px 16px; }
    .client-name { font-size: 15px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    thead tr { background: #1a3a5c; color: #fff; }
    thead th { padding: 9px 12px; text-align: left; font-size: 12px; }
    thead th:last-child { text-align: right; }
    tbody tr:nth-child(even) { background: #f5f7fa; }
    tbody td { padding: 8px 12px; border-bottom: 1px solid #e8eaed; }
    .totals { margin-top: 16px; text-align: right; }
    .totals table { width: auto; margin-left: auto; min-width: 260px; }
    .totals td { padding: 5px 12px; }
    .grand-total td { font-size: 16px; font-weight: 700; color: #1a3a5c; border-top: 2px solid #1a3a5c; padding-top: 8px; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #e8eaed; padding-top: 16px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company-name">INDUPALL SRL</div>
      <div class="company-info">
        9 de Julio 1649, Pilar, Santa Fe, Argentina<br/>
        Tel: +54 03404 470887
      </div>
    </div>
    <div class="invoice-box">
      <div class="invoice-title">FACTURA</div>
      <div class="invoice-tipo">TIPO ${factura.tipo}</div>
      <div class="invoice-number">${factura.numero}</div>
      <div style="font-size:12px;color:#555;margin-top:4px">Fecha: ${fmtDate(factura.fecha)}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Cliente</div>
    <div class="client-box">
      <div class="client-name">${factura.cliente || '-'}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Detalle</div>
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th style="text-align:center">Cant.</th>
          <th style="text-align:right">Precio Unit.</th>
          <th style="text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>
  </div>

  <div class="totals">
    <table>
      <tbody>
        <tr><td colspan="3" style="text-align:right"><strong>Subtotal</strong></td><td style="text-align:right">${fmt(factura.subtotal)}</td></tr>
        ${ivaRow}
        <tr class="grand-total"><td colspan="3" style="text-align:right">TOTAL</td><td style="text-align:right">${fmt(factura.total)}</td></tr>
      </tbody>
    </table>
  </div>

  <div class="footer">Sistema ERP Indupall &mdash; PulpoNet-Computacion</div>

  <script>window.onload = () => window.print()</script>
</body>
</html>`
    const win = window.open('', '_blank', 'width=900,height=700')
    win.document.write(html)
    win.document.close()
    win.focus()
  }

  const handleMarkEmitida = async (factura) => {
    try {
      await updateFactura(factura.id, { estado: 'emitida' })
      addNotification('Factura marcada como emitida', 'success')
    } catch (err) {
      addNotification(err.message || 'Error al actualizar', 'error')
    }
  }

  const handleExport = () => {
    exportToExcel({
      filename: 'facturas',
      title: 'Facturas',
      columns: [
        { label: 'Número',   key: 'numero' },
        { label: 'Tipo',     key: 'tipo',     format: r => `Tipo ${r.tipo}` },
        { label: 'Cliente',  key: 'cliente' },
        { label: 'Fecha',    key: 'fecha',    format: r => formatDate(r.fecha) },
        { label: 'Subtotal', key: 'subtotal', format: r => formatCurrency(r.subtotal) },
        { label: 'IVA',      key: 'iva',      format: r => formatCurrency(r.iva) },
        { label: 'Total',    key: 'total',    format: r => formatCurrency(r.total) },
        { label: 'Estado',   key: 'estado' },
      ],
      data: facturas,
    })
  }

  const columns = [
    { key: 'numero', label: 'Número' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: row => <Badge variant="secondary">Tipo {row.tipo}</Badge>,
    },
    { key: 'cliente', label: 'Cliente' },
    { key: 'fecha', label: 'Fecha', render: row => formatDate(row.fecha) },
    { key: 'subtotal', label: 'Subtotal', render: row => formatCurrency(row.subtotal) },
    { key: 'iva', label: 'IVA', render: row => formatCurrency(row.iva) },
    { key: 'total', label: 'Total', render: row => <strong>{formatCurrency(row.total)}</strong> },
    {
      key: 'estado',
      label: 'Estado',
      render: row => <Badge variant={getEstadoBadge(row.estado)}>{row.estado}</Badge>,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: row => (
        <div style={{ display: 'flex', gap: 4 }}>
          {row.estado === 'pendiente' && (
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleMarkEmitida(row)}
            >
              Emitir
            </button>
          )}
          {row.estado === 'emitida' && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => handleVerPDF(row)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>picture_as_pdf</span>
              Ver PDF
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="d-flex justify-between align-center mb-3">
        <span className="text-muted">{facturas.length} facturas registradas</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <span className="material-symbols-outlined">download</span>
            Exportar Excel
          </button>
          <button className="btn btn-primary" onClick={handleOpen}>
            <span className="material-symbols-outlined">add</span>
            Nueva Factura
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={[...facturas].reverse()}
            emptyMessage="No hay facturas registradas"
            emptyIcon="receipt_long"
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Nueva Factura"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row form-row-3">
            <FormField
              label="Tipo"
              name="tipo"
              type="select"
              value={form.tipo}
              onChange={handleFormChange}
              required
              options={[
                { value: 'A', label: 'Factura A' },
                { value: 'B', label: 'Factura B' },
                { value: 'C', label: 'Factura C' },
              ]}
            />
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
                  >
                    <option value="">Seleccionar...</option>
                    {productosActivos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
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

            <div style={{ marginTop: 12 }}>
              <div className="items-total-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {form.tipo === 'A' && (
                <div className="items-total-row">
                  <span>IVA (21%):</span>
                  <span>{formatCurrency(iva)}</span>
                </div>
              )}
              <div className="items-total-row grand-total">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: 0, paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Crear Factura
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
