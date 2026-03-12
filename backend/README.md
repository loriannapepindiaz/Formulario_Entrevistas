# Backend - Formulario Entrevistas

Estructura inicial de backend con Node.js, Express y PostgreSQL.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalación

```bash
cd backend
npm install
cp .env.example .env
```

## Variables de entorno

- `PORT`: Puerto del backend (por defecto `3001`).
- `DATABASE_URL`: Cadena de conexión de PostgreSQL.
- `NODE_ENV`: `development` o `production`.

## Ejecutar en desarrollo

```bash
npm run dev
```

## Ejecutar en producción

```bash
npm start
```

## Endpoints

- `GET /api/health`
- `POST /api/estudiantes`
- `GET /api/estudiantes`
- `GET /api/estudiantes/:id`
- `PUT /api/estudiantes/:id`
- `POST /api/padres`
- `GET /api/padres`
- `GET /api/padres/:id`
- `PUT /api/padres/:id`
- `POST /api/entrevistas`
- `GET /api/entrevistas`
- `GET /api/entrevistas/:id`
- `PUT /api/entrevistas/:id`
- `GET /api/catalogos`

## Formato de respuesta

```json
{
  "status": "success",
  "message": "...",
  "data": {}
}
```
