/**
 * Exporta datos a Excel (.xls) con formato estilizado.
 * Usa HTML → .xls, que Excel interpreta con estilos completos. Sin dependencias externas.
 *
 * @param {Object} config
 * @param {string}   config.filename  - nombre del archivo (sin extensión)
 * @param {string}   config.title     - título visible en la primera fila
 * @param {Array<{label:string, key:string, format?:Function}>} config.columns
 * @param {Array<Object>} config.data
 */
export function exportToExcel({ filename, title, columns, data }) {
  const fecha = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const thStyle = [
    'background-color:#343a40',
    'color:#ffffff',
    'font-weight:bold',
    'padding:8px 14px',
    'border:1px solid #495057',
    'white-space:nowrap',
    'font-size:13px',
  ].join(';')

  const headerRow = columns.map(col => `<th style="${thStyle}">${col.label}</th>`).join('')

  const bodyRows = data.map((row, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f0f2f4'
    const tdStyle = `padding:6px 14px;border:1px solid #dee2e6;background-color:${bg};font-size:12px;`
    const cells = columns.map(col => {
      const val = col.format ? col.format(row) : (row[col.key] ?? '')
      return `<td style="${tdStyle}">${val}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><meta name="ProgId" content="Excel.Sheet"></head>
<body>
<table>
  <tr>
    <td colspan="${columns.length}"
        style="font-size:16px;font-weight:bold;padding:14px 16px;background-color:#343a40;color:#ffffff;border:1px solid #343a40;">
      ${title} &nbsp;&nbsp;
      <span style="font-size:12px;font-weight:normal;opacity:0.8;">INDUPALL SRL</span>
    </td>
  </tr>
  <tr>
    <td colspan="${columns.length}"
        style="font-size:11px;color:#6c757d;padding:5px 16px;border:1px solid #dee2e6;background-color:#f8f9fa;">
      Exportado el ${fecha} &nbsp;·&nbsp; ${data.length} registro${data.length !== 1 ? 's' : ''}
    </td>
  </tr>
  <tr>${headerRow}</tr>
  ${bodyRows}
</table>
</body>
</html>`

  const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.xls`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
