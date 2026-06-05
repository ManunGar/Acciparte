import { useCallback } from 'react'
import { Arrow, Circle, Group, Layer, Rect, RegularPolygon, Stage, Text } from 'react-konva'

export const ELEMENT_DEFAULTS = {
  car:        { width: 70,  height: 35, color: '#3b82f6', label: 'Coche' },
  truck:      { width: 100, height: 45, color: '#f97316', label: 'Camión' },
  motorcycle: { width: 45,  height: 22, color: '#8b5cf6', label: 'Moto' },
  pedestrian: { width: 24,  height: 24, color: '#22c55e', label: 'Peatón' },
  obstacle:   { width: 40,  height: 40, color: '#ef4444', label: 'Obstáculo' },
  sign:       { width: 32,  height: 32, color: '#eab308', label: 'Señal' },
  road_mark:  { width: 120, height: 10, color: '#475569', label: 'Marca vial' },
}

function ElementShape({ element }) {
  const { type, width, height, color } = element
  if (type === 'pedestrian') return <Circle x={width / 2} y={height / 2} radius={width / 2} fill={color} />
  if (type === 'sign')       return <RegularPolygon x={width / 2} y={height / 2} sides={3} radius={width / 2 + 4} fill={color} />
  return <Rect width={width} height={height} fill={color} cornerRadius={type === 'obstacle' ? 4 : 6} />
}

function SceneElement({ element, isSelected, onSelect, onDragEnd }) {
  const { id, x, y, rotation, width, height, label, type } = element

  const handleClick = useCallback((e) => { e.cancelBubble = true; onSelect(id) }, [id, onSelect])
  const offsetX = width / 2
  const offsetY = height / 2

  // e.target.x() es la posición Konva del Group, que internamente es x + offsetX.
  // Restamos el offset para recuperar la coordenada lógica del elemento.
  const handleDragEnd = useCallback((e) => {
    onDragEnd(id, e.target.x() - offsetX, e.target.y() - offsetY)
  }, [id, onDragEnd, offsetX, offsetY])

  return (
    <Group x={x + offsetX} y={y + offsetY} offsetX={offsetX} offsetY={offsetY} rotation={rotation}
           draggable onClick={handleClick} onTap={handleClick} onDragEnd={handleDragEnd}>
      {isSelected && (
        <Rect x={-3} y={-3} width={width + 6} height={height + 6}
              stroke="#3b82f6" strokeWidth={2} dash={[6, 3]} fill="transparent" cornerRadius={8} />
      )}
      <ElementShape element={element} />
      {(type === 'car' || type === 'truck' || type === 'motorcycle') && (
        <Arrow points={[width - 8, height / 2, width + 8, height / 2]}
               fill={element.color} stroke={element.color} strokeWidth={2}
               pointerLength={6} pointerWidth={6} />
      )}
      <Text x={0} y={height + 4} width={width} text={label}
            fontSize={11} fontFamily="sans-serif" fill="#1e293b" align="center" />
    </Group>
  )
}

export default function SceneCanvas({ elements, selectedId, onSelect, onDragEnd, width, height }) {
  // Deseleccionar al hacer click en el fondo del canvas
  const handleStageClick = useCallback((e) => {
    if (e.target === e.target.getStage()) onSelect(null)
  }, [onSelect])

  return (
    <Stage width={width} height={height} onClick={handleStageClick} onTap={handleStageClick}>
      <Layer>
        {Array.from({ length: Math.ceil(height / 40) + 1 }, (_, i) => (
          <Rect key={`h${i}`} x={0} y={i * 40} width={width} height={1} fill="#e2e8f0" />
        ))}
        {Array.from({ length: Math.ceil(width / 40) + 1 }, (_, i) => (
          <Rect key={`v${i}`} x={i * 40} y={0} width={1} height={height} fill="#e2e8f0" />
        ))}
        {elements.map(el => (
          <SceneElement key={el.id} element={el} isSelected={el.id === selectedId}
                        onSelect={onSelect} onDragEnd={onDragEnd} />
        ))}
      </Layer>
    </Stage>
  )
}