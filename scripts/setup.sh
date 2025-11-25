#!/bin/bash

# Script de configuración inicial del proyecto
# Ejecutar con: bash scripts/setup.sh

echo "🚀 Configurando Portal de Descargas - A C Soluciones"
echo ""

# Verificar que existe .env
if [ ! -f .env ]; then
    echo "❌ No se encontró el archivo .env"
    echo "📝 Por favor, crea el archivo .env con la configuración de la base de datos"
    echo "   Puedes usar SETUP.md como referencia"
    exit 1
fi

echo "✅ Archivo .env encontrado"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# Generar cliente de Prisma
echo "🔧 Generando cliente de Prisma..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Error al generar el cliente de Prisma"
    exit 1
fi

echo "✅ Cliente de Prisma generado"
echo ""

# Crear tablas en la base de datos
echo "🗄️  Creando tablas en la base de datos..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Error al crear las tablas"
    echo "⚠️  Verifica la conexión a la base de datos en .env"
    exit 1
fi

echo "✅ Tablas creadas exitosamente"
echo ""

# Preguntar si quiere poblar con datos de ejemplo
read -p "¿Deseas poblar la base de datos con datos de ejemplo? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🌱 Poblando base de datos con datos de ejemplo..."
    npm run db:seed
    
    if [ $? -ne 0 ]; then
        echo "⚠️  Error al poblar la base de datos (puede que ya existan datos)"
    else
        echo "✅ Datos de ejemplo creados"
    fi
    echo ""
fi

echo "🎉 Configuración completada!"
echo ""
echo "Para iniciar el servidor de desarrollo, ejecuta:"
echo "  npm run dev"
echo ""
echo "La aplicación estará disponible en: http://localhost:3000"

