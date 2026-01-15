# Guía de Instalación - AppInventario

## 📋 Requisitos Previos

- Node.js 16+ instalado
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)
- Git (opcional)

## 🚀 Paso a Paso de Instalación

### 1. Preparar el Proyecto

```bash
# Navegar a la carpeta del proyecto
cd c:\Users\USUARIO\Desktop\APPINVENTARIO

# Instalar dependencias
npm install
```

### 2. Configurar Supabase

#### 2.1 Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se inicialice
5. Ve a Settings > API para obtener:
   - URL del proyecto
   - Clave anónima (anon key)

#### 2.2 Crear Tablas de Base de Datos

1. En el dashboard de Supabase, ve a SQL Editor
2. Copia el contenido de `DATABASE_SCHEMA.sql`
3. Pégalo en el editor SQL y ejecuta
4. Verifica que se crearon todas las tablas

#### 2.3 Configurar Variables de Entorno

```bash
# Crear archivo .env.local
cp .env.example .env.local
```

Edita `.env.local`:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

**Nota:** Reemplaza los valores con los de tu proyecto Supabase

### 3. Crear Usuarios de Prueba (Opcional)

En Supabase Authentication:

1. Ve a Authentication > Users
2. Haz clic en "Add user"
3. Email: `admin@test.com` Password: `Test123456`
4. Repite para más usuarios si lo deseas

### 4. Iniciar la Aplicación

```bash
# Desarrollo
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🔐 Primeros Pasos

1. **Iniciar Sesión**
   - Email: `admin@test.com`
   - Password: `Test123456`

2. **Crear un Producto**
   - Ve a Productos
   - Haz clic en "Nuevo Producto"
   - Completa los datos (nombre, SKU, unidad)
   - Guarda

3. **Crear un Depósito**
   - Ve a Depósitos
   - Haz clic en "Nuevo Depósito"
   - Agrega nombre y ubicación
   - Guarda

4. **Registrar Stock**
   - El stock se gestiona a través de movimientos
   - Ve a Movimientos para crear traspasos

## 📊 Características Principales

### Dashboard
- Resumen de datos
- Estadísticas rápidas
- Acciones rápidas

### Productos
- CRUD de productos
- Gestión de SKU
- Información de costo

### Depósitos
- Gestión de almacenes
- Ubicación y capacidad
- Control de ubicaciones

### Movimientos
- Traspasos entre depósitos
- Salidas a producción
- Reingresos de producto
- Historial completo

### Reportes
- Exportación a Excel
- Exportación a PDF
- Múltiples tipos de reportes

### Usuarios
- Gestión de usuarios
- Asignación de roles
- Control de acceso

## 🛠️ Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
npm install
```

### Error: "VITE_SUPABASE_URL is not defined"
- Verifica que `.env.local` existe
- Verifica que tiene las variables correctas
- Reinicia el servidor (Ctrl+C y `npm run dev`)

### Error: "Conexión rechazada a Supabase"
- Verifica que las variables de entorno son correctas
- Comprueba que tu proyecto Supabase está activo
- Verifica la conectividad de internet

### Error: "Tabla no existe"
- Ejecuta el script SQL (`DATABASE_SCHEMA.sql`) en Supabase
- Verifica que todas las tablas fueron creadas

## 📁 Estructura del Proyecto

```
app-inventario/
├── src/
│   ├── components/       # Componentes React
│   ├── config/          # Configuración (Supabase)
│   ├── pages/           # Páginas principales
│   ├── services/        # Servicios API
│   ├── store/           # Estado global (Zustand)
│   ├── utils/           # Utilidades
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example         # Variables de entorno (ejemplo)
├── .gitignore
├── DATABASE_SCHEMA.sql  # Script SQL
├── package.json
├── README.md
├── tailwind.config.js
├── vite.config.js
└── index.html
```

## 🔐 Consideraciones de Seguridad

1. **Nunca** compartir las claves de Supabase
2. **Nunca** hacer commit de `.env.local`
3. Usar Row Level Security (RLS) en producción
4. Validar entrada de usuarios en el backend
5. Usar HTTPS en producción

## 📈 Próximos Pasos

1. Personalizar colores en `tailwind.config.js`
2. Agregar logo de tu empresa
3. Implementar roles y permisos completos
4. Agregar notificaciones por email
5. Implementar backup automático

## 🤝 Soporte

Para dudas o problemas:
1. Revisa el archivo README.md
2. Consulta la documentación de Supabase
3. Consulta la documentación de React

## 📚 Recursos Útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com)
- [Documentación de Vite](https://vitejs.dev)

---

¡Tu aplicación está lista para usar! 🎉
