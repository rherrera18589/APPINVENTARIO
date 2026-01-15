# Documentación de Servicios - AppInventario

## 📚 Servicios Disponibles

### 1. AuthService

Maneja toda la autenticación de usuarios.

#### Métodos

```javascript
// Registrar nuevo usuario
await authService.signup(email, password)
// Returns: { user, session }

// Iniciar sesión
await authService.signin(email, password)
// Returns: { user, session }

// Cerrar sesión
await authService.signout()

// Obtener usuario actual
await authService.getCurrentUser()
// Returns: user object

// Restablecer contraseña
await authService.resetPassword(email)

// Cambiar contraseña
await authService.updatePassword(newPassword)

// Escuchar cambios de autenticación
authService.onAuthStateChange((event, session) => {
  // Callback cuando cambia el estado
})
```

### 2. InventoryService

Gestiona productos, depósitos, stock y movimientos.

#### Métodos de Productos

```javascript
// Obtener todos los productos
const products = await inventoryService.getProducts()

// Obtener producto por ID
const product = await inventoryService.getProductById(id)

// Crear producto
const newProduct = await inventoryService.createProduct({
  name: 'Producto X',
  sku: 'PROD-001',
  description: 'Descripción',
  unit: 'unidad',
  cost: 100.50
})

// Actualizar producto
const updated = await inventoryService.updateProduct(id, { name: 'Nuevo nombre' })

// Eliminar producto
await inventoryService.deleteProduct(id)
```

#### Métodos de Depósitos

```javascript
// Obtener todos los depósitos
const warehouses = await inventoryService.getWarehouses()

// Crear depósito
const newWarehouse = await inventoryService.createWarehouse({
  name: 'Almacén Principal',
  location: 'Ubicación',
  capacity: 1000
})

// Actualizar depósito
const updated = await inventoryService.updateWarehouse(id, { capacity: 2000 })
```

#### Métodos de Stock

```javascript
// Obtener stock de todos los productos
const stock = await inventoryService.getStock()

// Obtener stock de un depósito específico
const warehouseStock = await inventoryService.getStock(warehouseId)

// Obtener stock de un producto en un depósito
const itemStock = await inventoryService.getStockByProductAndWarehouse(productId, warehouseId)

// Actualizar cantidad en stock
const updated = await inventoryService.updateStock(productId, warehouseId, quantity)
```

#### Métodos de Movimientos

```javascript
// Obtener movimientos
const movements = await inventoryService.getMovements()

// Obtener movimientos filtrados
const filtered = await inventoryService.getMovements({
  type: 'transfer',
  warehouseId: 'xxx',
  productId: 'yyy'
})

// Crear movimiento
const newMovement = await inventoryService.createMovement({
  type: 'transfer', // 'transfer', 'production_output', 'return'
  product_id: 'xxx',
  quantity: 10,
  from_warehouse_id: 'xxx',
  to_warehouse_id: 'yyy',
  notes: 'Observaciones',
  created_by: userId
})
```

#### Métodos de Ajustes

```javascript
// Obtener todos los ajustes
const adjustments = await inventoryService.getAdjustments()

// Crear ajuste
const newAdjustment = await inventoryService.createAdjustment({
  product_id: 'xxx',
  warehouse_id: 'yyy',
  previous_quantity: 100,
  new_quantity: 95,
  reason: 'Rotura detectada',
  created_by: userId
})
```

### 3. UserService

Gestiona perfiles y roles de usuarios.

#### Métodos

```javascript
// Obtener todos los usuarios
const users = await userService.getUsers()

// Obtener usuario por ID
const user = await userService.getUserById(userId)

// Crear perfil
const profile = await userService.createProfile(userId, {
  full_name: 'Juan Pérez',
  email: 'juan@example.com',
  role: 'user'
})

// Actualizar perfil
const updated = await userService.updateProfile(userId, {
  full_name: 'Juan Carlos Pérez'
})

// Cambiar rol
const updated = await userService.updateUserRole(userId, 'admin')

// Desactivar usuario
const deactivated = await userService.deactivateUser(userId)

// Activar usuario
const activated = await userService.activateUser(userId)
```

### 4. ReportService

Genera y exporta reportes.

#### Métodos

```javascript
// Exportar a Excel
await reportService.exportToExcel(data, fileName, sheetName)
// Crea un archivo .xlsx con los datos

// Exportar a PDF
await reportService.exportToPDF(title, data, columns, fileName)
// Crea un PDF con tabla de datos

// Exportar HTML a PDF
await reportService.exportHTMLToPDF(elementId, fileName)
// Convierte un elemento HTML a PDF

// Generar resumen de inventario
const summary = reportService.generateInventorySummary(stock)
// Returns: Array de objetos formateados

// Generar reporte de movimientos
const movements = reportService.generateMovementsReport(movements)
// Returns: Array de movimientos formateados

// Generar reporte de ajustes
const adjustments = reportService.generateAdjustmentsReport(adjustments)
// Returns: Array de ajustes formateados
```

