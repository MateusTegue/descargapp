# Guía de Uso de la API

## Endpoints Disponibles

### 1. Obtener todas las versiones

**GET** `/api/versions`

Respuesta exitosa (200):
```json
[
  {
    "id": "clx123...",
    "appName": "A C Soluciones",
    "version": "0.0.1",
    "build": 4,
    "diawiUrl": "https://diawi.com/...",
    "releaseDate": "2025-11-24T10:42:00.000Z",
    "fileSize": 12345678,
    "changelog": "Cambios en esta versión...",
    "releaseType": "Release",
    "minAndroid": "8.0",
    "architectures": "arm64-v8a, armeabi-v7a",
    "expiresAt": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-11-24T10:42:00.000Z",
    "updatedAt": "2025-11-24T10:42:00.000Z"
  }
]
```

### 2. Obtener una versión específica

**GET** `/api/versions/[id]`

Respuesta exitosa (200):
```json
{
  "id": "clx123...",
  "appName": "A C Soluciones",
  "version": "0.0.1",
  "build": 4,
  "diawiUrl": "https://diawi.com/...",
  ...
}
```

Respuesta de error (404):
```json
{
  "error": "Versión no encontrada"
}
```

### 3. Crear una nueva versión

**POST** `/api/versions`

Body requerido:
```json
{
  "version": "0.0.1",        // Requerido
  "build": 4,                // Requerido
  "diawiUrl": "https://...", // Requerido
  "appName": "A C Soluciones", // Opcional (default: "A C Soluciones")
  "fileSize": 12345678,      // Opcional (en bytes)
  "changelog": "...",        // Opcional
  "releaseType": "Release",  // Opcional (default: "Release")
  "minAndroid": "8.0",       // Opcional
  "architectures": "...",    // Opcional
  "expiresAt": "2025-12-31T23:59:59Z" // Opcional (ISO 8601)
}
```

Tipos de release válidos:
- `"Release"`
- `"Pre-release"`
- `"Hotfix"`

Respuesta exitosa (201):
```json
{
  "id": "clx123...",
  "appName": "A C Soluciones",
  "version": "0.0.1",
  ...
}
```

Respuesta de error (400):
```json
{
  "error": "Faltan campos requeridos: version, build, diawiUrl"
}
```

## Ejemplos de Uso

### Desde JavaScript/TypeScript

```typescript
// Obtener todas las versiones
const response = await fetch('https://tu-portal.com/api/versions')
const versions = await response.json()

// Crear una nueva versión
const newVersion = await fetch('https://tu-portal.com/api/versions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: '0.0.2',
    build: 5,
    diawiUrl: 'https://diawi.com/abc123',
    changelog: 'Nuevas funcionalidades',
    releaseType: 'Release',
  }),
})
const created = await newVersion.json()
```

### Desde cURL

```bash
# Obtener todas las versiones
curl https://tu-portal.com/api/versions

# Crear una nueva versión
curl -X POST https://tu-portal.com/api/versions \
  -H "Content-Type: application/json" \
  -d '{
    "version": "0.0.2",
    "build": 5,
    "diawiUrl": "https://diawi.com/abc123",
    "changelog": "Nuevas funcionalidades"
  }'
```

### Desde GitHub Actions

```yaml
- name: Crear versión en portal
  run: |
    curl -X POST ${{ secrets.PORTAL_API_URL }}/api/versions \
      -H "Content-Type: application/json" \
      -d "{
        \"version\": \"${{ env.VERSION }}\",
        \"build\": ${{ env.BUILD_NUMBER }},
        \"diawiUrl\": \"${{ env.DIAWI_URL }}\",
        \"fileSize\": ${{ env.FILE_SIZE }},
        \"changelog\": \"${{ env.CHANGELOG }}\",
        \"releaseType\": \"${{ env.RELEASE_TYPE }}\"
      }"
```

## Notas Importantes

- Todas las fechas deben estar en formato ISO 8601 (UTC)
- El `fileSize` debe estar en bytes
- El `build` debe ser un número entero
- La URL de Diawi debe ser válida y accesible
- El portal no requiere autenticación por defecto (considera agregar seguridad en producción)

