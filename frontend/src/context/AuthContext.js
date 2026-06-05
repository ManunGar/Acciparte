import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'))

  const login = ({ accessToken: at, refreshToken: rt }) => {
    localStorage.setItem('accessToken', at)
    localStorage.setItem('refreshToken', rt)
    setAccessToken(at)
    setRefreshToken(rt)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setAccessToken(null)
    setRefreshToken(null)
  }

  return (
    <AuthContext.Provider value={{
      accessToken,
      refreshToken,
      login,
      logout,
      isAuthenticated: !!accessToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
