import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Notification } from './components/Notification'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Products } from './pages/Products'
import { Warehouses } from './pages/Warehouses'
import { Movements } from './pages/Movements'
import { Users } from './pages/Users'
import { Reports } from './pages/Reports'
import { useAuthStore } from './store/store'
import { authService } from './services/authService'

export default function App() {
  const { user, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Verificar sesión actual
    authService.getCurrentUser()
      .then(user => {
        if (user) setUser(user)
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))

    // Escuchar cambios de autenticación
    const { data } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      data?.subscription?.unsubscribe()
    }
  }, [setUser, setLoading])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/products" element={user ? <Products /> : <Navigate to="/login" />} />
        <Route path="/warehouses" element={user ? <Warehouses /> : <Navigate to="/login" />} />
        <Route path="/movements" element={user ? <Movements /> : <Navigate to="/login" />} />
        <Route path="/users" element={user ? <Users /> : <Navigate to="/login" />} />
        <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
      <Notification />
    </Router>
  )
}
