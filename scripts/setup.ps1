# Script de configuración inicial del proyecto (PowerShell)
# Ejecutar con: .\scripts\setup.ps1

Write-Host "🚀 Configurando Portal de Descargas - A C Soluciones" -ForegroundColor Cyan
Write-Host ""

# Verificar que existe .env
if (-Not (Test-Path .env)) {
    Write-Host "❌ No se encontró el archivo .env" -ForegroundColor Red
    Write-Host "📝 Por favor, crea el archivo .env con la configuración de la base de datos" -ForegroundColor Yellow
    Write-Host "   Puedes usar SETUP.md como referencia" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
Write-Host ""

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
Write-Host ""

# Generar cliente de Prisma
Write-Host "🔧 Generando cliente de Prisma..." -ForegroundColor Cyan
npm run db:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al generar el cliente de Prisma" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Cliente de Prisma generado" -ForegroundColor Green
Write-Host ""

# Crear tablas en la base de datos
Write-Host "🗄️  Creando tablas en la base de datos..." -ForegroundColor Cyan
npm run db:push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al crear las tablas" -ForegroundColor Red
    Write-Host "⚠️  Verifica la conexión a la base de datos en .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Tablas creadas exitosamente" -ForegroundColor Green
Write-Host ""

# Preguntar si quiere poblar con datos de ejemplo
$response = Read-Host "¿Deseas poblar la base de datos con datos de ejemplo? (s/n)"

if ($response -eq "s" -or $response -eq "S") {
    Write-Host "🌱 Poblando base de datos con datos de ejemplo..." -ForegroundColor Cyan
    npm run db:seed
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Error al poblar la base de datos (puede que ya existan datos)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Datos de ejemplo creados" -ForegroundColor Green
    }
    Write-Host ""
}

Write-Host "🎉 Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el servidor de desarrollo, ejecuta:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "La aplicación estará disponible en: http://localhost:3000" -ForegroundColor Cyan

