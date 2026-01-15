import { supabase } from '../config/supabase'

export const authService = {
  // Registrar nuevo usuario
  async signup(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Iniciar sesión
  async signin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Cerrar sesión
  async signout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  },

  // Restablecer contraseña
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return data
  },

  // Cambiar contraseña
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },
}
