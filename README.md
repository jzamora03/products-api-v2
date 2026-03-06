# Products API

API REST de Productos y Categorías con frontend React.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | ASP.NET Core 10, Entity Framework Core, PostgreSQL |
| Frontend | React 18 + TypeScript (Vite) |
| Auth | JWT (JwtBearer) |
| DevOps | Docker, docker-compose, GitHub Actions |

---

## Inicio rápido

### Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **corriendo**

### Ejecutar
```bash
git clone https://github.com/jzamora03/products-api-dotnet
cd products-api-dotnet

# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env

docker-compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API | http://localhost:5073 |
| Swagger | http://localhost:5073/swagger |

### Credenciales demo
- Usuario: `admin`
- Contraseña: `admin123`

---

## Desarrollo local (sin Docker)

**Backend**
```bash
cd ProductosAPI.API
dotnet restore
dotnet run
```

**Frontend**
```bash
cd productos-front
npm install
npm run dev
```

---

## Primeros pasos

Una vez levantado el proyecto:

### 1. Crear categorías
Ir a http://localhost:4200, hacer login y crear categorías desde el botón **🏷️ Categoría**.

O desde Swagger en http://localhost:5073/swagger:
```json
POST /Category
{ "name": "SERVIDORES" }

POST /Category
{ "name": "CLOUD" }
```

### 2. Cargar 100.000 productos
Ir a **⚡ Carga masiva**, seleccionar categoría, ingresar `100000` y clic en **Insertar**.

O desde Swagger:
```json
POST /Product/bulk
{
  "count": 100000,
  "categoryId": "uuid-de-la-categoria"
}
```

---

## Endpoints principales

### Auth
```
POST /auth/login      → Obtener JWT
POST /auth/register   → Registrar usuario
```

### Categorías (requiere Bearer token)
```
POST   /Category
GET    /Category
PUT    /Category/{id}
DELETE /Category/{id}
```

### Productos (requiere Bearer token)
```
POST   /Product           → Crear producto
POST   /Product/bulk      → Carga masiva { count, categoryId }
GET    /Product           → Listar con filtros y paginación
GET    /Product/{id}      → Detalle con foto de categoría
PUT    /Product/{id}      → Actualizar
DELETE /Product/{id}      → Eliminar
```

**Filtros disponibles en GET /Product:**
`page`, `limit`, `search`, `categoryId`, `discontinued`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`

---

## Decisiones Arquitectónicas

### 1. Arquitectura en Capas (Layered Architecture)
Se optó por una arquitectura en capas con separación clara entre `Domain`, `Application` e `Infrastructure`. Cada capa tiene responsabilidades definidas: las entidades viven en `Domain`, la lógica de negocio en `Application/Services`, y el acceso a datos en `Infrastructure/Data`.

### 2. DTOs y mapeo explícito
Nunca se expone una entidad de Entity Framework directamente. Cada respuesta pasa por un DTO con un método estático `FromEntity()` que mapea explícitamente los campos, protegiendo el modelo de datos interno.

### 3. Bulk Insert por batches
Para soportar la carga de 100.000 productos se insertan lotes de 1.000 registros usando `AddRangeAsync` + `SaveChangesAsync`. Esto reduce los roundtrips a la base de datos de 100.000 a ~100, logrando la inserción en segundos.

### 4. JWT Stateless
La autenticación es completamente stateless. El token JWT contiene el `username` en los claims, permitiendo que cualquier instancia de la API valide el token sin consultar la base de datos.

### 5. React con Vite + TypeScript
Se usa Vite como bundler por su velocidad en desarrollo y builds optimizados. Los tipos de TypeScript están separados con `import type` para cumplir con `verbatimModuleSyntax` y generar bundles más limpios.

---

## Escalado horizontal en Cloud
```
Internet → CDN/Load Balancer (AWS ALB)
                ↓
   [API Pod] [API Pod] [API Pod]  ← Auto Scaling Group
                ↓
   PostgreSQL RDS Multi-AZ + Redis ElastiCache
```

**Estrategia:**
1. **API stateless** con JWT → cualquier pod atiende cualquier request
2. **Connection pooling** con Npgsql para optimizar conexiones a PostgreSQL
3. **Cache distribuida** con Redis para endpoints de alta lectura
4. **Read replicas** en RDS para consultas GET de alta concurrencia
5. **Cola de mensajes** (Azure Service Bus / AWS SQS) para bulk inserts mayores a 500k
6. **CDN** (S3 + CloudFront) para servir el frontend React estático

---

## CI/CD

GitHub Actions corre automáticamente en cada push:
- ✅ Backend — Build
- ✅ Frontend — Build de producción
- ✅ Docker — Build de ambas imágenes