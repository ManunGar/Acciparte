# Stack 2 — Editor visual de escenas de accidente

Backend: `backend2/` (puerto 4040) · Frontend: `frontend2/` (puerto 3001 en Docker / 3000 manual)

---

## Modelo de datos

### User

Cuenta de acceso al editor. No pertenece a ninguna organización; el aislamiento es individual por usuario.

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `email` | STRING | NOT NULL, UNIQUE |
| `password` | STRING | NOT NULL · almacenado como hash bcrypt (coste 5) |
| `createdAt` | DATE | NOT NULL |
| `updatedAt` | DATE | NOT NULL |

### Scene

Almacena una escena de accidente. El campo `data` contiene la representación completa del lienzo en formato JSONB, lo que permite guardar y recuperar el estado íntegro del editor sin necesidad de tablas adicionales.

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `name` | STRING | NOT NULL · default `"Escena sin titulo"` |
| `data` | JSONB | NOT NULL · default `{ "elements": [] }` |
| `userId` | INTEGER | FK → Users(id), NOT NULL, CASCADE |
| `createdAt` | DATE | NOT NULL |
| `updatedAt` | DATE | NOT NULL |

### RefreshToken

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `token` | STRING(512) | NOT NULL, UNIQUE (UUID v4) |
| `userId` | INTEGER | FK → Users(id), NOT NULL, CASCADE |
| `expiresAt` | DATE | NOT NULL · 7 días desde la creación |
| `createdAt` | DATE | NOT NULL |
| `updatedAt` | DATE | NOT NULL |

---

## Modelo del campo `data` — representación de la escena

El campo `data` es el núcleo del editor. Es un objeto JSONB con una única clave `elements`, que contiene el array de todos los elementos visuales colocados en el lienzo:

```json
{
  "elements": [
    {
      "id":       "550e8400-e29b-41d4-a716-446655440000",
      "type":     "car",
      "label":    "Coche",
      "x":        320,
      "y":        180,
      "rotation": 0,
      "color":    "#3b82f6",
      "width":    70,
      "height":   35,
      "properties": {
        "notes": "Vehículo implicado 1"
      }
    }
  ]
}
```

### Campos de cada elemento

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string (UUID v4) | Identificador único generado en el cliente al añadir el elemento |
| `type` | string (enum) | Tipo de elemento — define la forma base y los valores por defecto |
| `label` | string | Etiqueta visible bajo el elemento en el canvas; editable |
| `x` | number | Posición horizontal del borde superior-izquierdo, en píxeles del canvas |
| `y` | number | Posición vertical del borde superior-izquierdo, en píxeles del canvas |
| `rotation` | number | Rotación en grados (–360 a 360). El pivote es el centro geométrico del elemento |
| `color` | string (hex) | Color de relleno de la figura; editable desde el panel de propiedades |
| `width` | number | Ancho en píxeles |
| `height` | number | Alto en píxeles |
| `properties.notes` | string | Campo libre de observaciones sobre el elemento |

### Tipos de elemento disponibles

| `type` | Etiqueta | Forma en canvas | Tamaño por defecto | Color por defecto |
|---|---|---|---|---|
| `car` | Coche | Rectángulo + flecha de dirección | 70 × 35 | `#3b82f6` (azul) |
| `truck` | Camión | Rectángulo + flecha de dirección | 100 × 45 | `#f97316` (naranja) |
| `motorcycle` | Moto | Rectángulo + flecha de dirección | 45 × 22 | `#8b5cf6` (morado) |
| `pedestrian` | Peatón | Círculo | 24 × 24 | `#22c55e` (verde) |
| `obstacle` | Obstáculo | Rectángulo con esquinas redondeadas | 40 × 40 | `#ef4444` (rojo) |
| `sign` | Señal | Triángulo (polígono regular de 3 lados) | 32 × 32 | `#eab308` (amarillo) |
| `road_mark` | Marca vial | Rectángulo estrecho | 120 × 10 | `#475569` (gris pizarra) |

El canvas tiene un tamaño fijo de **900 × 600 px** con una cuadrícula de referencia de 40 px entre líneas. Los elementos nuevos se insertan centrados en el canvas y son arrastrables libremente.

