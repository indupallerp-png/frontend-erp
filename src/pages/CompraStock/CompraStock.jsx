import { useState } from 'react'
import RemitoCompra from './RemitoCompra'
import Stock from './Stock'

const TABS = [
  { id: 'remitos', label: 'Remitos de Compra' },
  { id: 'stock', label: 'Stock' },
]

export default function CompraStock() {
  const [activeTab, setActiveTab] = useState('remitos')

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Compra y Stock</h1>
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

      {activeTab === 'remitos' && <RemitoCompra />}
      {activeTab === 'stock' && <Stock />}
    </div>
  )
}
