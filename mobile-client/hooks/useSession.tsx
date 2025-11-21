import { supabase } from "@/services/supabase"
import { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export default () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return session
}