## 🏪 Estado Global (Zustand Store)

### useAuthStore

```javascript
import { useAuthStore } from '../store/store'

const { 
  user,              // Usuario actual
  loading,           // Estado de carga
  error,             // Errores
  setUser,           // Setter
  setLoading,
  setError,
  clearError,
  logout
} = useAuthStore()
```

### useInventoryStore

```javascript
import { useInventoryStore } from '../store/store'

const {
  products,
  warehouses,
  stock,
  movements,
  adjustments,
  loading,
  error,
  setProducts,
  setWarehouses,
  setStock,
  setMovements,
  setAdjustments,
  setLoading,
  setError,
  clearError
} = useInventoryStore()
```

### useUIStore

```javascript
import { useUIStore } from '../store/store'

const {
  showModal,         // Modal visible?
  modalType,         // Tipo de modal
  selectedItem,      // Item seleccionado
  notification,      // Notificación actual
  openModal,         // Abrir modal
  closeModal,        // Cerrar modal
  showNotification,  // Mostrar notificación
  clearNotification
} = useUIStore()
```

## 🎨 Componentes UI

### Componentes Base

```javascript
import { Button, Input, Select, Badge, Card, Table } from '../components/UI'

// Button
<Button variant="primary" size="md" onClick={handleClick}>
  Clickear
</Button>

// Input
<Input 
  type="text"
  placeholder="Ingresa texto"
  value={value}
  onChange={handleChange}
/>

// Select
<Select 
  options={[
    { value: 'opt1', label: 'Opción 1' },
    { value: 'opt2', label: 'Opción 2' }
  ]}
  onChange={handleChange}
/>

// Badge
<Badge variant="success">Activo</Badge>

// Card
<Card className="additional-class">
  Contenido
</Card>

// Table
<Table 
  columns={[
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' }
  ]}
  data={data}
/>
```

### Componentes de Layout

```javascript
import { Layout, PageHeader, FormGroup, Modal, Alert, Grid } from '../components/Layout'

// Layout
<Layout>
  Contenido principal
</Layout>

// PageHeader
<PageHeader 
  title="Título"
  description="Descripción opcional"
/>

// FormGroup
<FormGroup label="Campo" required error={error}>
  <Input />
</FormGroup>

// Modal
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Título del Modal"
  size="md"
>
  Contenido
</Modal>

// Alert
<Alert 
  type="success"
  message="Mensaje"
  onClose={handleClose}
/>

// Grid
<Grid cols={3} gap={4}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</Grid>
```

## 🔧 Utilidades

### Formatters

```javascript
import { formatDate, formatCurrency, validateEmail, capitalize, generateId } from '../utils/formatters'

// Formatear fecha
const date = formatDate(new Date()) // "13/01/2026"

// Formatear moneda
const money = formatCurrency(100) // "$100.00"

// Validar email
const isValid = validateEmail('test@example.com') // true/false

// Capitalizar
const text = capitalize('hola') // "Hola"

// Generar ID único
const id = generateId() // "1234567890-abc123xyz"

// Y más...
```

## 📝 Patrones de Uso

### Cargar datos y actualizar estado

```javascript
import { useEffect, useState } from 'react'
import { inventoryService } from '../services/inventoryService'
import { useUIStore } from '../store/store'

export function MyComponent() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { showNotification } = useUIStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const result = await inventoryService.getProducts()
      setData(result)
    } catch (error) {
      showNotification('Error cargando datos', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    // JSX aquí
  )
}
```

### Crear/Actualizar con formulario

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    if (editingId) {
      await inventoryService.updateProduct(editingId, formData)
      showNotification('Actualizado', 'success')
    } else {
      await inventoryService.createProduct(formData)
      showNotification('Creado', 'success')
    }
    setFormData({}) // Reset
    loadData() // Reload
  } catch (error) {
    showNotification('Error', 'error')
  }
}
```

## ⚠️ Manejo de Errores

Todos los servicios lanzan errores que pueden ser capturados:

```javascript
try {
  const result = await inventoryService.getProducts()
} catch (error) {
  console.error('Error:', error.message)
  // Mostrar notificación al usuario
}
```

## 🚀 Tips y Buenas Prácticas

1. **Siempre usar try-catch** al llamar servicios
2. **Mostrar loading** mientras se cargan datos
3. **Validar entrada** antes de enviar al servidor
4. **Usar estado global** para datos compartidos
5. **Limpiar componentes** con cleanup en useEffect
6. **Reutilizar componentes** UI cuando sea posible
7. **Documentar cambios** en la base de datos

---

¡Más información en los archivos de los servicios! 📖
