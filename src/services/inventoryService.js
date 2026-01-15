import { supabase } from '../config/supabase'

export const inventoryService = {
  // PRODUCTOS
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },

  async getProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createProduct(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
    if (error) throw error
    return data[0]
  },

  async updateProduct(id, product) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // DEPÓSITOS
  async getWarehouses() {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },

  async createWarehouse(warehouse) {
    const { data, error } = await supabase
      .from('warehouses')
      .insert([warehouse])
      .select()
    if (error) throw error
    return data[0]
  },

  async updateWarehouse(id, warehouse) {
    const { data, error } = await supabase
      .from('warehouses')
      .update(warehouse)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  // STOCK
  async getStock(warehouseId = null) {
    let query = supabase
      .from('stock')
      .select(`
        *,
        product:products(*),
        warehouse:warehouses(*)
      `)

    if (warehouseId) {
      query = query.eq('warehouse_id', warehouseId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getStockByProductAndWarehouse(productId, warehouseId) {
    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .eq('product_id', productId)
      .eq('warehouse_id', warehouseId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  },

  async updateStock(productId, warehouseId, quantity) {
    const stock = await this.getStockByProductAndWarehouse(productId, warehouseId)
    
    if (stock) {
      const { data, error } = await supabase
        .from('stock')
        .update({ quantity })
        .eq('id', stock.id)
        .select()
      if (error) throw error
      return data[0]
    } else {
      const { data, error } = await supabase
        .from('stock')
        .insert([{ product_id: productId, warehouse_id: warehouseId, quantity }])
        .select()
      if (error) throw error
      return data[0]
    }
  },

  // MOVIMIENTOS
  async getMovements(filters = {}) {
    let query = supabase
      .from('movements')
      .select(`
        *,
        product:products(*),
        from_warehouse:warehouses!from_warehouse_id(*),
        to_warehouse:warehouses!to_warehouse_id(*),
        created_by:profiles(*)
      `)

    if (filters.type) query = query.eq('type', filters.type)
    if (filters.warehouseId) {
      query = query.or(`from_warehouse_id.eq.${filters.warehouseId},to_warehouse_id.eq.${filters.warehouseId}`)
    }
    if (filters.productId) query = query.eq('product_id', filters.productId)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createMovement(movement) {
    const { data, error } = await supabase
      .from('movements')
      .insert([movement])
      .select()
    if (error) throw error
    return data[0]
  },

  // AJUSTES
  async getAdjustments() {
    const { data, error } = await supabase
      .from('adjustments')
      .select(`
        *,
        product:products(*),
        warehouse:warehouses(*),
        created_by:profiles(*)
      `)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createAdjustment(adjustment) {
    const { data, error } = await supabase
      .from('adjustments')
      .insert([adjustment])
      .select()
    if (error) throw error
    return data[0]
  },
}
