Inventario Angular + NestJS + PostgreSQL

Estructura
- `backend/`: API NestJS con TypeORM y PostgreSQL
- `frontend/`: Angular (standalone) con rutas, vistas y gráficas (ng2-charts)
- `docker-compose.yml`: orquesta DB, backend y frontend

Endpoints principales
- Productos: `GET/POST/PUT/DELETE /products`
- Ventas: `GET /sales`, `POST /sales`
- Reportes: `GET /reports/summary`, `GET /reports/top-products`

Desarrollo con Docker
1. Configura variables opcionales en `.env` (o usa las por defecto del compose)
2. Ejecuta: `docker compose up --build`
3. Frontend: http://localhost:4200 — Backend: http://localhost:3000 — Postgres: localhost:5432

Notas
- TypeORM `synchronize: true` para simplificar. En producción usa migraciones.
- El frontend asume API en `http://localhost:3000`.

