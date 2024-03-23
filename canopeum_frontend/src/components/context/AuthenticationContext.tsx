import type { ReactNode } from 'react'
import { createContext, memo, useState } from 'react'

export enum UserRole {
  MegaAdmin = 'MegaAdmin',
  MiniAdmin = 'MiniAdmin',
  RegularUser = 'RegularUser',
}

type User = {
  firstname: string,
  lastname: string,
  email: string,
  role: UserRole,
  image: string,
}

type IAuthenticationContext = {
  authenticate: (user: User) => void,
  isAuthenticated: boolean,
  currentUser: User | undefined,
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
  authenticate: (_: User) => {/* do nothing by default */},
  isAuthenticated: false,
  currentUser: undefined,
})

const AuthenticationContextProvider = memo((props: { readonly children?: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined)

  const authenticate = (newUser: User) => setUser(newUser)

  return (
    <AuthenticationContext.Provider
      /* eslint-disable-next-line react/jsx-no-constructed-context-values --
      FIXME: Vincent shold have this fixed in his branch already */
      value={{
        currentUser: user,
        isAuthenticated: user !== undefined,
        authenticate,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  )
})
AuthenticationContextProvider.displayName = 'AuthenticationContextProvider'
export default AuthenticationContextProvider
