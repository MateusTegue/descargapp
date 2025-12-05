# Guía de Configuración Local

## 📋 Pasos para Configurar el Proyecto en Local

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

**Nota:** Para documentación detallada de todas las variables de entorno, consulta [docs/ENV_VARIABLES.md](docs/ENV_VARIABLES.md)

```env
# Database Connection - PostgreSQL (Neon)
# Recommended for most uses
DATABASE_URL=postgresql://*****************************************************************************************************/=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://*********************************************************************************************/=require

# Parameters for constructing your own connection string
PGHOST=*******************************************
PGHOST_UNPOOLED=**********************************
PGUSER=***********
PGDATABASE=neondb
PGPASSWORD=***************

# Parameters for Vercel Postgres Templates
POSTGRES_URL=postgresql://********************************************************************************************/=require
POSTGRES_URL_NON_POOLING=postgresql://********************************************************************************/=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-autumn-bush-a467pfc6-pooler.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_MD2yOCvisL5r
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgresql://*************************************************************************************/neondb
POSTGRES_PRISMA_URL=postgresql://*************************************************************/neondb?connect_timeout=15&sslmode=require

# Next.js Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Generar el Cliente de Prisma

```bash
npm run db:generate
```

Este comando genera el cliente de Prisma basado en tu esquema.

### 4. Crear las Tablas en la Base de Datos

```bash
npm run db:push
```

Este comando sincroniza tu esquema Prisma con la base de datos PostgreSQL.

### 5. (Opcional) Poblar la Base de Datos con Datos de Ejemplo

```bash
npm run db:seed
```

Este comando crea algunas versiones de ejemplo para probar la aplicación.

### 6. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run db:generate` - Genera el cliente de Prisma
- `npm run db:push` - Sincroniza el esquema con la base de datos
- `npm run db:migrate` - Crea una migración
- `npm run db:studio` - Abre Prisma Studio (interfaz visual para la BD)
- `npm run db:seed` - Pobla la base de datos con datos de ejemplo

## 🗄️ Prisma Studio

Para ver y editar datos directamente en la base de datos:

```bash
npm run db:studio
```

Esto abrirá una interfaz web en [http://localhost:5555](http://localhost:5555)

## ✅ Verificación de la Conexión

Para verificar que la conexión a la base de datos funciona correctamente, puedes:

1. Ejecutar `npm run db:push` - Si no hay errores, la conexión está funcionando
2. Abrir Prisma Studio con `npm run db:studio` y verificar que puedes ver las tablas
3. Iniciar la aplicación y verificar que no hay errores de conexión en la consola

## 🐛 Solución de Problemas

### Error: "Can't reach database server"

- Verifica que la URL de conexión en `.env` sea correcta
- Asegúrate de que la base de datos Neon esté activa
- Verifica que no haya restricciones de firewall

### Error: "Schema validation error"

- Ejecuta `npm run db:generate` nuevamente
- Verifica que el esquema en `prisma/schema.prisma` sea válido

### Error: "Table already exists"

- Esto es normal si ya ejecutaste `db:push` antes
- Puedes ignorar este error o eliminar las tablas manualmente desde Prisma Studio

