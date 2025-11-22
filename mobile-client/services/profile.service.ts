import { Tables, TablesUpdate } from "@/types/supabase"
import { supabase } from "./supabase"

export default class ProfileService {
  static getProfile = async (userId: string): Promise<Tables<'profiles'>> => {
    const query = supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    const { data, error } = await query
    if (error) throw error
    return data
  }

  static updateProfile = async (id: string, formData: TablesUpdate<'profiles'>): Promise<Tables<'profiles'>> => {
    const query = supabase
      .from('profiles')
      .update(formData)
      .eq('id', id)
      .select()
      .single()
    const { data, error } = await query
    if (error) throw error
    return data
  }
}