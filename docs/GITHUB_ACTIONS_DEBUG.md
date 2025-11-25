# Debug de GitHub Actions con la API

## 🔍 Logs en la API

La API ahora incluye logs detallados para ayudar a debuggear las llamadas desde GitHub Actions.

### Logs que verás en la consola del servidor:

1. **🔔 Inicio de la petición**
   - Muestra cuando se recibe una petición POST
   - Indica el endpoint (`/api/versions` o `/api/versiones`)

2. **📥 Headers recibidos**
   - Muestra todos los headers de la petición
   - Útil para verificar autenticación, content-type, etc.

3. **📦 Body recibido**
   - Muestra el JSON completo que se está enviando
   - Permite verificar que los datos lleguen correctamente

4. **🔍 Datos extraídos**
   - Muestra los valores específicos extraídos del body
   - Incluye: version, build, diawiUrl/diawi_link, etc.

5. **🔗 URL final de Diawi**
   - Muestra qué URL se usará (diawiUrl o diawi_link)

6. **💾 Guardando en base de datos**
   - Indica cuando comienza a guardar en PostgreSQL

7. **✅ Versión creada exitosamente**
   - Muestra el ID, versión y build de la versión creada

8. **❌ Errores**
   - Muestra detalles completos de cualquier error

## 📋 Ejemplo de Workflow de GitHub Actions

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
      
      - name: Read version from pubspec.yaml
        id: version_reader
        run: |
          VERSION_LINE=$(grep '^version:' pubspec.yaml)
          VERSION=$(echo $VERSION_LINE | cut -d ' ' -f2 | cut -d '+' -f1)
          BUILD=$(echo $VERSION_LINE | cut -d '+' -f2)
          echo "APK_VERSION=$VERSION" >> $GITHUB_ENV
          echo "APK_BUILD=$BUILD" >> $GITHUB_ENV
          echo "📦 Versión extraída: $VERSION"
          echo "🔢 Build extraído: $BUILD"
      
      - name: Build APK
        run: |
          # Tu comando para construir el APK
          ./gradlew assembleRelease
      
      - name: Subir a Diawi
        id: diawi_poll
        run: |
          # Aquí subes el APK a Diawi y obtienes el link
          DIAWI_LINK="https://diawi.com/abc123"  # Reemplaza con el link real
          echo "link=$DIAWI_LINK" >> $GITHUB_OUTPUT
          echo "🔗 Link de Diawi: $DIAWI_LINK"
      
      - name: Save metadata to API
        run: |
          echo "📤 Enviando datos a la API..."
          echo "   Versión: ${{ env.APK_VERSION }}"
          echo "   Build: ${{ env.APK_BUILD }}"
          echo "   Diawi Link: ${{ steps.diawi_poll.outputs.link }}"
          
          curl -X POST "${{ secrets.API_URL }}/api/versiones" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.API_KEY }}" \
            -d "{
              \"version\": \"${{ env.APK_VERSION }}\",
              \"build\": \"${{ env.APK_BUILD }}\",
              \"diawi_link\": \"${{ steps.diawi_poll.outputs.link }}\"
            }" \
            -v  # Flag -v para ver detalles de la petición
          
          echo "✅ Petición enviada"
```

## 🔧 Ver los Logs

### En Desarrollo Local

1. Inicia el servidor:
```bash
npm run dev
```

2. Los logs aparecerán en la terminal donde ejecutaste `npm run dev`

### En Producción (Vercel)

1. Ve a tu proyecto en Vercel
2. Navega a **Deployments** → Selecciona el deployment
3. Haz clic en **Functions** → Busca `/api/versions` o `/api/versiones`
4. Los logs aparecerán en tiempo real

### En Vercel Dashboard

1. Ve a **Settings** → **Logs**
2. Filtra por función: `api/versions` o `api/versiones`
3. Verás todos los logs en tiempo real

## 🐛 Troubleshooting

### No veo logs en la consola

- Verifica que el servidor esté corriendo
- Asegúrate de estar mirando la terminal correcta
- En producción, verifica los logs de Vercel

### La petición no llega a la API

- Verifica que `API_URL` esté configurado correctamente en GitHub Secrets
- Verifica que el endpoint sea correcto (`/api/versiones` o `/api/versions`)
- Revisa los logs de GitHub Actions para ver el error de curl

### Error 400: Faltan campos requeridos

- Verifica que `version`, `build` y `diawi_link` estén presentes
- Revisa los logs de la API para ver qué datos llegaron
- Verifica que el JSON esté bien formateado

### Error 500: Error al crear la versión

- Revisa los logs de la API para ver el error específico
- Verifica que la base de datos esté accesible
- Verifica que Prisma esté configurado correctamente

## 📝 Notas Importantes

- Los logs incluyen emojis para facilitar la lectura
- Todos los datos sensibles (como passwords) NO se loguean
- Los logs se muestran en formato JSON para facilitar el debugging
- En producción, considera reducir el nivel de logging para evitar logs excesivos

