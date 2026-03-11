export function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-body">
        <div className="stat-card-info">
          <span className="stat-card-title">{title}</span>
          <span className="stat-card-value">{value}</span>
        </div>
        {icon && (
          <div className="stat-card-icon" style={{ color: color || 'var(--color-primary)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
              {icon}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function Card({ title, children, actions }) {
  return (
    <div className="card">
      {(title || actions) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  )
}
