import { supabase } from "@/services/supabase"
import { useQuery } from "@tanstack/react-query"

export default () => useQuery({
  queryKey: ['session'],
  queryFn: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }
})
