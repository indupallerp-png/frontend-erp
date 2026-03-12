import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import FormField from '../../components/forms/FormField'
import { useClientes } from '../../hooks/useClientes'
import { useNotify } from '../../components/ui/Notification'
import { getEstadoBadge, sanitizeByField } from '../../utils/formatters'
import { CONDICIONES_IVA } from '../../data/mockData'
import { exportToExcel } from '../../utils/exportExcel'

const EMPTY_FORM = {
  razonSocial: '',
  cuit: '',
  telefono: '',
  email: '',
  direccion: '',
  condicionIva: '',
  estado: 'activo',
}

export default function Clientes() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useClientes()
  const { addNotification } = useNotify()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = clientes.filter(c => {
    const q = search.toLowerCase()
    return (
      c.razonSocial?.toLowerCase().includes(q) ||
      c.cuit?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    )
  })

  const handleOpen = (cliente = null) => {
    if (cliente) {
      setEditingId(cliente.id)
      setForm({ ...EMPTY_FORM, ...cliente })
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
    const { name, value, type } = e.target
    const sanitized = type === 'select-one' ? value : sanitizeByField(name, value)
    setForm(prev => ({ ...prev, [name]: sanitized }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.razonSocial.trim()) {
      addNotification('La razón social es obligatoria', 'error')
      return
    }

    try {
      if (editingId) {
        await updateCliente(editingId, form)
        addNotification('Cliente actualizado correctamente', 'success')
      } else {
        await addCliente(form)
        addNotification('Cliente creado correctamente', 'success')
      }
      handleClose()
    } catch (err) {
      addNotification(err.message || 'Error al guardar', 'error')
    }
  }

  const handleDelete = (cliente) => {
    setDeleteConfirm(cliente)
  }

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteCliente(deleteConfirm.id)
        addNotification(`Cliente "${deleteConfirm.razonSocial}" dado de baja`, 'success')
      } catch (err) {
        addNotification(err.message || 'Error al dar de baja', 'error')
      }
      setDeleteConfirm(null)
    }
  }

  const handleExport = () => {
    exportToExcel({
      filename: 'clientes',
      title: 'Clientes',
      columns: [
        { label: 'Razón Social',   key: 'razonSocial' },
        { label: 'CUIT',           key: 'cuit' },
        { label: 'Teléfono',       key: 'telefono' },
        { label: 'Email',          key: 'email' },
        { label: 'Dirección',      key: 'direccion' },
        { label: 'Condición IVA',  key: 'condicionIva' },
        { label: 'Estado',         key: 'estado' },
      ],
      data: filtered,
    })
  }

  const columns = [
    { key: 'razonSocial', label: 'Razón Social' },
    { key: 'cuit', label: 'CUIT' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'condicionIva', label: 'Condición IVA' },
    {
      key: 'estado',
      label: 'Estado',
      render: row => (
        <Badge variant={getEstadoBadge(row.estado)}>{row.estado}</Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: row => (
        <div className="table-actions">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => handleOpen(row)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
            Editar
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row)}
            disabled={row.estado === 'inactivo'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person_off</span>
            Baja
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">{clientes.filter(c => c.estado === 'activo').length} clientes activos</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <span className="material-symbols-outlined">download</span>
            Exportar Excel
          </button>
          <button className="btn btn-primary" onClick={() => handleOpen()}>
            <span className="material-symbols-outlined">person_add</span>
            Nuevo cliente
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Buscar por razón social, CUIT o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="btn btn-secondary btn-sm" onClick={() => setSearch('')}>
            Limpiar
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage={search ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            emptyIcon="people"
          />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editingId ? 'Editar cliente' : 'Nuevo cliente'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row form-row-2">
            <FormField
              label="Razón Social"
              name="razonSocial"
              value={form.razonSocial}
              onChange={handleChange}
              required
              placeholder="Nombre o razón social"
            />
            <FormField
              label="CUIT"
              name="cuit"
              value={form.cuit}
              onChange={handleChange}
              placeholder="XX-XXXXXXXX-X"
            />
          </div>

          <div className="form-row form-row-2">
            <FormField
              label="Teléfono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Número de teléfono"
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <FormField
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Calle, número, ciudad"
          />

          <div className="form-row form-row-2">
            <FormField
              label="Condición IVA"
              name="condicionIva"
              type="select"
              value={form.condicionIva}
              onChange={handleChange}
              options={CONDICIONES_IVA}
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
              {editingId ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmar baja"
        size="sm"
      >
        <p>
          ¿Está seguro que desea dar de baja al cliente{' '}
          <strong>{deleteConfirm?.razonSocial}</strong>?
        </p>
        <p className="text-muted mt-2" style={{ fontSize: 13 }}>
          El cliente quedará marcado como inactivo pero no se eliminará del sistema.
        </p>
        <div className="modal-footer" style={{ padding: 0, paddingTop: 16 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteConfirm(null)}
          >
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={confirmDelete}>
            Dar de baja
          </button>
        </div>
      </Modal>
    </div>
  )
}
