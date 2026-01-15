import { supabase } from '../config/supabase'

export const userService = {
  // Obtener todos los usuarios
  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at')
    if (error) throw error
    return data
  },

  // Obtener usuario por ID
  async getUserById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  // Crear perfil de usuario
  async createProfile(userId, profile) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...profile }])
      .select()
    if (error) throw error
    return data[0]
  },

  // Actualizar perfil
  async updateProfile(userId, profile) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
    if (error) throw error
    return data[0]
  },

  // Cambiar rol de usuario
  async updateUserRole(userId, role) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
    if (error) throw error
    return data[0]
  },

  // Desactivar usuario
  async deactivateUser(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', userId)
      .select()
    if (error) throw error
    return data[0]
  },

  // Activar usuario
  async activateUser(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: true })
      .eq('id', userId)
      .select()
    if (error) throw error
    return data[0]
  },
}
