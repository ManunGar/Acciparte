import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import ConfigEndpoints from '../api/ConfigEndpoints'
import IncidentEndpoints from '../api/IncidentEndpoints'
import StepIndicator from '../components/StepIndicator'

/* ─────────────────────────────────────────────
   Esquemas Yup por paso
───────────────────────────────────────────── */
const step1Schema = yup.object({
  firstName: yup.string().trim().max(100, 'Máximo 100 caracteres').required('El nombre es requerido'),
  lastName:  yup.string().trim().max(150, 'Máximo 150 caracteres').required('Los apellidos son requeridos'),
  location:  yup.string().trim().max(255, 'Máximo 255 caracteres').required('El lugar es requerido'),
})

const step2Schema = yup.object({
  interventionType: yup.string().required('Selecciona un tipo de intervención'),
})

const fullSchema = step1Schema.concat(step2Schema)

/* ─────────────────────────────────────────────
   Helper — muestra error solo si el campo fue tocado
───────────────────────────────────────────── */
function FieldError({ formik, name }) {
  if (!formik.touched[name] || !formik.errors[name]) return null
  return <span className="field-error">{formik.errors[name]}</span>
}

/* ─────────────────────────────────────────────
   PASO 1 — Nombre, Apellidos y Lugar
───────────────────────────────────────────── */
function Step1Form({ formik, onNext }) {
  const handleNext = async () => {
    // Marca como tocados solo los campos del paso 1 para mostrar sus errores
    await formik.setTouched({ firstName: true, lastName: true, location: true }, true)
    const errors = await formik.validateForm()
    const step1Fields = ['firstName', 'lastName', 'location']
    const hasErrors = step1Fields.some((f) => errors[f])
    if (!hasErrors) onNext()
  }

  const errorClass = (name) =>
    formik.touched[name] && formik.errors[name] ? 'input-error' : ''

  return (
    <div className="incident-form">
      <div className="form-group">
        <label htmlFor="firstName">Nombre *</label>
        <input
          id="firstName"
          type="text"
          {...formik.getFieldProps('firstName')}
          placeholder="Introduce el nombre"
          className={errorClass('firstName')}
          autoFocus
        />
        <FieldError formik={formik} name="firstName" />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Apellidos *</label>
        <input
          id="lastName"
          type="text"
          {...formik.getFieldProps('lastName')}
          placeholder="Introduce los apellidos"
          className={errorClass('lastName')}
        />
        <FieldError formik={formik} name="lastName" />
      </div>

      <div className="form-group">
        <label htmlFor="location">Lugar del accidente *</label>
        <input
          id="location"
          type="text"
          {...formik.getFieldProps('location')}
          placeholder="Calle, municipio o referencia"
          className={errorClass('location')}
        />
        <FieldError formik={formik} name="location" />
      </div>

      <div className="form-actions single">
        <button type="button" className="btn btn-primary" onClick={handleNext}>
          Siguiente
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PASO 2 — Tipo de intervención
───────────────────────────────────────────── */
function Step2Form({ formik, onBack }) {
  const [types, setTypes]       = useState([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const list = await ConfigEndpoints.getInterventionTypes()
        setTypes(list ?? [])
      } catch {
        setTypes([])
      } finally {
        setFetching(false)
      }
    }
    loadTypes()
  }, [])

  return (
    <form className="incident-form" onSubmit={formik.handleSubmit} noValidate>
      {formik.status && (
        <div className="alert alert-error">{formik.status}</div>
      )}

      <fieldset className="intervention-fieldset">
        <legend>Tipo de intervención *</legend>

        {fetching ? (
          <div className="loading-inline">
            <div className="spinner spinner-sm" />
            <span>Cargando opciones…</span>
          </div>
        ) : (
          <div className="radio-group">
            {types.map(({ value, label }) => (
              <label
                key={value}
                className={`radio-option ${formik.values.interventionType === value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="interventionType"
                  value={value}
                  checked={formik.values.interventionType === value}
                  onChange={() => formik.setFieldValue('interventionType', value)}
                />
                <span className="radio-custom" />
                <span className="radio-label">{label}</span>
              </label>
            ))}
          </div>
        )}

        {formik.touched.interventionType && formik.errors.interventionType && (
          <span className="field-error" style={{ marginTop: 8, display: 'block' }}>
            {formik.errors.interventionType}
          </span>
        )}
      </fieldset>

      <div className="form-actions double">
        <button
          type="button"
          className="btn btn-back"
          onClick={onBack}
          disabled={formik.isSubmitting}
        >
          Atrás
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-save"
          disabled={formik.isSubmitting || fetching}
        >
          {formik.isSubmitting ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

/* ─────────────────────────────────────────────
   PÁGINA PRINCIPAL — IncidentFormPage
───────────────────────────────────────────── */
export default function IncidentFormPage() {
  const navigate     = useNavigate()
  const [step, setStep] = useState(1)

  const formik = useFormik({
    initialValues: {
      firstName:        '',
      lastName:         '',
      location:         '',
      interventionType: '',
    },
    validationSchema: fullSchema,
    // La validación solo se dispara al enviar; por paso se hace manualmente en Step1
    validateOnChange: true,
    validateOnBlur:   true,
    onSubmit: async (values, { setStatus }) => {
      // Marca el campo del paso 2 como tocado para mostrar error si no se seleccionó
      if (!values.interventionType) {
        await formik.setFieldTouched('interventionType', true, true)
        return
      }
      try {
        await IncidentEndpoints.create(values)
        navigate('/dashboard')
      } catch (err) {
        setStatus(err.message)
      }
    },
  })

  const handleBack = () => {
    formik.setStatus(undefined)
    setStep(1)
  }

  return (
    <div className="dashboard">
      {/* Nav */}
      <nav className="dashboard-nav">
        <div className="brand">
          <div className="brand-icon" style={{ width: 32, height: 32, fontSize: 15 }}>A</div>
          <span className="brand-name" style={{ fontSize: 17 }}>Acciparte</span>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          Volver al panel
        </button>
      </nav>

      {/* Contenido */}
      <main className="dashboard-main">
        <div className="form-container">
          <div className="page-header">
            <h1>Nueva incidencia</h1>
            <p>Completa los datos en dos pasos y guarda la incidencia.</p>
          </div>

          <div className="form-card">
            <StepIndicator currentStep={step} totalSteps={2} />

            <div className="step-content">
              {step === 1 && (
                <Step1Form
                  formik={formik}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <Step2Form
                  formik={formik}
                  onBack={handleBack}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
