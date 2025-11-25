# Portal de Descargas – A C Soluciones

Aplicación web para la distribución de versiones APK generadas desde GitHub Actions y subidas a Diawi.

## 🚀 Características

- ✅ Historial completo de versiones con filtros y búsqueda
- ✅ Vista detallada de cada versión con código QR
- ✅ Paginación (10 versiones por página)
- ✅ Filtros por versión, fecha y estado
- ✅ Modo claro/oscuro
- ✅ Diseño responsivo (móvil, tablet, desktop)
- ✅ Integración con PostgreSQL (Neon)
- ✅ API REST para gestión de versiones

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Base de datos PostgreSQL (Neon)

## 🛠️ Instalación

1. Clona el repositorio o navega al directorio del proyecto

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto. Ver `SETUP.md` para la configuración completa o usa el siguiente contenido mínimo:

```env
DATABASE_URL=postgresql://neondb_owner:npg_MD2yOCvisL5r@ep-autumn-bush-a467pfc6-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_MD2yOCvisL5r@ep-autumn-bush-a467pfc6.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Nota**: Para la configuración completa con todas las variables, consulta `SETUP.md`

4. Configura la base de datos:
```bash
npm run db:generate  # Genera el cliente de Prisma
npm run db:push      # Crea las tablas en la base de datos
```

**Opcional**: Poblar con datos de ejemplo:
```bash
npm run db:seed      # Crea versiones de ejemplo para probar
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   └── versions/        # API routes para versiones
│   ├── acerca/              # Página "Acerca del sistema"
│   ├── version/[id]/        # Página de detalles de versión
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página principal (historial)
│   └── globals.css          # Estilos globales
├── components/
│   ├── ui/                  # Componentes de shadcn/ui
│   ├── header.tsx           # Header con navegación
│   ├── version-card.tsx     # Tarjeta de versión
│   ├── version-details.tsx  # Detalles de versión
│   ├── version-list.tsx     # Lista de versiones con filtros
│   └── theme-provider.tsx   # Proveedor de temas
├── lib/
│   ├── prisma.ts            # Cliente de Prisma
│   └── utils.ts             # Utilidades
├── prisma/
│   └── schema.prisma        # Esquema de base de datos
└── types/
    └── version.ts           # Tipos TypeScript
```

## 🔌 API Endpoints

### GET `/api/versions`
Obtiene todas las versiones ordenadas por fecha (más recientes primero)

### POST `/api/versions`
Crea una nueva versión. Body esperado:
```json
{
  "appName": "A C Soluciones",
  "version": "0.0.1",
  "build": 4,
  "diawiUrl": "https://diawi.com/...",
  "fileSize": 12345678,
  "changelog": "Cambios en esta versión...",
  "releaseType": "Release",
  "minAndroid": "8.0",
  "architectures": "arm64-v8a, armeabi-v7a",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

### GET `/api/versions/[id]`
Obtiene una versión específica por ID

## 🔄 Integración con GitHub Actions

**✅ IMPORTANTE**: Esta aplicación usa **Prisma con PostgreSQL (Neon)**, NO Supabase.

Para automatizar la creación de versiones desde GitHub Actions, puedes hacer un POST a tu API:

```yaml
- name: Crear versión en portal
  run: |
    # Endpoint: /api/versiones o /api/versions (ambos funcionan)
    curl -X POST ${{ secrets.PORTAL_API_URL }}/api/versiones \
      -H "Content-Type: application/json" \
      -d '{
        "version": "${{ env.VERSION }}",
        "build": ${{ env.BUILD_NUMBER }},
        "diawi_link": "${{ env.DIAWI_URL }}",
        "fileSize": ${{ env.FILE_SIZE }},
        "changelog": "${{ env.CHANGELOG }}",
        "releaseType": "${{ env.RELEASE_TYPE }}"
      }'
```

**Nota**: El endpoint acepta tanto `diawiUrl` como `diawi_link` para compatibilidad.

Ver la documentación completa en [docs/GITHUB_ACTIONS_INTEGRATION.md](docs/GITHUB_ACTIONS_INTEGRATION.md)

## 🎨 Tecnologías Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos
- **shadcn/ui** - Componentes UI
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL (Neon)** - Base de datos
- **next-themes** - Gestión de temas
- **date-fns** - Manejo de fechas
- **qrcode.react** - Generación de códigos QR

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🚀 Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_APP_URL`
3. Vercel detectará automáticamente Next.js y desplegará la aplicación

## 📄 Licencia

Este proyecto es propiedad de A C Soluciones.

