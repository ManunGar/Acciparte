import React from 'react'
import './PropertiesPanel.css'

const TYPE_LABELS = {
  car: 'Coche', truck: 'Camion', motorcycle: 'Moto',
  pedestrian: 'Peton', obstacle: 'Obstaculo', sign: 'Senal', road_mark: 'Marca vial'
}

export default function PropertiesPanel({ element, onChange, onDelete }) {
  if (!element) return (
    <aside className="pp-panel">
      <p className="pp-heading">Propiedades</p>
      <p className="pp-empty">Selecciona un elemento del canvas para editarlo.</p>
    </aside>
  )

  const { type, label, x, y, rotation, color, properties } = element
  const upd  = (key, val) => onChange({ ...element, [key]: val })
  const updP = (key, val) => onChange({ ...element, properties: { ...properties, [key]: val } })

  return (
    <aside className="pp-panel">
      <p className="pp-heading">Propiedades</p>

      <div className="pp-field">
        <span className="pp-label">Tipo</span>
        <span className="pp-value">{TYPE_LABELS[type] || type}</span>
      </div>

      <div className="pp-field">
        <label className="pp-label">Etiqueta</label>
        <input className="pp-input" value={label} onChange={e => upd('label', e.target.value)} />
      </div>

      <div className="pp-field">
        <label className="pp-label">Color</label>
        <div className="pp-color-row">
          <input type="color" value={color} onChange={e => upd('color', e.target.value)} className="pp-color-input" />
          <span className="pp-color-hex">{color}</span>
        </div>
      </div>

      <div className="pp-field">
        <label className="pp-label">Rotacion (deg)</label>
        <input type="number" className="pp-input" value={rotation} min={-360} max={360}
               onChange={e => upd('rotation', Number(e.target.value))} />
      </div>

      <div className="pp-field--xy">
        <div>
          <label className="pp-label">X</label>
          <input type="number" className="pp-input" value={Math.round(x)} onChange={e => upd('x', Number(e.target.value))} />
        </div>
        <div>
          <label className="pp-label">Y</label>
          <input type="number" className="pp-input" value={Math.round(y)} onChange={e => upd('y', Number(e.target.value))} />
        </div>
      </div>

      <div className="pp-field">
        <label className="pp-label">Notas</label>
        <textarea className="pp-textarea" value={properties?.notes || ''} rows={3}
                  onChange={e => updP('notes', e.target.value)} placeholder="Observaciones..." />
      </div>

      <button className="pp-btn-delete" onClick={onDelete}>Eliminar elemento</button>
    </aside>
  )
}
