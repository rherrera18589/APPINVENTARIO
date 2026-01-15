-- ============================================
-- SCHEMA DE BASE DE DATOS - APP INVENTARIO
-- ============================================

-- Tabla de perfiles de usuarios (linked con auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  description TEXT,
  unit TEXT DEFAULT 'unidad' CHECK (unit IN ('unidad', 'kg', 'litro', 'metro')),
  cost DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de depósitos/almacenes
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  capacity INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de stock (cantidad de producto por depósito)
CREATE TABLE IF NOT EXISTS stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_product_warehouse UNIQUE(product_id, warehouse_id)
);

-- Tabla de movimientos (transferencias, salidas, reingresos)
CREATE TABLE IF NOT EXISTS movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('transfer', 'production_output', 'return')),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  from_warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  to_warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ajustes de inventario
CREATE TABLE IF NOT EXISTS adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índices en stock
CREATE INDEX IF NOT EXISTS idx_stock_product ON stock(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_warehouse ON stock(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_quantity ON stock(quantity) WHERE quantity < min_quantity;

-- Índices en movements
CREATE INDEX IF NOT EXISTS idx_movements_product ON movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_from_warehouse ON movements(from_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_movements_to_warehouse ON movements(to_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_movements_created_at ON movements(created_at);
CREATE INDEX IF NOT EXISTS idx_movements_type ON movements(type);

-- Índices en adjustments
CREATE INDEX IF NOT EXISTS idx_adjustments_product ON adjustments(product_id);
CREATE INDEX IF NOT EXISTS idx_adjustments_warehouse ON adjustments(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_adjustments_created_at ON adjustments(created_at);

-- Índices en products
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Índices en warehouses
CREATE INDEX IF NOT EXISTS idx_warehouses_is_active ON warehouses(is_active);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at
BEFORE UPDATE ON warehouses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_updated_at
BEFORE UPDATE ON stock
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE adjustments ENABLE ROW LEVEL SECURITY;

-- Policies para profiles (todos pueden ver perfiles activos)
CREATE POLICY "Profiles are viewable by authenticated users"
ON profiles FOR SELECT
USING (auth.role() = 'authenticated');

-- Policies para products (todos pueden ver productos activos)
CREATE POLICY "Products are viewable by authenticated users"
ON products FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert products"
ON products FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can update products"
ON products FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policies para stock (todos pueden ver)
CREATE POLICY "Stock is viewable by authenticated users"
ON stock FOR SELECT
USING (auth.role() = 'authenticated');

-- Policies para movements (todos pueden ver)
CREATE POLICY "Movements are viewable by authenticated users"
ON movements FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert movements"
ON movements FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policies para adjustments (todos pueden ver)
CREATE POLICY "Adjustments are viewable by authenticated users"
ON adjustments FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert adjustments"
ON adjustments FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policies para warehouses (todos pueden ver)
CREATE POLICY "Warehouses are viewable by authenticated users"
ON warehouses FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert warehouses"
ON warehouses FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
