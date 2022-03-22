import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react'
import { supabase } from '../utils/supabase'
import { User as SupabaseAuthUser } from '@supabase/gotrue-js/src/lib/types'
import { useRouter } from 'next/router'

export interface ContextProps {
  user: User | null
  login: () => Promise<void>
  logout: () => Promise<void>
}

export interface User extends SupabaseAuthUser {
  is_subscribed: boolean
  interval: string
  stripe_customer: string
  email: string
}

interface ProviderProps {
  children: ReactNode
}

const Context = createContext<ContextProps | null>(null)

const Provider = ({ children }: ProviderProps) => {
  const router = useRouter()

  const [user, setUser] = useState<User>(supabase.auth.user())

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user()

      if (sessionUser) {
        const { data: profile } = await supabase
          .from('profile')
          .select('*')
          .eq('id', sessionUser.id)
          .single()

        setUser({
          ...sessionUser,
          ...profile,
        })
      }
    }

    getUserProfile()

    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })
  }, [])

  const login = async () => {
    supabase.auth.signIn({
      provider: 'github',
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const exposed = {
    user,
    login,
    logout,
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useUser = () => useContext(Context)
export default Provider
