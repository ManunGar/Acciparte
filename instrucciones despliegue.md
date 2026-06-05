# Instrucciones de ejecución — Acciparte

El proyecto está formado por **dos stacks independientes**:

| Stack | Backend | Frontend | Descripción |
|---|---|---|---|
| **Stack 1** | `backend/` · puerto `3030` | `frontend/` · puerto `3000` | Gestión de incidencias |
| **Stack 2** | `backend2/` · puerto `4040` | `frontend2/` · puerto `3001`* | Editor visual de escenas |

> *Puerto `3001` en Docker. Manualmente, por defecto usa `3000`; si ambos stacks corren a la vez, ajustar con la variable `PORT`.

---

## Opción A — Docker (recomendada)

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado y **en ejecución** (el icono de la ballena en la barra de tareas debe estar activo).

### Stack 1 — backend + frontend

```bash
# Desde la raíz del repositorio
docker compose up --build
```

Esto levanta automáticamente:

1. **PostgreSQL** (`db1`) en el puerto `5432` con la base de datos `acciparte`.
2. **Backend** (`backend`) en `http://localhost:3030`. Espera a que Postgres esté listo y luego ejecuta las migraciones de Sequelize antes de arrancar.
3. **Frontend** (`frontend`) en `http://localhost:3000`.

Para detenerlo:

```bash
docker compose down
```

Para eliminar también los datos de la base de datos:

```bash
docker compose down -v
```

### Stack 2 — backend2 + frontend2

```bash
# Desde la raíz del repositorio
docker compose -f docker-compose2.yml up --build
```

Esto levanta automáticamente:

1. **PostgreSQL** (`db2`) en el puerto `5433` con la base de datos `acciparte2`.
2. **Backend2** (`backend2`) en `http://localhost:4040`. Espera a que Postgres esté listo y luego ejecuta las migraciones antes de arrancar.
3. **Frontend2** (`frontend2`) en `http://localhost:3001`.

Para detenerlo:

```bash
docker compose -f docker-compose2.yml down
```

### Ejecutar ambos stacks a la vez

Los dos `docker-compose` usan nombres de servicio, redes y volúmenes distintos, por lo que pueden correr simultáneamente sin conflicto. Abre dos terminales:

```bash
# Terminal 1
docker compose up --build

# Terminal 2
docker compose -f docker-compose2.yml up --build
```

---

## Opción B — Ejecución manual

### Requisitos previos

| Herramienta | Versión mínima | Enlace |
|---|---|---|
| Node.js | 20 | https://nodejs.org |
| npm | 10 (incluido con Node 20) | — |
| PostgreSQL | 14 | https://www.postgresql.org/download |

Verifica las versiones instaladas:

```bash
node --version
npm --version
psql --version
```

---

### 1. Configurar PostgreSQL

Necesitas dos bases de datos independientes, una para cada stack.

#### Conectar al servidor de PostgreSQL

```bash
psql -U postgres
```

Si el usuario `postgres` tiene contraseña, añade `-W` para que la solicite.

#### Crear las bases de datos

```sql
-- Base de datos para Stack 1
CREATE DATABASE acciparte;

-- Base de datos para Stack 2
CREATE DATABASE acciparte2;

-- Verificar que se han creado
\l

-- Salir
\q
```

> Si quieres usar un usuario diferente a `postgres`, créalo primero:
> ```sql
> CREATE USER acciparte_user WITH PASSWORD 'tu_password';
> GRANT ALL PRIVILEGES ON DATABASE acciparte TO acciparte_user;
> GRANT ALL PRIVILEGES ON DATABASE acciparte2 TO acciparte_user;
> ```
> Y ajusta `DATABASE_USERNAME` y `DATABASE_PASSWORD` en los `.env` correspondientes.

---

### 2. Stack 1 — backend + frontend

#### 2.1 Configurar el backend

```bash
cd backend
```

Instala las dependencias:

```bash
npm install
```

Crea el archivo de variables de entorno a partir del ejemplo:

**`backend/.env`**

```env
NODE_ENV=development

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=acciparte
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Aplicación
APP_PORT=3030

# JWT — cambia este valor en producción
JWT_SECRET=acciparte_super_secret_key_cambia_esto_en_produccion
```

Ejecuta las migraciones para crear las tablas (`tenants`, `users`, `incidents`, `refresh_tokens`):

```bash
npx sequelize-cli db:migrate
```

Arranca el servidor:

```bash
# Producción
npm start

# Desarrollo (reinicio automático con nodemon)
npm run start-dev
```

El backend queda disponible en `http://localhost:3030`.

