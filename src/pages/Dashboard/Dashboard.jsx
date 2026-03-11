import { Link } from 'react-router-dom'
import { StatCard } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import DataTable from '../../components/tables/DataTable'
import { useClientes } from '../../hooks/useClientes'
import { useStock } from '../../hooks/useStock'
import { useRemitosCompra, useRemitosVenta } from '../../hooks/useRemitos'
import { useFacturas, useRecibos } from '../../hooks/useFacturacion'
import { formatCurrency, formatDate, getEstadoBadge } from '../../utils/formatters'

export default function Dashboard() {
  const { clientes } = useClientes()
  const { productos } = useStock()
  const { remitos: remitosCompra } = useRemitosCompra()
  const { remitos: remitosVenta } = useRemitosVenta()
  const { facturas } = useFacturas()
  const { recibos } = useRecibos()

  const clientesActivos = clientes.filter(c => c.estado === 'activo').length
  const productosActivos = productos.filter(p => p.estado === 'activo')
  const stockTotal = productosActivos.reduce((sum, p) => sum + (p.stock || 0), 0)

  // Low stock alerts
  const lowStockProducts = productosActivos.filter(p => p.stock <= p.stockMinimo)
  const sinStock = productosActivos.filter(p => p.stock === 0)

  // Recent activity: last 5 items combining remitos venta + facturas
  const recentActivity = [
    ...remitosVenta.map(r => ({
      id: `rv-${r.id}`,
      tipo: 'Remito Venta',
      numero: r.numero,
      descripcion: r.cliente,
      fecha: r.fecha,
      monto: r.total,
      estado: r.estado,
    })),
    ...facturas.map(f => ({
      id: `fac-${f.id}`,
      tipo: 'Factura',
      numero: f.numero,
      descripcion: f.cliente,
      fecha: f.fecha,
      monto: f.total,
      estado: f.estado,
    })),
  ]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5)

  const activityColumns = [
    { key: 'tipo', label: 'Tipo', render: row => <span className="badge badge-secondary">{row.tipo}</span> },
    { key: 'numero', label: 'Número' },
    { key: 'descripcion', label: 'Cliente' },
    { key: 'fecha', label: 'Fecha', render: row => formatDate(row.fecha) },
    { key: 'monto', label: 'Monto', render: row => formatCurrency(row.monto) },
    { key: 'estado', label: 'Estado', render: row => <Badge variant={getEstadoBadge(row.estado)}>{row.estado}</Badge> },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen general del sistema</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Clientes Activos"
          value={clientesActivos}
          icon="people"
          color="var(--color-primary)"
        />
        <StatCard
          title="Unidades en Stock"
          value={stockTotal.toLocaleString('es-AR')}
          icon="inventory_2"
          color="var(--color-success)"
        />
        <StatCard
          title="Remitos de Compra"
          value={remitosCompra.length}
          icon="local_shipping"
          color="var(--color-orange)"
        />
        <StatCard
          title="Remitos de Venta"
          value={remitosVenta.length}
          icon="receipt"
          color="var(--color-primary)"
        />
        <StatCard
          title="Facturas Emitidas"
          value={facturas.length}
          icon="receipt_long"
          color="var(--color-success)"
        />
        <StatCard
          title="Recibos Registrados"
          value={recibos.length}
          icon="payments"
          color="var(--color-warning)"
        />
      </div>

      {/* Alerts */}
      {sinStock.length > 0 && (
        <div className="alert alert-danger">
          <span className="material-symbols-outlined">error</span>
          <div>
            <strong>Sin stock:</strong>{' '}
            {sinStock.map(p => p.nombre).join(', ')}
          </div>
        </div>
      )}

      {lowStockProducts.filter(p => p.stock > 0).length > 0 && (
        <div className="alert alert-warning">
          <span className="material-symbols-outlined">warning</span>
          <div>
            <strong>Stock bajo:</strong>{' '}
            {lowStockProducts
              .filter(p => p.stock > 0)
              .map(p => `${p.nombre} (${p.stock} uds.)`)
              .join(', ')}
          </div>
        </div>
      )}

      {/* Quick Access */}
      <h3 className="section-title">Acceso rápido</h3>
      <div className="quick-access mb-4">
        <Link to="/clientes" className="quick-btn">
          <span className="material-symbols-outlined">people</span>
          Clientes
        </Link>
        <Link to="/facturacion" className="quick-btn">
          <span className="material-symbols-outlined">receipt_long</span>
          Facturación
        </Link>
        <Link to="/compra-stock" className="quick-btn">
          <span className="material-symbols-outlined">inventory_2</span>
          Compra y Stock
        </Link>
        <Link to="/administracion-cuentas" className="quick-btn">
          <span className="material-symbols-outlined">account_balance</span>
          Cuentas
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Últimos movimientos</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable
            columns={activityColumns}
            data={recentActivity}
            emptyMessage="No hay movimientos recientes"
            emptyIcon="history"
          />
        </div>
      </div>
    </div>
  )
}
