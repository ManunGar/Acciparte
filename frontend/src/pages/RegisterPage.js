import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import AuthEndpoints from '../api/AuthEndpoints'
import TenantEndpoints from '../api/TenantEndpoints'
import { useAuth } from '../context/AuthContext'

const NEW_TENANT = '__new__'

const schema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  tenantSelection: yup
    .string()
    .required('Debes seleccionar o crear una organización'),
  tenantName: yup
    .string()
    .when('tenantSelection', {
      is: NEW_TENANT,
      then: (s) => s.min(2, 'El nombre debe tener al menos 2 caracteres').required('El nombre de la organización es requerido'),
      otherwise: (s) => s.optional(),
    }),
})

export default function RegisterPage() {
  const [tenants, setTenants]               = useState([])
  const [tenantsLoading, setTenantsLoading] = useState(true)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) navigate('/dashboard')

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const data = await TenantEndpoints.getAll()
        setTenants(data ?? [])
      } catch {
        // Si falla la carga de tenants se muestra el selector vacío
      } finally {
        setTenantsLoading(false)
      }
    }
    loadTenants()
  }, [])

  const formik = useFormik({
    initialValues: {
      email:           '',
      password:        '',
      tenantSelection: '',
      tenantName:      '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setStatus }) => {
      const isNew = values.tenantSelection === NEW_TENANT
      try {
        const payload = {
          email:    values.email,
          password: values.password,
          ...(isNew
            ? { tenantName: values.tenantName.trim() }
            : { tenantId: parseInt(values.tenantSelection) }),
        }
        const data = await AuthEndpoints.register(payload)
        login(data)
        navigate('/dashboard')
      } catch (err) {
        setStatus(err.message)
      }
    },
  })

  const isNew = formik.values.tenantSelection === NEW_TENANT

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">A</div>
          <span className="brand-name">Acciparte</span>
        </div>

        <h2>Crear cuenta</h2>
        <p className="subtitle">Regístrate para empezar a gestionar incidentes</p>

        {formik.status && <div className="alert alert-error">{formik.status}</div>}

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              placeholder="usuario@empresa.com"
              className={formik.touched.email && formik.errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {formik.touched.email && formik.errors.email && (
              <span className="field-error">{formik.errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              placeholder="Mínimo 6 caracteres"
              className={formik.touched.password && formik.errors.password ? 'input-error' : ''}
              autoComplete="new-password"
            />
            {formik.touched.password && formik.errors.password && (
              <span className="field-error">{formik.errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tenantSelection">Organización</label>
            <select
              id="tenantSelection"
              {...formik.getFieldProps('tenantSelection')}
              className={formik.touched.tenantSelection && formik.errors.tenantSelection ? 'input-error' : ''}
            >
              <option value="" disabled>
                {tenantsLoading ? 'Cargando organizaciones...' : 'Selecciona una organización...'}
              </option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
              <option value={NEW_TENANT}>+ Crear nueva organización</option>
            </select>
            {formik.touched.tenantSelection && formik.errors.tenantSelection && (
              <span className="field-error">{formik.errors.tenantSelection}</span>
            )}

            {isNew && (
              <div className="new-tenant-wrapper">
                <input
                  type="text"
                  {...formik.getFieldProps('tenantName')}
                  placeholder="Nombre de tu organización"
                  className={formik.touched.tenantName && formik.errors.tenantName ? 'input-error' : ''}
                  autoFocus
                />
                {formik.touched.tenantName && formik.errors.tenantName && (
                  <span className="field-error">{formik.errors.tenantName}</span>
                )}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  )
}
