import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthEndpoints from '../api/AuthEndpoints'
import IncidentEndpoints from '../api/IncidentEndpoints'
import { useAuth } from '../context/AuthContext'

/* ── Etiqueta de color por tipo de intervención ── */
const TYPE_COLORS = {
  'Asistencia médica': { bg: '#dcfce7', color: '#166534' },
  'Unidad de bomberos': { bg: '#ffedd5', color: '#9a3412' },
  'Policía': { bg: '#dbeafe', color: '#1e40af' },
  'Grúa': { bg: '#fef9c3', color: '#854d0e' },
  'Otro': { bg: '#f1f5f9', color: '#475569' },
}

function InterventionBadge({ type }) {
  const style = TYPE_COLORS[type] || TYPE_COLORS['Otro']
  return (
    <span className="badge" style={style}>
      {type}
    </span>
  )
}

/* ── Fila de incidencia ── */
function IncidentRow({ incident, onDelete, deleting }) {
  const date = new Date(incident.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div className="incident-row">
      <div className="incident-main">
        <div className="incident-name">
          {incident.firstName} {incident.lastName}
        </div>
        <div className="incident-meta">
          <span className="incident-location">{incident.location}</span>
          <span className="incident-date">{date}</span>
        </div>
      </div>
      <div className="incident-side">
        <InterventionBadge type={incident.interventionType} />
        <button
          className="btn-icon btn-delete"
          title="Eliminar incidencia"
          onClick={() => onDelete(incident.id)}
          disabled={deleting === incident.id}
        >
          {deleting === incident.id ? '…' : '✕'}
        </button>
      </div>
    </div>
  )
}

/* ── Página principal ── */
export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingIncidents, setLoadingIncidents] = useState(true)
  const [deleting, setDeleting] = useState(null)   // id del que se está borrando
  const [deleteError, setDeleteError] = useState('')

  const { logout } = useAuth()
  const navigate = useNavigate()

  /* Carga el usuario */
  useEffect(() => {
    loadUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Carga las incidencias — useCallback para poder llamarlo tras borrar */
  const fetchIncidents = useCallback(() => {
    loadIncidents()
  }, [])

  useEffect(() => { fetchIncidents() }, [fetchIncidents])

  const loadIncidents = async () => {
    setLoadingIncidents(true)
    try {
      const data = await IncidentEndpoints.getAll()
      setIncidents(data ?? [])
    } catch {
      setIncidents([])
    } finally {
      setLoadingIncidents(false)
    }
  }

  const loadUser = async () => {
    try {
      const data = await AuthEndpoints.me()
      setUser(data)
    } catch {
      logout()
      navigate('/login')
    } finally {
      setLoadingUser(false)
    }
  }

  /* Eliminar */
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta incidencia?')) return
    setDeleting(id)
    setDeleteError('')
    try {
      await IncidentEndpoints.remove(id)
      setIncidents(prev => prev.filter(i => i.id !== id))
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  if (loadingUser) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    )
  }

  const initials = user.email.slice(0, 2).toUpperCase()
  const joinDate = new Date(user.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="dashboard">
      {/* Nav */}
      <nav className="dashboard-nav">
        <div className="brand">
          <div className="brand-icon" style={{ width: 32, height: 32, fontSize: 15 }}>A</div>
          <span className="brand-name" style={{ fontSize: 17 }}>Acciparte</span>
        </div>
        <div className="nav-right">
          <div className="nav-user">
            <div className="nav-avatar">{initials}</div>
            <span>{user.email}</span>
          </div>
          <button className="btn btn-danger-outline" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Cabecera */}
        <div className="page-header">
          <div className="page-header-top">
            <div>
              <h1>Panel principal</h1>
              <p>
                Organización:&nbsp;
                <span className="badge badge-blue">{user.tenant?.name}</span>
              </p>
            </div>
            <Link to="/incidents/new" className="btn btn-primary btn-new-incident">
              + Nueva incidencia
            </Link>
          </div>
        </div>

        {/* Lista de incidencias */}
        <div className="info-card">
          <div className="incident-list-header">
            <h3>Incidencias</h3>
            {!loadingIncidents && incidents.length > 0 && (
              <span className="badge badge-blue">{incidents.length}</span>
            )}
          </div>

          {deleteError && (
            <div className="alert alert-error" style={{ marginBottom: 12 }}>{deleteError}</div>
          )}

          {loadingIncidents ? (
            <div className="loading-inline">
              <div className="spinner spinner-sm" />
              <span>Cargando incidencias…</span>
            </div>
          ) : incidents.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No hay incidencias registradas</p>
              <p className="empty-sub">Crea la primera usando el botón de arriba.</p>
            </div>
          ) : (
            <div className="incident-list">
              {incidents.map(incident => (
                <IncidentRow
                  key={incident.id}
                  incident={incident}
                  onDelete={handleDelete}
                  deleting={deleting}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mi cuenta */}
        <div className="info-card">
          <h3>Mi cuenta</h3>
          <div className="info-row">
            <span className="info-key">Email</span>
            <span className="info-val">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Organización</span>
            <span className="info-val">{user.tenant?.name}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Slug</span>
            <span className="info-val">{user.tenant?.slug}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Miembro desde</span>
            <span className="info-val">{joinDate}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
