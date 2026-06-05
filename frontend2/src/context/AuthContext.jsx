import React, { createContext, useContext, useState, useEffect } from 'react'
import AuthEndpoints from '../api/AuthEndpoints'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) { setLoading(false); return }
    AuthEndpoints.me()
      .then(setUser)
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const tokens = await AuthEndpoints.login({ email, password })
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
    setUser(await AuthEndpoints.me())
  }

  const register = async (email, password) => {
    const tokens = await AuthEndpoints.register({ email, password })
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
    setUser(await AuthEndpoints.me())
  }

  const logout = () => { localStorage.clear(); setUser(null) }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)