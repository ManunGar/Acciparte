import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lp-page">
      <div className="lp-card">
        <h1 className="lp-logo">Acciparte — Editor de escenas</h1>
        <p className="lp-subtitle">{mode === 'login' ? 'Inicia sesion para continuar' : 'Crea tu cuenta'}</p>
        {error && <div className="lp-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="lp-field">
            <label className="lp-label">Email</label>
            <input className="lp-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="usuario@ejemplo.com" />
          </div>
          <div className="lp-field">
            <label className="lp-label">Contrasena</label>
            <input className="lp-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Minimo 6 caracteres" />
          </div>
          <button type="submit" className="lp-btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
          </button>
        </form>
        <div className="lp-toggle">
          {mode === 'login' ? 'No tienes cuenta?' : 'Ya tienes cuenta?'}
          <span className="lp-link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
            {mode === 'login' ? 'Registrate' : 'Inicia sesion'}
          </span>
        </div>
      </div>
    </div>
  )
}
