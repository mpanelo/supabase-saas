import { useEffect } from 'react'
import { ContextProps, useUser } from '../context/user'

const Logout = () => {
  const { logout } = useUser() as ContextProps
  useEffect(() => {
    logout()
  }, [])
  return <p>Logging Out</p>
}

export default Logout
