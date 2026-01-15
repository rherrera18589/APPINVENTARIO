import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Button, Input } from '../components/UI'
import { useAuthStore, useUIStore } from '../store/store'
import { authService } from '../services/authService'
import { validateEmail, validatePassword } from '../utils/formatters'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { showNotification } = useUIStore()

  const validateForm = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'El email es requerido'
    else if (!validateEmail(email)) newErrors.email = 'Email inválido'
    if (!password) newErrors.password = 'La contraseña es requerida'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      const { user } = await authService.signin(email, password)
      setUser(user)
      showNotification('¡Sesión iniciada correctamente!', 'success')
      navigate('/dashboard')
    } catch (error) {
      showNotification(error.message || 'Error al iniciar sesión', 'error')
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md relative z-10 border border-white/20 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-4 shadow-lg">
            <h1 className="text-4xl font-bold">📦</h1>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AppInventario</h2>
          <p className="text-slate-600 mt-2">Sistema de Gestión de Inventario</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: '' })
              }}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {errors.submit && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm border border-red-200">
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5"
            variant="primary"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
