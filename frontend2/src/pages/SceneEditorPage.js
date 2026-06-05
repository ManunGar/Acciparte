import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import SceneEndpoints from '../api/SceneEndpoints'
import SceneCanvas, { ELEMENT_DEFAULTS } from '../components/SceneCanvas'
import Toolbar from '../components/Toolbar'
import PropertiesPanel from '../components/PropertiesPanel'
import JsonModal from '../components/JsonModal'
import './SceneEditorPage.css'

const CANVAS_W = 900
const CANVAS_H = 600

function makeElement(type, cx, cy) {
  const d = ELEMENT_DEFAULTS[type]
  return { id: uuidv4(), type, label: d.label, x: cx - d.width / 2, y: cy - d.height / 2, rotation: 0, color: d.color, width: d.width, height: d.height, properties: { notes: '' } }
}

export default function SceneEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scene, setScene]       = useState({ name: 'Escena sin titulo', data: { elements: [] } })
  const [selectedId, setSelectedId] = useState(null)
  const [showJson, setShowJson] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    if (!id) return
    SceneEndpoints.getById(id).then(data => { if (data) setScene(data) })
  }, [id])

  const elements = scene.data?.elements || []

  const setElements = useCallback((updater) => {
    setScene(prev => ({
      ...prev,
      data: { elements: typeof updater === 'function' ? updater(prev.data?.elements || []) : updater }
    }))
  }, [])

  const handleAdd = useCallback((type) => {
    const el = makeElement(type, CANVAS_W / 2, CANVAS_H / 2)
    setElements(prev => [...prev, el])
    setSelectedId(el.id)
  }, [setElements])

  const handleDragEnd = useCallback((elId, x, y) => {
    setElements(prev => prev.map(el => el.id === elId ? { ...el, x, y } : el))
  }, [setElements])

  const handleElementChange = useCallback((updated) => {
    setElements(prev => prev.map(el => el.id === updated.id ? updated : el))
  }, [setElements])

  const handleDelete = useCallback(() => {
    setElements(prev => prev.filter(el => el.id !== selectedId))
    setSelectedId(null)
  }, [selectedId, setElements])

  const selectedElement = elements.find(el => el.id === selectedId) || null

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { name: scene.name, data: scene.data }
      const data = scene.id
        ? await SceneEndpoints.update(scene.id, payload)
        : await SceneEndpoints.create(payload)
      if (data) {
        setScene(data)
        if (!scene.id) navigate(`/escenas/${data.id}`, { replace: true })
      }
      setSavedMsg('Guardado')
      setTimeout(() => setSavedMsg(''), 2500)
    } finally {
      setSaving(false)
    }
  }

  // Modelo de datos exportable (limpio, sin estado interno de UI)
  const exportableScene = {
    id: scene.id || null,
    name: scene.name,
    createdAt: scene.createdAt || null,
    updatedAt: scene.updatedAt || null,
    elements: elements.map(({ id: eId, type, label, x, y, rotation, color, width, height, properties }) => ({
      id: eId, type, label, x: Math.round(x), y: Math.round(y), rotation, color, width, height, properties
    }))
  }

  return (
    <div className="se-page">
      <header className="se-topbar">
        <button className="se-btn-back" onClick={() => navigate('/')}>← Volver</button>
        <input className="se-name-input" value={scene.name}
               onChange={e => setScene(prev => ({ ...prev, name: e.target.value }))}
               placeholder="Nombre de la escena" />
        <span className="se-spacer" />
        {savedMsg && <span className="se-saved">{savedMsg}</span>}
        <button className="se-btn-json" onClick={() => setShowJson(true)}>Ver JSON</button>
        <button className="se-btn-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </header>

      <div className="se-body">
        <Toolbar onAdd={handleAdd} />
        <div className="se-canvas-wrap">
          <SceneCanvas elements={elements} selectedId={selectedId}
                       onSelect={setSelectedId} onDragEnd={handleDragEnd}
                       width={CANVAS_W} height={CANVAS_H} />
        </div>
        <PropertiesPanel element={selectedElement} onChange={handleElementChange} onDelete={handleDelete} />
      </div>

      {showJson && <JsonModal scene={exportableScene} onClose={() => setShowJson(false)} />}
    </div>
  )
}
