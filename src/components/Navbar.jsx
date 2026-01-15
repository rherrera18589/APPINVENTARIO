import React from 'react'
import { FiHome, FiBox, FiTruck, FiBarChart2, FiUsers, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/store'
import { authService } from '../services/authService'

export const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authService.signout()
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <nav className="bg-secondary text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-primary">
          📦 AppInventario
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="flex items-center space-x-1 hover:text-primary transition">
            <FiHome /> <span>Inicio</span>
          </Link>
          <Link to="/products" className="flex items-center space-x-1 hover:text-primary transition">
            <FiBox /> <span>Productos</span>
          </Link>
          <Link to="/warehouses" className="flex items-center space-x-1 hover:text-primary transition">
            <FiTruck /> <span>Depósitos</span>
          </Link>
          <Link to="/movements" className="flex items-center space-x-1 hover:text-primary transition">
            <FiBarChart2 /> <span>Movimientos</span>
          </Link>
          <Link to="/reports" className="flex items-center space-x-1 hover:text-primary transition">
            <FiBarChart2 /> <span>Reportes</span>
          </Link>
          <Link to="/users" className="flex items-center space-x-1 hover:text-primary transition">
            <FiUsers /> <span>Usuarios</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <span className="text-sm">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 bg-danger hover:bg-red-600 px-4 py-2 rounded transition"
          >
            <FiLogOut /> <span>Salir</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="md:hidden text-2xl"
        >
          {showMenu ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden mt-4 space-y-2 border-t border-gray-600 pt-4">
          <Link to="/dashboard" className="block py-2 hover:text-primary">
            Inicio
          </Link>
          <Link to="/products" className="block py-2 hover:text-primary">
            Productos
          </Link>
          <Link to="/warehouses" className="block py-2 hover:text-primary">
            Depósitos
          </Link>
          <Link to="/movements" className="block py-2 hover:text-primary">
            Movimientos
          </Link>
          <Link to="/reports" className="block py-2 hover:text-primary">
            Reportes
          </Link>
          <Link to="/users" className="block py-2 hover:text-primary">
            Usuarios
          </Link>
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-danger hover:bg-red-600 px-4 py-2 rounded transition"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  )
}
