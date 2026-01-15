# ✅ Checklist de Configuración - AppInventario

## 📋 Antes de Iniciar el Proyecto

Use este checklist para asegurar que todo está configurado correctamente.

### 1️⃣ Preparación del Proyecto

- [ ] Proyecto descargado/clonado en `c:\Users\USUARIO\Desktop\APPINVENTARIO`
- [ ] Node.js 16+ instalado (`node -v` en terminal)
- [ ] npm instalado (`npm -v` en terminal)
- [ ] Acceso a internet disponible

### 2️⃣ Instalación de Dependencias

- [ ] Ejecutado `npm install` exitosamente
- [ ] Carpeta `node_modules` creada
- [ ] `package-lock.json` generado

### 3️⃣ Configuración de Supabase

#### Crear Proyecto en Supabase
- [ ] Cuenta creada en [supabase.com](https://supabase.com)
- [ ] Proyecto nuevo creado
- [ ] Proyecto inicializado y listo

#### Obtener Credenciales
- [ ] Ir a: Settings > API
- [ ] Copiar: Project URL
- [ ] Copiar: anon (public) key
- [ ] Guardar en lugar seguro

#### Configurar Base de Datos
- [ ] Abrir SQL Editor en Supabase
- [ ] Copiar contenido de `DATABASE_SCHEMA.sql`
- [ ] Ejecutar script SQL
- [ ] Verificar creación de tablas:
  - [ ] `profiles`
  - [ ] `products`
  - [ ] `warehouses`
  - [ ] `stock`
  - [ ] `movements`
  - [ ] `adjustments`

#### Crear Usuarios de Prueba
- [ ] Ir a: Authentication > Users
- [ ] Crear usuario: `admin@test.com` / `Test123456`
- [ ] Crear usuario: `user@test.com` / `Test123456` (opcional)

### 4️⃣ Variables de Entorno

- [ ] Copiar `.env.example` a `.env.local`
- [ ] Abrir `.env.local` en editor
- [ ] Reemplazar `VITE_SUPABASE_URL` con URL del proyecto
- [ ] Reemplazar `VITE_SUPABASE_ANON_KEY` con la clave anónima
- [ ] Verificar que NO tenga espacios extra
- [ ] Guardar archivo

Ejemplo correcto:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 5️⃣ Verificación Inicial

- [ ] Terminal abierta en la carpeta del proyecto
- [ ] Ejecutar: `npm run dev`
- [ ] App abrió en `http://localhost:3000`
- [ ] Pantalla de login visible

### 6️⃣ Prueba de Login

- [ ] Ingresar email: `admin@test.com`
- [ ] Ingresar password: `Test123456`
- [ ] Click en "Iniciar Sesión"
- [ ] Dashboard cargó exitosamente
- [ ] Ver: "Bienvenido, admin@test.com"

### 7️⃣ Prueba de Navegación

- [ ] Click en "Productos" - Abre página
- [ ] Click en "Depósitos" - Abre página
- [ ] Click en "Movimientos" - Abre página
- [ ] Click en "Reportes" - Abre página
- [ ] Click en "Usuarios" - Abre página
- [ ] Click en "Inicio" - Vuelve al dashboard

### 8️⃣ Prueba de Funcionalidades

#### Crear Producto
- [ ] Ir a Productos
- [ ] Click "Nuevo Producto"
- [ ] Llenar datos:
  - [ ] Nombre: "Producto Test"
  - [ ] SKU: "TEST-001"
  - [ ] Unidad: "unidad"
  - [ ] Costo: "100"
- [ ] Click "Crear"
- [ ] Producto aparece en lista

#### Crear Depósito
- [ ] Ir a Depósitos
- [ ] Click "Nuevo Depósito"
- [ ] Llenar datos:
  - [ ] Nombre: "Almacén Principal"
  - [ ] Ubicación: "Piso 1"
  - [ ] Capacidad: "1000"
- [ ] Click "Crear"
- [ ] Depósito aparece en lista

#### Crear Movimiento
- [ ] Ir a Movimientos
- [ ] Click "Nuevo Movimiento"
- [ ] Llenar datos:
  - [ ] Tipo: "Traspaso entre depósitos"
  - [ ] Producto: (el que creamos)
  - [ ] Cantidad: "10"
  - [ ] Desde: (depósito que creamos)
  - [ ] Hacia: (otro depósito)
- [ ] Click "Registrar"
- [ ] Movimiento aparece en historial

#### Exportar Reporte
- [ ] Ir a Reportes
- [ ] Click "Excel" en sección Inventario
- [ ] Archivo .xlsx se descargó
- [ ] Click "PDF"
- [ ] Archivo .pdf se descargó

### 9️⃣ Logout y Nuevo Login

- [ ] Click en "Salir"
- [ ] Redirigido a página de login
- [ ] Ingresar con otro usuario si creaste
- [ ] Verificar que funciona login

### 🔟 Limpieza Final

- [ ] Cerrar aplicación (Ctrl+C)
- [ ] Verificar que no hay errores en consola
- [ ] Revisar archivo `.gitignore`
- [ ] NO hacer commit de `.env.local`

---

## 🚨 Troubleshooting Rápido

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
# Solución:
npm install
npm run dev
```

### Error: "VITE_SUPABASE_URL is undefined"
```bash
# Verificar:
1. .env.local existe
2. Variables están correctas
3. No hay espacios extra
4. Restart: Ctrl+C y npm run dev
```

### Error: "Connection refused" a Supabase
```bash
# Verificar:
1. URL del proyecto es correcta
2. Internet está funcionando
3. Proyecto Supabase está activo
```

### Tablas no existen
```bash
# Solución:
1. Ir a Supabase SQL Editor
2. Ejecutar: DATABASE_SCHEMA.sql
3. Esperar a que complete
4. Refresh: npm run dev
```

### Problemas de CORS
```bash
# Supabase maneja CORS automáticamente
# Si persiste:
1. Verificar que la URL es correcta
2. Verificar que la clave es válida
3. Crear nuevo proyecto si es necesario
```

---

## 📞 Contacto y Soporte

Si encuentras problemas:

1. ✅ Revisa esta lista completa
2. ✅ Consulta `INSTALLATION_GUIDE.md`
3. ✅ Consulta `PROJECT_SUMMARY.md`
4. ✅ Revisa la consola del navegador (F12)
5. ✅ Revisa la terminal de desarrollo

---

## ✨ ¡Todo Listo!

Si completaste todos los puntos de esta lista, tu aplicación está:

- ✅ Instalada correctamente
- ✅ Configurada con Supabase
- ✅ Funcionando correctamente
- ✅ Lista para usar
- ✅ Lista para desarrollo

**¡Puedes comenzar a desarrollar!** 🚀

---

**Checklist creado:** 13 de Enero de 2026
