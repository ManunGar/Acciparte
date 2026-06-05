import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SceneEndpoints from '../api/SceneEndpoints'
import './SceneListPage.css'

export default function SceneListPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scenes, setScenes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    SceneEndpoints.getAll().then(setScenes).catch(() => setScenes([])).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Eliminar esta escena?')) return
    await SceneEndpoints.remove(id)
    setScenes(prev => prev.filter(sc => sc.id !== id))
  }

  const fmt = (d) => new Date(d).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="sl-page">
      <header className="sl-header">
        <span className="sl-logo">Acciparte — Editor de escenas de accidente</span>
        <div className="sl-header-right">
          {user && <span className="sl-email">{user.email}</span>}
          <button className="sl-btn-logout" onClick={() => { logout(); navigate('/login') }}>Cerrar sesion</button>
        </div>
      </header>
      <main className="sl-main">
        <div className="sl-top-bar">
          <h1 className="sl-heading">Mis escenas</h1>
          <button className="sl-btn-new" onClick={() => navigate('/escenas/nueva')}>+ Nueva escena</button>
        </div>
        {loading ? (
          <div className="sl-empty">Cargando...</div>
        ) : scenes.length === 0 ? (
          <div className="sl-empty">
            <p>Aun no hay escenas guardadas.</p>
            <button className="sl-btn-new" onClick={() => navigate('/escenas/nueva')}>Crear primera escena</button>
          </div>
        ) : (
          <div className="sl-grid">
            {scenes.map(sc => (
              <div key={sc.id} className="sl-card" onClick={() => navigate(`/escenas/${sc.id}`)}>
                <p className="sl-card-title">{sc.name}</p>
                <p className="sl-card-date">Modificado: {fmt(sc.updatedAt)}</p>
                <div className="sl-card-footer">
                  <button className="sl-btn-delete" onClick={e => handleDelete(e, sc.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}