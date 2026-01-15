# AppInventario - Sistema de Gestión de Inventario

Sistema moderno y escalable para gestión de inventario con React, Supabase y Tailwind CSS.

## 🎯 Características

- ✅ Autenticación de usuarios con Supabase
- ✅ Gestión de productos y depósitos
- ✅ Control de stock en múltiples ubicaciones
- ✅ Movimientos entre depósitos
- ✅ Salidas a producción y reingresos
- ✅ Ajustes de inventario
- ✅ Reportes con exportación a Excel y PDF
- ✅ Gestión de usuarios y roles
- ✅ Interfaz moderna y responsiva
- ✅ Almacenamiento en Supabase

## 🛠️ Tecnologías

- **Frontend**: React 18.2 + Vite
- **Estilos**: Tailwind CSS + React Icons
- **Base de Datos**: Supabase (PostgreSQL)
- **Exportación**: XLSX, jsPDF
- **Estado**: Zustand
- **Routing**: React Router v6

## 📦 Instalación

### Requisitos previos
- Node.js 16+
- npm o yarn
- Cuenta en Supabase

### Pasos

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd app-inventario
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

4. **Crear tablas en Supabase**

Ejecuta el siguiente SQL en tu base de datos Supabase:

```sql
-- Tabla de perfiles/usuarios
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  description TEXT,
  unit TEXT DEFAULT 'unidad',
  cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de depósitos
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  capacity INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de stock
CREATE TABLE stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, warehouse_id)
);

-- Tabla de movimientos
CREATE TABLE movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'transfer', 'production_output', 'return'
  product_id UUID NOT NULL REFERENCES products ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  from_warehouse_id UUID REFERENCES warehouses ON DELETE SET NULL,
  to_warehouse_id UUID REFERENCES warehouses ON DELETE SET NULL,
  notes TEXT,
  created_by UUID REFERENCES profiles ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ajustes
CREATE TABLE adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses ON DELETE CASCADE,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES profiles ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_stock_product ON stock(product_id);
CREATE INDEX idx_stock_warehouse ON stock(warehouse_id);
CREATE INDEX idx_movements_product ON movements(product_id);
CREATE INDEX idx_movements_created_at ON movements(created_at);
CREATE INDEX idx_adjustments_product ON adjustments(product_id);
CREATE INDEX idx_adjustments_warehouse ON adjustments(warehouse_id);
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx
│   ├── Notification.jsx
│   ├── UI.jsx          # Componentes base (Button, Input, etc)
│   └── Layout.jsx
├── config/             # Configuración
│   └── supabase.js
├── pages/              # Páginas/vistas
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   └── Reports.jsx
├── services/           # Servicios API
│   ├── authService.js
│   ├── inventoryService.js
│   ├── userService.js
│   └── reportService.js
├── store/              # Estado global (Zustand)
│   └── store.js
├── utils/              # Utilidades
│   └── formatters.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Vista previa de build
npm run preview

# Lint
npm run lint
```

## 📊 Funcionalidades Principales

### 1. Dashboard
- Resumen de estadísticas
- Productos, depósitos y usuarios activos
- Items con stock bajo
- Acciones rápidas

### 2. Gestión de Productos
- CRUD completo de productos
- SKU único
- Unidades de medida
- Información de costo

### 3. Movimientos de Inventario
- Traspasos entre depósitos
- Salidas a producción
- Reingresos
- Historial de movimientos

### 4. Ajustes
- Ajustes de cantidad
- Motivos de ajuste
- Auditoría de cambios

### 5. Reportes y Exportación
- Reporte de inventario
- Reporte de movimientos
- Reporte de ajustes
- Exportación a Excel
- Exportación a PDF

### 6. Gestión de Usuarios
- Registro y autenticación
- Gestión de roles
- Activación/desactivación de usuarios

## 🔒 Seguridad

- Autenticación mediante Supabase Auth
- Row Level Security (RLS) en Supabase
- Validación de formularios
- Protección de rutas

## 📝 Notas de Desarrollo

- Las variables de entorno deben estar en `.env.local`
- No incluir secrets en el código
- Usar el cliente de Supabase para consultas
- Implementar RLS en Supabase para máxima seguridad

## 🤝 Contribuciones

Este es un proyecto escalable. Para agregar nuevas funcionalidades:

1. Crear un nuevo service en `src/services/`
2. Crear nuevas páginas en `src/pages/`
3. Crear componentes reutilizables en `src/components/`
4. Actualizar las rutas en `App.jsx`

## 📄 Licencia

Este proyecto está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Proyecto de gestión de inventario - 2026
