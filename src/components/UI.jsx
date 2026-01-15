import React from 'react'

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg border border-slate-100 p-6 transition-shadow duration-300 ${className}`}>
    {children}
  </div>
)

export const Button = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const variantClass = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg',
    secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg',
    outline: 'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50',
  }[variant]

  const sizeClass = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size]

  return (
    <button
      className={`rounded-lg font-semibold transition-all duration-200 ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const Input = ({ 
  className = '', 
  value,
  ...props 
}) => (
  <input
    className={`w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ${className}`}
    value={value || ''}
    {...props}
  />
)

export const Select = ({ 
  className = '', 
  options = [],
  ...props 
}) => (
  <select
    className={`w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ${className}`}
    {...props}
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

export const Badge = ({ 
  children, 
  variant = 'primary',
  className = '' 
}) => {
  const variantClass = {
    primary: 'bg-indigo-100 text-indigo-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-blue-100 text-blue-800',
  }[variant]

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${variantClass} ${className}`}>
      {children}
    </span>
  )
}

export const Table = ({ 
  columns = [], 
  data = [], 
  className = '' 
}) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full text-sm">
      <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
        <tr>
          {columns.map(col => (
            <th 
              key={col.key} 
              className="px-4 py-3 text-left font-semibold text-slate-700"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr 
            key={idx} 
            className="border-b border-slate-100 hover:bg-indigo-50 transition-colors"
          >
            {columns.map(col => (
              <td 
                key={`${idx}-${col.key}`} 
                className="px-4 py-3 text-slate-700"
              >
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
