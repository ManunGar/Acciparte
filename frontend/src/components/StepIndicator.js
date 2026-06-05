/**
 * StepIndicator — muestra el progreso del formulario en dos pasos.
 * Props:
 *   currentStep: 1 | 2
 *   totalSteps:  number (default 2)
 */
export default function StepIndicator({ currentStep, totalSteps = 2 }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isCompleted = step < currentStep
        const isActive = step === currentStep

        return (
          <div key={step} className="step-item">
            <div className={`step-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              {isCompleted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                step
              )}
            </div>
            <span className={`step-label ${isActive ? 'active' : ''}`}>
              {step === 1 ? 'Datos del accidente' : 'Tipo de intervención'}
            </span>
            {step < totalSteps && <div className={`step-line ${isCompleted ? 'completed' : ''}`} />}
          </div>
        )
      })}
    </div>
  )
}
