export type UserRole = 'Admin' | 'MegaAdmin' | 'User'

export const isUserRole = (role: string | undefined): role is UserRole =>
  role === 'Admin' || role === 'MegaAdmin' || role === 'User'

export type User = {
  firstname: string,
  lastname: string,
  email: string,
  role: UserRole,
  image: string,
}
