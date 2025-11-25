# Integración con GitHub Actions

Esta guía explica cómo integrar GitHub Actions con tu API de Next.js para crear versiones automáticamente.

## ✅ Verificación: Usando tu API (NO Supabase)

**IMPORTANTE**: Esta aplicación usa **Prisma con PostgreSQL (Neon)**, NO Supabase.

- ✅ Endpoint: `POST /api/versiones` o `POST /api/versions`
- ✅ Base de datos: PostgreSQL (Neon) mediante Prisma
- ✅ ORM: Prisma Client

## Configuración en GitHub Actions

### Paso 1: Agregar Secret en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Agrega un nuevo secret:
   - **Nombre**: `PORTAL_API_URL`
   - **Valor**: `https://tu-dominio.com` (o `http://localhost:3000` para desarrollo)

### Paso 2: Crear el Workflow

Crea un archivo `.github/workflows/create-version.yml`:

```yaml
name: Crear Versión en Portal

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Número de versión (ej: 0.0.1)'
        required: true
      build:
        description: 'Número de build'
        required: true
      diawi_url:
        description: 'URL de Diawi'
        required: true
      changelog:
        description: 'Changelog (opcional)'
        required: false

jobs:
  create-version:
    runs-on: ubuntu-latest
    steps:
      - name: Crear versión en portal
        env:
          PORTAL_API_URL: ${{ secrets.PORTAL_API_URL }}
          VERSION: ${{ github.event.inputs.version }}
          BUILD: ${{ github.event.inputs.build }}
          DIAWI_URL: ${{ github.event.inputs.diawi_url }}
          CHANGELOG: ${{ github.event.inputs.changelog }}
        run: |
          curl -X POST "$PORTAL_API_URL/api/versiones" \
            -H "Content-Type: application/json" \
            -d "{
              \"version\": \"$VERSION\",
              \"build\": $BUILD,
              \"diawi_link\": \"$DIAWI_URL\",
              \"changelog\": \"$CHANGELOG\",
              \"releaseType\": \"Release\"
            }"
```

### Paso 3: Integración Automática en Build

Si quieres que se cree automáticamente después de subir a Diawi:

```yaml
name: Build y Publicar APK

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build APK
        run: |
          # Tu comando para construir el APK
          ./gradlew assembleRelease
      
      - name: Subir a Diawi
        id: diawi
        run: |
          DIAWI_URL=$(curl -s -X POST "https://upload.diawi.com/" \
            -F "file=@app/build/outputs/apk/release/app-release.apk" \
            -F "token=${{ secrets.DIAWI_TOKEN }}" | jq -r '.job')
          
          echo "url=$DIAWI_URL" >> $GITHUB_OUTPUT
      
      - name: Crear versión en portal
        run: |
          curl -X POST "${{ secrets.PORTAL_API_URL }}/api/versiones" \
            -H "Content-Type: application/json" \
            -d "{
              \"version\": \"${GITHUB_REF#refs/tags/}\",
              \"build\": ${{ github.run_number }},
              \"diawi_link\": \"${{ steps.diawi.outputs.url }}\",
              \"changelog\": \"$(git log -1 --pretty=%B)\",
              \"releaseType\": \"Release\"
            }"
```

## Campos Aceptados

El endpoint acepta los siguientes campos:

### Requeridos:
- `version` (string): Número de versión (ej: "0.0.1")
- `build` (number): Número de build
- `diawiUrl` o `diawi_link` (string): URL de Diawi

### Opcionales:
- `appName` (string): Nombre de la app (default: "A C Soluciones")
- `fileSize` (number): Tamaño en bytes
- `changelog` (string): Notas de cambios
- `releaseType` (string): "Release", "Pre-release", "Hotfix"
- `minAndroid` (string): Versión mínima de Android
- `architectures` (string): Arquitecturas soportadas
- `expiresAt` (string): Fecha de expiración (ISO 8601)

## Ejemplo de Respuesta

```json
{
  "message": "Versión registrada",
  "version": {
    "id": "clx123...",
    "appName": "A C Soluciones",
    "version": "0.0.1",
    "build": 4,
    "diawiUrl": "https://diawi.com/...",
    "releaseDate": "2025-11-24T10:42:00.000Z",
    ...
  }
}
```

## Verificación

Para verificar que funciona:

1. Ejecuta el workflow manualmente desde GitHub Actions
2. Verifica que la versión aparezca en el portal
3. Revisa los logs del workflow para ver errores

## Troubleshooting

### Error: "Faltan campos requeridos"
- Verifica que `version`, `build` y `diawi_link` estén presentes
- Asegúrate de que el JSON esté bien formateado

### Error: "Error al crear la versión"
- Verifica que la base de datos esté accesible
- Revisa los logs del servidor Next.js
- Verifica que Prisma esté configurado correctamente

### Error de conexión
- Verifica que `PORTAL_API_URL` esté configurado correctamente
- Asegúrate de que el servidor esté en ejecución
- Verifica que la URL sea accesible desde internet (no localhost en producción)

