import EmptyState from '../ui/EmptyState'

export default function DataTable({
  columns,
  data = [],
  loading = false,
  emptyMessage = 'No hay datos',
  emptyIcon = 'table_rows',
}) {
  if (loading) {
    return (
      <div className="empty-state">
        <p className="text-muted">Cargando...</p>
      </div>
    )
  }

  if (!data.length) {
    return <EmptyState icon={emptyIcon} title={emptyMessage} />
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
