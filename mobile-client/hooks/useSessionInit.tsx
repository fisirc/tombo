import { supabase } from "@/services/supabase"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    })
  }, [])
}
