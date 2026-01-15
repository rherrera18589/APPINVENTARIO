import React, { useState, useEffect } from 'react'
import { Layout, PageHeader } from '../components/Layout'
import { Card, Button, Input } from '../components/UI'
import { FiPlus, FiDownload } from 'react-icons/fi'
import { inventoryService } from '../services/inventoryService'
import { reportService } from '../services/reportService'
import { useUIStore } from '../store/store'

export const Reports = () => {
  const [stock, setStock] = useState([])
  const [movements, setMovements] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [activeTab, setActiveTab] = useState('stock')
  const [loading, setLoading] = useState(true)
  const { showNotification } = useUIStore()

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      setLoading(true)
      const [stockData, movementsData, adjustmentsData] = await Promise.all([
        inventoryService.getStock(),
        inventoryService.getMovements(),
        inventoryService.getAdjustments(),
      ])
      setStock(stockData)
      setMovements(movementsData)
      setAdjustments(adjustmentsData)
    } catch (error) {
      showNotification('Error cargando reportes', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleExportStock = async () => {
    try {
      const data = reportService.generateInventorySummary(stock)
      await reportService.exportToExcel(data, 'Inventario_')
      showNotification('Reporte exportado a Excel', 'success')
    } catch (error) {
      showNotification('Error exportando reporte', 'error')
    }
  }

  const handleExportMovements = async () => {
    try {
      const data = reportService.generateMovementsReport(movements)
      await reportService.exportToExcel(data, 'Movimientos_')
      showNotification('Reporte exportado a Excel', 'success')
    } catch (error) {
      showNotification('Error exportando reporte', 'error')
    }
  }

  const handleExportPDF = async () => {
    try {
      const data = reportService.generateInventorySummary(stock)
      const columns = ['Producto', 'Depósito', 'Cantidad', 'Última Actualización']
      const bodyData = data.map(item => [
        item.Producto,
        item.Depósito,
        item.Cantidad,
        item['Última Actualización'],
      ])
      await reportService.exportToPDF('Reporte de Inventario', bodyData, columns, 'Inventario_')
      showNotification('Reporte exportado a PDF', 'success')
    } catch (error) {
      showNotification('Error exportando PDF', 'error')
    }
  }

  return (
    <Layout>
      <PageHeader title="Reportes" description="Generación y exportación de reportes" />

      <Card className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded font-semibold transition ${
              activeTab === 'stock'
                ? 'bg-primary text-white'
                : 'bg-light text-secondary hover:bg-gray-200'
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-4 py-2 rounded font-semibold transition ${
              activeTab === 'movements'
                ? 'bg-primary text-white'
                : 'bg-light text-secondary hover:bg-gray-200'
            }`}
          >
            Movimientos
          </button>
          <button
            onClick={() => setActiveTab('adjustments')}
            className={`px-4 py-2 rounded font-semibold transition ${
              activeTab === 'adjustments'
                ? 'bg-primary text-white'
                : 'bg-light text-secondary hover:bg-gray-200'
            }`}
          >
            Ajustes
          </button>
        </div>
      </Card>

      {loading ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">Cargando reportes...</p>
        </Card>
      ) : (
        <>
          {activeTab === 'stock' && (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-secondary">Reporte de Inventario</h2>
                <div className="flex gap-2">
                  <Button onClick={handleExportStock} className="flex items-center gap-2" size="sm">
                    <FiDownload /> Excel
                  </Button>
                  <Button onClick={handleExportPDF} className="flex items-center gap-2" size="sm" variant="success">
                    <FiDownload /> PDF
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Producto</th>
                      <th className="px-4 py-3 text-left font-semibold">Depósito</th>
                      <th className="px-4 py-3 text-left font-semibold">Cantidad</th>
                      <th className="px-4 py-3 text-left font-semibold">Última Act.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stock.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-light transition">
                        <td className="px-4 py-3">{item.product?.name}</td>
                        <td className="px-4 py-3">{item.warehouse?.name}</td>
                        <td className="px-4 py-3 font-semibold">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(item.updated_at).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'movements' && (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-secondary">Reporte de Movimientos</h2>
                <Button onClick={handleExportMovements} className="flex items-center gap-2" size="sm">
                  <FiDownload /> Excel
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                      <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                      <th className="px-4 py-3 text-left font-semibold">Producto</th>
                      <th className="px-4 py-3 text-left font-semibold">Cantidad</th>
                      <th className="px-4 py-3 text-left font-semibold">Origen/Destino</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-light transition">
                        <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString('es-ES')}</td>
                        <td className="px-4 py-3">{item.type}</td>
                        <td className="px-4 py-3">{item.product?.name}</td>
                        <td className="px-4 py-3 font-semibold">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm">
                          {item.from_warehouse?.name} → {item.to_warehouse?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'adjustments' && (
            <Card>
              <h2 className="text-xl font-bold text-secondary mb-6">Reporte de Ajustes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                      <th className="px-4 py-3 text-left font-semibold">Producto</th>
                      <th className="px-4 py-3 text-left font-semibold">Anterior</th>
                      <th className="px-4 py-3 text-left font-semibold">Nueva</th>
                      <th className="px-4 py-3 text-left font-semibold">Diferencia</th>
                      <th className="px-4 py-3 text-left font-semibold">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adjustments.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-light transition">
                        <td className="px-4 py-3">{new Date(item.created_at).toLocaleDateString('es-ES')}</td>
                        <td className="px-4 py-3">{item.product?.name}</td>
                        <td className="px-4 py-3">{item.previous_quantity}</td>
                        <td className="px-4 py-3">{item.new_quantity}</td>
                        <td className="px-4 py-3 font-semibold">
                          {item.new_quantity - item.previous_quantity >= 0 ? '+' : ''}
                          {item.new_quantity - item.previous_quantity}
                        </td>
                        <td className="px-4 py-3 text-sm">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </Layout>
  )
}
