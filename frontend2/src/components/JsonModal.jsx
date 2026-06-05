import React, { useState } from 'react'
import './JsonModal.css'

export default function JsonModal({ scene, onClose }) {
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(scene, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${scene.name || 'escena'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="jm-overlay" onClick={onClose}>
      <div className="jm-modal" onClick={e => e.stopPropagation()}>
        <div className="jm-header">
          <h2 className="jm-title">Modelo de datos — JSON</h2>
          <button className="jm-btn-close" onClick={onClose}>✕</button>
        </div>
        <pre className="jm-pre">{json}</pre>
        <div className="jm-actions">
          <button className="jm-btn-copy" onClick={handleCopy}>{copied ? '¡Copiado!' : 'Copiar JSON'}</button>
          <button className="jm-btn-download" onClick={handleDownload}>Descargar .json</button>
        </div>
      </div>
    </div>
  )
}