#### 2.2 Configurar el frontend

Abre una nueva terminal:

```bash
cd frontend
```

Instala las dependencias (el flag es necesario por la incompatibilidad de `react-scripts 5` con React 19):

```bash
npm install --legacy-peer-deps
```

El frontend está preconfigurado para conectar a `http://localhost:3030`. Si el backend corre en otro host o puerto, crea un archivo `.env`:

**`frontend/.env`** *(opcional, solo si cambia el puerto del backend)*

```env
REACT_APP_API_URL=http://localhost:3030
```

Arranca la aplicación:

```bash
npm start
```

El frontend abre automáticamente en `http://localhost:3000`.

---

### 3. Stack 2 — backend2 + frontend2

#### 3.1 Configurar el backend2

```bash
cd backend2
```

Instala las dependencias:

```bash
npm install
```

Crea el archivo de variables de entorno:

**`backend2/.env`**

```env
NODE_ENV=development

# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=acciparte2
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Aplicación
APP_PORT=4040

# JWT — cambia este valor en producción
JWT_SECRET=acciparte_caso2_secret_key
```

Ejecuta las migraciones para crear las tablas ( `users`, `scenes`, `refresh_tokens`):

```bash
npx sequelize-cli db:migrate
```

Arranca el servidor:

```bash
# Producción
npm start

# Desarrollo (reinicio automático con nodemon)
npm run start-dev
```

El backend queda disponible en `http://localhost:4040`.

#### 3.2 Configurar el frontend2

Abre una nueva terminal:

```bash
cd frontend2
```

Instala las dependencias:

```bash
npm install --legacy-peer-deps
```

El frontend2 está preconfigurado para conectar a `http://localhost:4040`. Si el backend2 corre en otro host o puerto, crea un archivo `.env`:

**`frontend2/.env`** *(opcional, solo si cambia el puerto del backend)*

```env
REACT_APP_API_URL=http://localhost:4040
```

Arranca la aplicación:

```bash
npm start
```

El frontend abre en `http://localhost:3000`. Si el **Stack 1 ya está corriendo** en ese puerto, cambia el puerto del frontend2:

```bash
PORT=3001 npm start          # Linux / macOS
$env:PORT=3001; npm start    # Windows PowerShell
```

---

### Resumen de puertos — ejecución manual

| Servicio | Host | Puerto |
|---|---|---|
| backend | localhost | 3030 |
| frontend | localhost | 3000 |
| backend2 | localhost | 4040 |
| frontend2 | localhost | 3000 (o 3001 si Stack 1 activo) |
| PostgreSQL (compartida) | localhost | 5432 |

---

## Referencia rápida de comandos

### Docker

```bash
# Levantar Stack 1
docker compose up --build

# Levantar Stack 2
docker compose -f docker-compose2.yml up --build

# Detener Stack 1 (conserva datos)
docker compose down

# Detener Stack 1 (elimina volumen de base de datos)
docker compose down -v

# Ver logs de un servicio concreto
docker compose logs -f backend
docker compose -f docker-compose2.yml logs -f backend2
```

### Migraciones (manual)

```bash
# Aplicar migraciones pendientes
npx sequelize-cli db:migrate

# Revertir la última migración
npx sequelize-cli db:migrate:undo

# Revertir todas las migraciones
npx sequelize-cli db:migrate:undo:all
```

---

## Resolución de problemas frecuentes

### `npm ci` falla en Docker con error de peer deps
El frontend usa React 19 y `react-scripts 5` declara como peer React 16–18. Los `Dockerfile` ya incluyen `--legacy-peer-deps`. Si el error persiste, reconstruye sin caché:

```bash
docker compose build --no-cache
```

### El backend no conecta a la base de datos
- Comprueba que PostgreSQL está en ejecución: `pg_isready -h localhost -p 5432`
- Verifica que `DATABASE_NAME`, `DATABASE_USERNAME` y `DATABASE_PASSWORD` en el `.env` coinciden con los creados en PostgreSQL.
- En Docker, `DATABASE_HOST` debe ser el nombre del servicio (`db1` o `db2`), no `localhost`.

### Docker: `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`
Docker Desktop no está iniciado. Ábrelo desde el menú de inicio y espera a que el icono de la ballena deje de animarse.

### El frontend no puede conectar con el backend
- Verifica que el backend está corriendo y responde: `curl http://localhost:3030` (o `4040`).
- Comprueba que `REACT_APP_API_URL` apunta al puerto correcto.
- En Docker, el navegador accede al backend a través de `localhost` (no del nombre de contenedor), así que el puerto del backend debe estar expuesto correctamente.
