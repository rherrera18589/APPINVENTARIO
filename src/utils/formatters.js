// Formatear fecha
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES')
}

// Formatear fecha y hora
export const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('es-ES')
}

// Formatear moneda
export const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

// Formatear número
export const formatNumber = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('es-ES').format(value)
}

// Truncar texto
export const truncateText = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Capitalizar primer carácter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Validar email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validar contraseña (al menos 8 caracteres, 1 mayúscula, 1 número)
export const validatePassword = (password) => {
  const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/
  return re.test(password)
}

// Generar ID único
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Comparar objetos
export const objectsEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

// Clonar objeto profundo
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

// Obtener iniciales del nombre
export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}
