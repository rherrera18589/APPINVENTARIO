import React, { useEffect, useState } from 'react'
import { useAuthStore, useUIStore } from '../store/store'
import { Layout, PageHeader } from '../components/Layout'
import { Card, Button } from '../components/UI'
import { FiBox, FiTruck, FiBarChart2, FiUsers, FiArrowRight } from 'react-icons/fi'
import { inventoryService } from '../services/inventoryService'
import { userService } from '../services/userService'

export const Dashboard = () => {
  const { user } = useAuthStore()
  const { showNotification } = useUIStore()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalWarehouses: 0,
    totalUsers: 0,
    lowStockItems: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [products, warehouses, users, stock] = await Promise.all([
        inventoryService.getProducts(),
        inventoryService.getWarehouses(),
        userService.getUsers(),
        inventoryService.getStock(),
      ])

      const lowStock = stock.filter(item => item.quantity < 10).length

      setStats({
        totalProducts: products.length,
        totalWarehouses: warehouses.length,
        totalUsers: users.length,
        lowStockItems: lowStock,
      })
    } catch (error) {
      console.error('Error cargando datos:', error)
      showNotification('Error al cargar el dashboard', 'error')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, title, value, color, link }) => (
    <Card className={`border-l-4 ${color} hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} opacity-20`}>
          <Icon size={40} className="text-indigo-600" />
        </div>
      </div>
    </Card>
  )

  return (
    <Layout>
      <PageHeader 
        title="Dashboard" 
        description={`Bienvenido, ${user?.email || 'Usuario'}`}
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
          <p className="text-slate-600 mt-4">Cargando datos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={FiBox}
              title="Productos"
              value={stats.totalProducts}
              color="border-indigo-500"
            />
            <StatCard
              icon={FiTruck}
              title="Depósitos"
              value={stats.totalWarehouses}
              color="border-green-500"
            />
            <StatCard
              icon={FiUsers}
              title="Usuarios"
              value={stats.totalUsers}
              color="border-amber-500"
            />
            <StatCard
              icon={FiBarChart2}
              title="Stock Bajo"
              value={stats.lowStockItems}
              color="border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-xl font-bold text-secondary mb-4">Acciones Rápidas</h2>
              <div className="space-y-2">
                <Button className="w-full justify-between" variant="outline">
                  <span>Nuevo Producto</span>
                  <FiArrowRight />
                </Button>
                <Button className="w-full justify-between" variant="outline">
                  <span>Registrar Movimiento</span>
                  <FiArrowRight />
                </Button>
                <Button className="w-full justify-between" variant="outline">
                  <span>Hacer Ajuste</span>
                  <FiArrowRight />
                </Button>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold text-secondary mb-4">Información del Sistema</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Versión:</span>
                  <span className="font-semibold">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última Actualización:</span>
                  <span className="font-semibold">{new Date().toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usuario:</span>
                  <span className="font-semibold">{user?.email}</span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </Layout>
  )
}
