import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, PageHeader, FormGroup, Modal } from '../components/Layout'
import { Card, Button, Input, Table, Badge } from '../components/UI'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { inventoryService } from '../services/inventoryService'
import { useUIStore } from '../store/store'

export const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    unit: 'unidad',
    cost: 0,
  })
  const { showNotification } = useUIStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await inventoryService.getProducts()
      setProducts(data)
    } catch (error) {
      showNotification('Error cargando productos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await inventoryService.updateProduct(editingId, formData)
        showNotification('Producto actualizado', 'success')
      } else {
        await inventoryService.createProduct(formData)
        showNotification('Producto creado', 'success')
      }
      setShowModal(false)
      setEditingId(null)
      setFormData({ name: '', sku: '', description: '', unit: 'unidad', cost: 0 })
      loadProducts()
    } catch (error) {
      showNotification('Error guardando producto', 'error')
    }
  }

  const handleEdit = (product) => {
    setFormData(product)
    setEditingId(product.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await inventoryService.deleteProduct(id)
        showNotification('Producto eliminado', 'success')
        loadProducts()
      } catch (error) {
        showNotification('Error eliminando producto', 'error')
      }
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'sku', label: 'SKU' },
    { key: 'unit', label: 'Unidad' },
    { key: 'cost', label: 'Costo' },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-primary hover:text-blue-600"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-danger hover:text-red-600"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ]

  return (
    <Layout>
      <PageHeader title="Productos" description="Gestión de productos del inventario" />

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setFormData({ name: '', sku: '', description: '', unit: 'unidad', cost: 0 })
              setShowModal(true)
            }}
            className="flex items-center gap-2"
          >
            <FiPlus /> Nuevo Producto
          </Button>
        </div>
      </Card>

      {loading ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">Cargando productos...</p>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">No hay productos registrados</p>
        </Card>
      ) : (
        <Card>
          <Table columns={columns} data={filteredProducts} />
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingId(null)
        }}
        title={editingId ? 'Editar Producto' : 'Nuevo Producto'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Nombre" required>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del producto"
              required
            />
          </FormGroup>

          <FormGroup label="SKU" required>
            <Input
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="Código SKU"
              required
            />
          </FormGroup>

          <FormGroup label="Descripción">
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del producto"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows="3"
            />
          </FormGroup>

          <FormGroup label="Unidad" required>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="unidad">Unidad</option>
              <option value="kg">Kilogramo</option>
              <option value="litro">Litro</option>
              <option value="metro">Metro</option>
            </select>
          </FormGroup>

          <FormGroup label="Costo">
            <Input
              type="number"
              value={formData.cost || 0}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              step="0.01"
            />
          </FormGroup>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowModal(false)
                setEditingId(null)
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
