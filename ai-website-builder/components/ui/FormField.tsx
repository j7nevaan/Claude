'use client'

interface InputProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  hint?: string
}

export function InputField({ label, value, onChange, type = 'text', placeholder, required, hint }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500 mb-1">{hint}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition"
      />
    </div>
  )
}

interface TextareaProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  hint?: string
}

export function TextareaField({ label, value, onChange, placeholder, rows = 4, hint }: TextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-500 mb-1">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-vertical transition"
      />
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[] | string[]
  placeholder?: string
  hint?: string
}

export function SelectField({ label, value, onChange, options, placeholder, hint }: SelectProps) {
  const normalized = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  )
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-500 mb-1">{hint}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white transition"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
