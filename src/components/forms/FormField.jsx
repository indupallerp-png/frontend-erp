export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options,
  required,
  error,
  placeholder,
  disabled,
  min,
  max,
  step,
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>

      {type === 'select' ? (
        <select
          id={name}
          name={name}
          className="form-control"
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        >
          <option value="">Seleccionar...</option>
          {options?.map(opt => {
            const val = opt.value !== undefined ? opt.value : opt
            const lbl = opt.label !== undefined ? opt.label : opt
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            )
          })}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          className="form-control"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          disabled={disabled}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className="form-control"
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
        />
      )}

      {error && (
        <span className="form-error text-danger">{error}</span>
      )}
    </div>
  )
}
