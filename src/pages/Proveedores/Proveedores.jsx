import { useState } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import FormField from '../../components/forms/FormField'
import { useProveedores } from '../../hooks/useProveedores'
import { useNotify } from '../../components/ui/Notification'
import { getEstadoBadge, sanitizeByField } from '../../utils/formatters'
import { CONDICIONES_IVA } from '../../data/mockData'

const EMPTY_FORM = {
  razonSocial: '',
  cuit: '',
  telefono: '',
  email: '',
  direccion: '',
  condicionIva: '',
  estado: 'activo',
}

export default function Proveedores() {
  const { proveedores, addProveedor, updateProveedor, deleteProveedor } = useProveedores()
  const { addNotification } = useNotify()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = proveedores.filter(p => {
    const q = search.toLowerCase()
    return (
      p.razonSocial?.toLowerCase().includes(q) ||
      p.cuit?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    )
  })

  const handleOpen = (proveedor = null) => {
    if (proveedor) {
      setEditingId(proveedor.id)
      setForm({ ...EMPTY_FORM, ...proveedor })
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
        await updateProveedor(editingId, form)
        addNotification('Proveedor actualizado correctamente', 'success')
      } else {
        await addProveedor(form)
        addNotification('Proveedor creado correctamente', 'success')
      }
      handleClose()
    } catch (err) {
      addNotification(err.message || 'Error al guardar', 'error')
    }
  }

  const handleDelete = (proveedor) => {
    setDeleteConfirm(proveedor)
  }

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteProveedor(deleteConfirm.id)
        addNotification(`Proveedor "${deleteConfirm.razonSocial}" dado de baja`, 'success')
      } catch (err) {
        addNotification(err.message || 'Error al dar de baja', 'error')
      }
      setDeleteConfirm(null)
    }
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
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>block</span>
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
          <h1 className="page-title">Proveedores</h1>
          <p className="page-subtitle">{proveedores.filter(p => p.estado === 'activo').length} proveedores activos</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpen()}>
          <span className="material-symbols-outlined">add_business</span>
          Nuevo proveedor
        </button>
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
            emptyMessage={search ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
            emptyIcon="local_shipping"
          />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editingId ? 'Editar proveedor' : 'Nuevo proveedor'}
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
              {editingId ? 'Guardar cambios' : 'Crear proveedor'}
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
          ¿Está seguro que desea dar de baja al proveedor{' '}
          <strong>{deleteConfirm?.razonSocial}</strong>?
        </p>
        <p className="text-muted mt-2" style={{ fontSize: 13 }}>
          El proveedor quedará marcado como inactivo pero no se eliminará del sistema.
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
