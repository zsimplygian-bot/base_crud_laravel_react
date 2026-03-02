// hooks/use-hasrole.ts
import { usePage } from "@inertiajs/react"

export const useHasRole = (roles: number | number[]) => {
  const { auth } = usePage().props
  if (!auth?.user) return false
  const userRole = auth.user.id_rol
  return Array.isArray(roles) ? roles.includes(userRole) : userRole === roles
}