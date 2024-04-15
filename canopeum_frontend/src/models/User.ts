export type UserRole = 'Admin' | 'MegaAdmin' | 'User'

export const isUserRole = (role: string | undefined): role is UserRole =>
  role === 'Admin' || role === 'MegaAdmin' || role === 'User'

export type User = {
  username: string,
  email: string,
  role: UserRole,
  firstname?: string,
  lastname?: string,
  image: string,
}
