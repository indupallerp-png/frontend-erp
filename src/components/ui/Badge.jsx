export default function Badge({ children, variant = 'secondary' }) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  )
}
