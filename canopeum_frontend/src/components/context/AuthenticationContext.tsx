import type { FunctionComponent, ReactNode } from 'react';
import { createContext, memo, useState } from 'react'

export enum UserRole {
  MegaAdmin = 'MegaAdmin',
  MiniAdmin = 'MiniAdmin',
  RegularUser = 'RegularUser',
}

type User = {
  firstname: string
  lastname: string,
  email: string,
  role: UserRole,
  image: string
}

type IAuthenticationContext = {
  authenticate: (user: User) => void
  isAuthenticated: boolean
  currentUser: User | undefined
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
  authenticate: (_: User) => { },
  isAuthenticated: false,
  currentUser: undefined
});

const AuthenticationContextProvider: FunctionComponent<{ readonly children?: ReactNode }> = memo((props) => {
  const [user, setUser] = useState<User | undefined>(undefined)

  const authenticate = (user: User) => setUser(user)

  return <AuthenticationContext.Provider
    value={{
      currentUser: user,
      isAuthenticated: user !== undefined,
      authenticate,
    }}>
    {props.children}
  </AuthenticationContext.Provider>
})

export default AuthenticationContextProvider
