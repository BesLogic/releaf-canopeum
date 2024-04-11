import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { isUserRole, type User } from '@models/User'
import { jwtDecode } from 'jwt-decode'
import { useContext } from 'react'

const useLogin = () => {
  const { authenticate, isAuthenticated } = useContext(AuthenticationContext)

  const authenticateUser = (accessToken?: string) => {
    if (isAuthenticated) return

    const accessTokenToDecode = accessToken ?? sessionStorage.getItem('token')
    if (!accessTokenToDecode) return

    const decodedToken = jwtDecode<User>(accessTokenToDecode)
    const userRole = isUserRole(decodedToken.role)
      ? decodedToken.role
      : 'User'

    authenticate({
      email: decodedToken.email,
      firstname: decodedToken.firstname,
      image: '',
      lastname: decodedToken.lastname,
      role: userRole,
    })
  }

  return {
    authenticateUser,
  }
}

export default useLogin
