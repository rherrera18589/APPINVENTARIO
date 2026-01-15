import React from 'react'
import { Sidebar } from './Sidebar'

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50">
      <Sidebar />
      <main className="w-full lg:ml-sidebar transition-all duration-300 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export const PageHeader = ({ title, description = '' }) => {
  return (
    <div className="mb-8 animate-slide-in">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">{title}</h1>
      {description && (
        <p className="text-slate-600 text-lg">{description}</p>
      )}
    </div>
  )
}

export const FormGroup = ({ label, error, children, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-danger text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export const Grid = ({ children, cols = 3, gap = 4, className = '' }) => {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols]

  const gapClass = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
  }[gap]

  return (
    <div className={`grid ${gridClass} ${gapClass} ${className}`}>
      {children}
    </div>
  )
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[size]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl ${sizeClass} w-full`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export const Alert = ({ type = 'info', message, onClose }) => {
  const bgColor = {
    success: 'bg-green-50 text-green-800 border-green-300',
    error: 'bg-red-50 text-red-800 border-red-300',
    warning: 'bg-amber-50 text-amber-800 border-amber-300',
    info: 'bg-blue-50 text-blue-800 border-blue-300',
  }[type]

  return (
    <div className={`border-l-4 ${bgColor} p-4 mb-4 rounded-lg flex justify-between items-center shadow-sm`}>
      <span className="font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 font-bold hover:opacity-70 transition"
        >
          ×
        </button>
      )}
    </div>
  )
}
