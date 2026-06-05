import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import AuthEndpoints from '../api/AuthEndpoints'
import { useAuth } from '../context/AuthContext'

const schema = yup.object({
  email:    yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().required('La contraseña es requerida'),
})

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) navigate('/dashboard')

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values, { setStatus }) => {
      try {
        const data = await AuthEndpoints.login(values)
        login(data)
        navigate('/dashboard')
      } catch (err) {
        setStatus(err.message)
      }
    },
  })

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">A</div>
          <span className="brand-name">Acciparte</span>
        </div>

        <h2>Bienvenido de nuevo</h2>
        <p className="subtitle">Inicia sesión en tu cuenta</p>

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
              placeholder="••••••••"
              className={formik.touched.password && formik.errors.password ? 'input-error' : ''}
              autoComplete="current-password"
            />
            {formik.touched.password && formik.errors.password && (
              <span className="field-error">{formik.errors.password}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>
      </div>
    </div>
  )
}
