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

## Endpoint inicial

- `GET /api/health`: Verifica que la API y la conexión a PostgreSQL estén funcionando.
