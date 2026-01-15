import React, { useState, useEffect } from 'react'
import { Layout, PageHeader, FormGroup, Modal } from '../components/Layout'
import { Card, Button, Input, Table, Badge } from '../components/UI'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { inventoryService } from '../services/inventoryService'
import { useAuthStore, useUIStore } from '../store/store'
import { formatDate } from '../utils/formatters'

export const Movements = () => {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    type: 'transfer',
    product_id: '',
    quantity: 0,
    from_warehouse_id: '',
    to_warehouse_id: '',
    notes: '',
  })
  const { user } = useAuthStore()
  const { showNotification } = useUIStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [movementsData, productsData, warehousesData] = await Promise.all([
        inventoryService.getMovements(),
        inventoryService.getProducts(),
        inventoryService.getWarehouses(),
      ])
      setMovements(movementsData)
      setProducts(productsData)
      setWarehouses(warehousesData)
    } catch (error) {
      showNotification('Error cargando datos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await inventoryService.createMovement({
        ...formData,
        created_by: user.id,
      })

      // Actualizar stock
      if (formData.type === 'transfer') {
        const fromStock = await inventoryService.getStockByProductAndWarehouse(
          formData.product_id,
          formData.from_warehouse_id
        )
        if (fromStock) {
          await inventoryService.updateStock(
            formData.product_id,
            formData.from_warehouse_id,
            fromStock.quantity - formData.quantity
          )
        }

        const toStock = await inventoryService.getStockByProductAndWarehouse(
          formData.product_id,
          formData.to_warehouse_id
        )
        const newQty = (toStock?.quantity || 0) + formData.quantity
        await inventoryService.updateStock(formData.product_id, formData.to_warehouse_id, newQty)
      }

      showNotification('Movimiento registrado', 'success')
      setShowModal(false)
      setFormData({
        type: 'transfer',
        product_id: '',
        quantity: 0,
        from_warehouse_id: '',
        to_warehouse_id: '',
        notes: '',
      })
      loadData()
    } catch (error) {
      showNotification('Error registrando movimiento', 'error')
    }
  }

  const filteredMovements = movements.filter(m =>
    m.product?.name.toLowerCase().includes(search.toLowerCase())
  )

  const getMovementBadgeColor = (type) => {
    switch (type) {
      case 'transfer':
        return 'info'
      case 'production_output':
        return 'warning'
      case 'return':
        return 'success'
      default:
        return 'info'
    }
  }

  const columns = [
    { 
      key: 'created_at',
      label: 'Fecha',
      render: (row) => formatDate(row.created_at),
    },
    { 
      key: 'type',
      label: 'Tipo',
      render: (row) => <Badge variant={getMovementBadgeColor(row.type)}>{row.type}</Badge>,
    },
    { 
      key: 'product',
      label: 'Producto',
      render: (row) => row.product?.name,
    },
    { key: 'quantity', label: 'Cantidad' },
    {
      key: 'warehouses',
      label: 'Movimiento',
      render: (row) => (
        <span className="text-sm">
          {row.from_warehouse?.name} → {row.to_warehouse?.name}
        </span>
      ),
    },
  ]

  return (
    <Layout>
      <PageHeader title="Movimientos" description="Registro de movimientos de inventario" />

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Buscar por producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <FiPlus /> Nuevo Movimiento
          </Button>
        </div>
      </Card>

      {loading ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">Cargando movimientos...</p>
        </Card>
      ) : filteredMovements.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">No hay movimientos registrados</p>
        </Card>
      ) : (
        <Card>
          <Table columns={columns} data={filteredMovements} />
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nuevo Movimiento"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Tipo de Movimiento" required>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="transfer">Traspaso entre depósitos</option>
              <option value="production_output">Salida a producción</option>
              <option value="return">Reingreso</option>
            </select>
          </FormGroup>

          <FormGroup label="Producto" required>
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Seleccionar producto...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="Cantidad" required>
            <Input
              type="number"
              value={formData.quantity || 0}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              placeholder="0"
              required
              min="1"
            />
          </FormGroup>

          {formData.type === 'transfer' && (
            <>
              <FormGroup label="Desde Depósito" required>
                <select
                  value={formData.from_warehouse_id}
                  onChange={(e) => setFormData({ ...formData, from_warehouse_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seleccionar depósito...</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label="Hacia Depósito" required>
                <select
                  value={formData.to_warehouse_id}
                  onChange={(e) => setFormData({ ...formData, to_warehouse_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seleccionar depósito...</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </FormGroup>
            </>
          )}

          <FormGroup label="Notas">
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observaciones del movimiento"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows="3"
            />
          </FormGroup>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Registrar
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
