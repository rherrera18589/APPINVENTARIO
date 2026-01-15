import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiBox, FiTruck, FiBarChart2, FiUsers, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useAuthStore } from '../store/store'
import { authService } from '../services/authService'

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await authService.signout()
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const menuItems = [
    { path: '/dashboard', label: 'Inicio', icon: FiHome },
    { path: '/products', label: 'Productos', icon: FiBox },
    { path: '/warehouses', label: 'Depósitos', icon: FiTruck },
    { path: '/movements', label: 'Movimientos', icon: FiBarChart2 },
    { path: '/reports', label: 'Reportes', icon: FiBarChart2 },
    { path: '/users', label: 'Usuarios', icon: FiUsers },
  ]

  const isActive = (path) => location.pathname === path

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center h-20 px-4 border-b border-slate-700 bg-slate-950">
        <Link to="/dashboard" className="flex items-center space-x-3 font-bold text-lg hover:opacity-80 transition flex-1" onClick={() => setIsOpen(false)}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-bold text-lg">📦</span>
          </div>
          <div className="min-w-0">
            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold truncate">AppInventario</div>
            <div className="text-xs text-slate-500">Sistema</div>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto pt-6 pb-24">
        <div className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={22} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-700 bg-slate-950 p-3">
        <div className="mb-3 px-2 py-2 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400 font-semibold">Usuario</p>
          <p className="text-sm font-semibold text-slate-200 truncate mt-1">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2.5 rounded-lg transition font-semibold shadow-lg group"
        >
          <FiLogOut size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span>Salir</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition"
        title="Menú"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Always visible on lg screens */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-sidebar bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex-col z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Slides from left */}
      <div className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex flex-col z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>
    </>
  )
}
