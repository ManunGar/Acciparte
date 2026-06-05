import React from 'react'
import { ELEMENT_DEFAULTS } from './SceneCanvas'
import './Toolbar.css'

const TYPES = [
  { type: 'car',        icon: '🚗', label: 'Coche' },
  { type: 'truck',      icon: '🚛', label: 'Camion' },
  { type: 'motorcycle', icon: '🏍', label: 'Moto' },
  { type: 'pedestrian', icon: '🚶', label: 'Peton' },
  { type: 'obstacle',   icon: '⬛', label: 'Obstaculo' },
  { type: 'sign',       icon: '⚠', label: 'Senal' },
  { type: 'road_mark',  icon: '➖', label: 'Marca vial' },
]

export default function Toolbar({ onAdd }) {
  return (
    <aside className="tb-sidebar">
      <p className="tb-heading">Elementos</p>
      {TYPES.map(({ type, icon, label }) => (
        <button key={type} className="tb-btn" onClick={() => onAdd(type)} title={`Anadir ${label}`}>
          <span className="tb-icon">{icon}</span>
          <span className="tb-label">{label}</span>
          {/* background dinámico: cada tipo tiene su color propio */}
          <span className="tb-dot" style={{ background: ELEMENT_DEFAULTS[type].color }} />
        </button>
      ))}
    </aside>
  )
}
