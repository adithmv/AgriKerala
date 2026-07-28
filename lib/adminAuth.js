import { supabase } from './supabase'

// Returns true only if someone is logged in AND their email is in the admins table.
// Used to guard every /admin page.
export async function verifyAdmin() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false

  const { data: adminRow } = await supabase
    .from('admins')
    .select('email')
    .eq('email', session.user.email)
    .single()

  return !!adminRow
}