export default function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="empty-state">
      <span className="material-symbols-outlined empty-state-icon">{icon}</span>
      <h4 className="empty-state-title">{title}</h4>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  )
}
