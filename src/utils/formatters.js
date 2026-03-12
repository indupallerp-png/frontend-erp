export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount ?? 0)

export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const datePart = typeof dateStr === 'string' && dateStr.includes('T')
    ? dateStr.split('T')[0]
    : String(dateStr)
  const d = new Date(datePart + 'T00:00:00')
  return isNaN(d) ? '-' : d.toLocaleDateString('es-AR')
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('es-AR')
}

export const getEstadoBadge = (estado) => {
  const map = {
    activo: 'success',
    activa: 'success',
    inactivo: 'secondary',
    inactiva: 'secondary',
    emitida: 'success',
    recibido: 'success',
    entregado: 'success',
    pendiente: 'warning',
    cancelado: 'danger',
    cancelada: 'danger',
    ingreso: 'success',
    egreso: 'danger',
  }
  return map[estado?.toLowerCase()] || 'secondary'
}

export const generateId = (list) =>
  list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1

export const generateNumero = (prefix, list) => {
  const year = new Date().getFullYear()
  const next = (list.length + 1).toString().padStart(3, '0')
  return `${prefix}-${year}-${next}`
}

export const todayString = () => {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

// Sanitization helpers
export const sanitizeText = (val) =>
  val.replace(/[<>"'`]/g, '').replace(/\s{2,}/g, ' ').trimStart()

export const sanitizeCuit = (val) =>
  val.replace(/[^0-9-]/g, '').slice(0, 13)

export const sanitizePhone = (val) =>
  val.replace(/[^0-9\s\-()+]/g, '').slice(0, 20)

export const sanitizeEmail = (val) =>
  val.replace(/[^a-zA-Z0-9@._+\-]/g, '').slice(0, 100)

export const sanitizeByField = (name, value) => {
  switch (name) {
    case 'cuit': return sanitizeCuit(value)
    case 'telefono': return sanitizePhone(value)
    case 'email': return sanitizeEmail(value)
    default: return sanitizeText(value)
  }
}
