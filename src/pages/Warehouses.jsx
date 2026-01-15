import React, { useState, useEffect } from 'react'
import { Layout, PageHeader, FormGroup, Modal } from '../components/Layout'
import { Card, Button, Input, Table } from '../components/UI'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { inventoryService } from '../services/inventoryService'
import { useUIStore } from '../store/store'

export const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 0,
  })
  const { showNotification } = useUIStore()

  useEffect(() => {
    loadWarehouses()
  }, [])

  const loadWarehouses = async () => {
    try {
      setLoading(true)
      const data = await inventoryService.getWarehouses()
      setWarehouses(data)
    } catch (error) {
      showNotification('Error cargando depósitos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await inventoryService.updateWarehouse(editingId, formData)
        showNotification('Depósito actualizado', 'success')
      } else {
        await inventoryService.createWarehouse(formData)
        showNotification('Depósito creado', 'success')
      }
      setShowModal(false)
      setEditingId(null)
      setFormData({ name: '', location: '', capacity: 0 })
      loadWarehouses()
    } catch (error) {
      showNotification('Error guardando depósito', 'error')
    }
  }

  const handleEdit = (warehouse) => {
    setFormData(warehouse)
    setEditingId(warehouse.id)
    setShowModal(true)
  }

  const filteredWarehouses = warehouses.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.location.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'location', label: 'Ubicación' },
    { key: 'capacity', label: 'Capacidad' },
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
        </div>
      ),
    },
  ]

  return (
    <Layout>
      <PageHeader title="Depósitos" description="Gestión de depósitos y almacenes" />

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o ubicación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setFormData({ name: '', location: '', capacity: 0 })
              setShowModal(true)
            }}
            className="flex items-center gap-2"
          >
            <FiPlus /> Nuevo Depósito
          </Button>
        </div>
      </Card>

      {loading ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">Cargando depósitos...</p>
        </Card>
      ) : filteredWarehouses.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">No hay depósitos registrados</p>
        </Card>
      ) : (
        <Card>
          <Table columns={columns} data={filteredWarehouses} />
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingId(null)
        }}
        title={editingId ? 'Editar Depósito' : 'Nuevo Depósito'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Nombre" required>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del depósito"
              required
            />
          </FormGroup>

          <FormGroup label="Ubicación">
            <Input
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ubicación del depósito"
            />
          </FormGroup>

          <FormGroup label="Capacidad">
            <Input
              type="number"
              value={formData.capacity || 0}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              placeholder="Capacidad"
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
