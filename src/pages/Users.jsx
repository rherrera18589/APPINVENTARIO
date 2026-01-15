import React, { useState, useEffect } from 'react'
import { Layout, PageHeader, FormGroup, Modal } from '../components/Layout'
import { Card, Button, Input, Table, Badge } from '../components/UI'
import { FiPlus, FiEdit2, FiSearch } from 'react-icons/fi'
import { userService } from '../services/userService'
import { useUIStore } from '../store/store'

export const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'user',
  })
  const { showNotification } = useUIStore()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getUsers()
      setUsers(data)
    } catch (error) {
      showNotification('Error cargando usuarios', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await userService.updateProfile(editingId, formData)
        showNotification('Usuario actualizado', 'success')
      }
      setShowModal(false)
      setEditingId(null)
      setFormData({ full_name: '', email: '', role: 'user' })
      loadUsers()
    } catch (error) {
      showNotification('Error guardando usuario', 'error')
    }
  }

  const handleEdit = (user) => {
    setFormData(user)
    setEditingId(user.id)
    setShowModal(true)
  }

  const handleDeactivate = async (userId) => {
    if (window.confirm('¿Desactivar este usuario?')) {
      try {
        await userService.deactivateUser(userId)
        showNotification('Usuario desactivado', 'success')
        loadUsers()
      } catch (error) {
        showNotification('Error desactivando usuario', 'error')
      }
    }
  }

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Nombre Completo' },
    {
      key: 'role',
      label: 'Rol',
      render: (row) => <Badge variant="info">{row.role}</Badge>,
    },
    {
      key: 'is_active',
      label: 'Estado',
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'danger'}>
          {row.is_active ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
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
      <PageHeader title="Usuarios" description="Gestión de usuarios del sistema" />

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">Cargando usuarios...</p>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600">No hay usuarios registrados</p>
        </Card>
      ) : (
        <Card>
          <Table columns={columns} data={filteredUsers} />
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingId(null)
        }}
        title="Editar Usuario"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="Nombre Completo">
            <Input
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Nombre completo"
            />
          </FormGroup>

          <FormGroup label="Email">
            <Input
              type="email"
              value={formData.email || ''}
              disabled
              className="bg-gray-100"
            />
          </FormGroup>

          <FormGroup label="Rol">
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
              <option value="viewer">Visualizador</option>
            </select>
          </FormGroup>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Actualizar
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
