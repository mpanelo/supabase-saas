import { useEffect } from 'react'
import { ContextProps, useUser } from '../context/user'

const Login = () => {
  const { login } = useUser() as ContextProps
  useEffect(() => {
    login()
  }, [])
  return <p>Logging in</p>
}

export default Login
