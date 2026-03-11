import { useState } from 'react'
import RemitoVenta from './RemitoVenta'
import Factura from './Factura'
import Recibo from './Recibo'

const TABS = [
  { id: 'remitos', label: 'Remitos de Venta' },
  { id: 'facturas', label: 'Facturas' },
  { id: 'recibos', label: 'Recibos' },
]

export default function Facturacion() {
  const [activeTab, setActiveTab] = useState('remitos')

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Facturación</h1>
      </div>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'remitos' && <RemitoVenta />}
      {activeTab === 'facturas' && <Factura />}
      {activeTab === 'recibos' && <Recibo />}
    </div>
  )
}
