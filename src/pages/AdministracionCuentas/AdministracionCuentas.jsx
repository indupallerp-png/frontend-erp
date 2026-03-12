import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import FormField from '../../components/forms/FormField'
import { useCuentas } from '../../hooks/useCuentas'
import { useNotify } from '../../components/ui/Notification'
import { formatCurrency, formatDate, getEstadoBadge } from '../../utils/formatters'
import { exportToExcel } from '../../utils/exportExcel'
import { TIPOS_CUENTA, FORMAS_PAGO } from '../../data/mockData'

const EMPTY_CUENTA = {
  nombre: '',
  tipo: '',
  saldo: '',
  estado: 'activa',
}

const EMPTY_MOVIMIENTO = {
  cuentaId: '',
  tipo: 'ingreso',
  descripcion: '',
  monto: '',
  fecha: new Date().toISOString().split('T')[0],
}

export default function AdministracionCuentas() {
  const { cuentas, movimientos, addCuenta, updateCuenta, addMovimiento } = useCuentas()
  const { addNotification } = useNotify()

  const [cuentaModalOpen, setCuentaModalOpen] = useState(false)
  const [movimientoModalOpen, setMovimientoModalOpen] = useState(false)
  const [editingCuentaId, setEditingCuentaId] = useState(null)
  const [cuentaForm, setCuentaForm] = useState(EMPTY_CUENTA)
  const [movForm, setMovForm] = useState(EMPTY_MOVIMIENTO)

  // Cuenta modal handlers
  const handleOpenCuenta = (cuenta = null) => {
    if (cuenta) {
      setEditingCuentaId(cuenta.id)
      setCuentaForm({
        nombre: cuenta.nombre,
        tipo: cuenta.tipo,
        saldo: cuenta.saldo,
        estado: cuenta.estado,
      })
    } else {
      setEditingCuentaId(null)
      setCuentaForm(EMPTY_CUENTA)
    }
    setCuentaModalOpen(true)
  }

  const handleCloseCuenta = () => {
    setCuentaModalOpen(false)
    setEditingCuentaId(null)
    setCuentaForm(EMPTY_CUENTA)
  }

  const handleCuentaChange = (e) => {
    const { name, value } = e.target
    setCuentaForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitCuenta = async (e) => {
    e.preventDefault()
    if (!cuentaForm.nombre.trim()) {
      addNotification('El nombre es obligatorio', 'error')
      return
    }

    try {
      if (editingCuentaId) {
        await updateCuenta(editingCuentaId, cuentaForm)
        addNotification('Cuenta actualizada correctamente', 'success')
      } else {
        await addCuenta(cuentaForm)
        addNotification('Cuenta creada correctamente', 'success')
      }
      handleCloseCuenta()
    } catch (err) {
      addNotification(err.message || 'Error al guardar', 'error')
    }
  }

  // Movimiento modal handlers
  const handleOpenMovimiento = () => {
    setMovForm({
      ...EMPTY_MOVIMIENTO,
      fecha: new Date().toISOString().split('T')[0],
    })
    setMovimientoModalOpen(true)
  }

  const handleCloseMovimiento = () => {
    setMovimientoModalOpen(false)
    setMovForm(EMPTY_MOVIMIENTO)
  }

  const handleMovChange = (e) => {
    const { name, value } = e.target
    setMovForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitMovimiento = async (e) => {
    e.preventDefault()
    if (!movForm.cuentaId) {
      addNotification('Seleccione una cuenta', 'error')
      return
    }
    if (!movForm.monto || Number(movForm.monto) <= 0) {
      addNotification('El monto debe ser mayor a cero', 'error')
      return
    }

    try {
      await addMovimiento({ ...movForm, cuentaId: Number(movForm.cuentaId) })
      addNotification('Movimiento registrado y saldo actualizado', 'success')
      handleCloseMovimiento()
    } catch (err) {
      addNotification(err.message || 'Error al registrar movimiento', 'error')
    }
  }

  // Sorted movimientos (most recent first)
  const movimientosOrdenados = [...movimientos].reverse()

  const cuentaColumns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'saldo',
      label: 'Saldo',
      render: row => (
        <span className={row.saldo < 0 ? 'saldo-negativo' : 'saldo-positivo'}>
          {formatCurrency(row.saldo)}
        </span>
      ),
    },
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
          onClick={() => handleOpenCuenta(row)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
          Editar
        </button>
      ),
    },
  ]

  const movColumns = [
    {
      key: 'cuenta',
      label: 'Cuenta',
      render: row => {
        const cuenta = cuentas.find(c => c.id === row.cuentaId)
        return cuenta?.nombre || `Cuenta #${row.cuentaId}`
      },
    },
    { key: 'fecha', label: 'Fecha', render: row => formatDate(row.fecha) },
    { key: 'descripcion', label: 'Descripción' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: row => (
        <Badge variant={row.tipo === 'ingreso' ? 'success' : 'danger'}>
          {row.tipo}
        </Badge>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: row => (
        <span className={row.tipo === 'ingreso' ? 'saldo-positivo' : 'saldo-negativo'}>
          {row.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(row.monto)}
        </span>
      ),
    },
  ]

  const totalSaldo = cuentas.reduce((sum, c) => sum + (parseFloat(c.saldo) || 0), 0)

  const handleExportCuentas = () => {
    exportToExcel({
      filename: 'cuentas',
      title: 'Cuentas',
      columns: [
        { label: 'Nombre', key: 'nombre' },
        { label: 'Tipo',   key: 'tipo' },
        { label: 'Saldo',  key: 'saldo', format: r => formatCurrency(r.saldo) },
        { label: 'Estado', key: 'estado' },
      ],
      data: cuentas,
    })
  }

  const handleExportMovimientos = () => {
    exportToExcel({
      filename: 'movimientos',
      title: 'Movimientos',
      columns: [
        { label: 'Cuenta',      key: 'cuentaId', format: r => cuentas.find(c => c.id === r.cuentaId)?.nombre || `#${r.cuentaId}` },
        { label: 'Fecha',       key: 'fecha',    format: r => formatDate(r.fecha) },
        { label: 'Descripción', key: 'descripcion' },
        { label: 'Tipo',        key: 'tipo' },
        { label: 'Monto',       key: 'monto',    format: r => formatCurrency(r.monto) },
      ],
      data: movimientosOrdenados,
    })
  }

  return (
    <div>
      {/* Cuentas Section */}
      <div className="d-flex justify-between align-center mb-3">
        <div>
          <h2 className="section-title" style={{ marginBottom: 2 }}>Cuentas</h2>
          <span className="text-muted">
            Saldo total:{' '}
            <strong className={totalSaldo < 0 ? 'saldo-negativo' : 'saldo-positivo'}>
              {formatCurrency(totalSaldo)}
            </strong>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleExportCuentas}>
            <span className="material-symbols-outlined">download</span>
            Exportar Excel
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenCuenta()}>
            <span className="material-symbols-outlined">add</span>
            Nueva Cuenta
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={cuentaColumns}
            data={cuentas}
            emptyMessage="No hay cuentas registradas"
            emptyIcon="account_balance"
          />
        </div>
      </div>

      {/* Movimientos Section */}
      <div className="d-flex justify-between align-center mb-3">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Últimos movimientos</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleExportMovimientos}>
            <span className="material-symbols-outlined">download</span>
            Exportar Excel
          </button>
          <button className="btn btn-secondary" onClick={handleOpenMovimiento}>
            <span className="material-symbols-outlined">add</span>
            Registrar Movimiento
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={movColumns}
            data={movimientosOrdenados}
            emptyMessage="No hay movimientos registrados"
            emptyIcon="swap_horiz"
          />
        </div>
      </div>

      {/* Nueva Cuenta Modal */}
      <Modal
        isOpen={cuentaModalOpen}
        onClose={handleCloseCuenta}
        title={editingCuentaId ? 'Editar cuenta' : 'Nueva cuenta'}
        size="sm"
      >
        <form onSubmit={handleSubmitCuenta}>
          <FormField
            label="Nombre"
            name="nombre"
            value={cuentaForm.nombre}
            onChange={handleCuentaChange}
            required
            placeholder="Nombre de la cuenta"
          />

          <div className="form-row form-row-2">
            <FormField
              label="Tipo"
              name="tipo"
              type="select"
              value={cuentaForm.tipo}
              onChange={handleCuentaChange}
              required
              options={TIPOS_CUENTA}
            />
            <FormField
              label="Saldo inicial"
              name="saldo"
              type="number"
              value={cuentaForm.saldo}
              onChange={handleCuentaChange}
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <FormField
            label="Estado"
            name="estado"
            type="select"
            value={cuentaForm.estado}
            onChange={handleCuentaChange}
            options={[
              { value: 'activa', label: 'Activa' },
              { value: 'inactiva', label: 'Inactiva' },
            ]}
          />

          <div className="modal-footer" style={{ padding: 0, paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseCuenta}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCuentaId ? 'Guardar cambios' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Nuevo Movimiento Modal */}
      <Modal
        isOpen={movimientoModalOpen}
        onClose={handleCloseMovimiento}
        title="Registrar movimiento"
        size="md"
      >
        <form onSubmit={handleSubmitMovimiento}>
          <div className="form-row form-row-2">
            <FormField
              label="Cuenta"
              name="cuentaId"
              type="select"
              value={movForm.cuentaId}
              onChange={handleMovChange}
              required
              options={cuentas
                .filter(c => c.estado === 'activa')
                .map(c => ({ value: c.id, label: `${c.nombre} (${formatCurrency(c.saldo)})` }))}
            />
            <FormField
              label="Tipo"
              name="tipo"
              type="select"
              value={movForm.tipo}
              onChange={handleMovChange}
              required
              options={[
                { value: 'ingreso', label: 'Ingreso' },
                { value: 'egreso', label: 'Egreso' },
              ]}
            />
          </div>

          <div className="form-row form-row-2">
            <FormField
              label="Monto"
              name="monto"
              type="number"
              value={movForm.monto}
              onChange={handleMovChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <FormField
              label="Fecha"
              name="fecha"
              type="date"
              value={movForm.fecha}
              onChange={handleMovChange}
              required
            />
          </div>

          <FormField
            label="Descripción"
            name="descripcion"
            type="textarea"
            value={movForm.descripcion}
            onChange={handleMovChange}
            placeholder="Descripción del movimiento..."
          />

          <div className="modal-footer" style={{ padding: 0, paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseMovimiento}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
