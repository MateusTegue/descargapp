// Script para poblar la base de datos con datos de ejemplo
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Crear algunas versiones de ejemplo
  const version1 = await prisma.version.create({
    data: {
      appName: "A C Soluciones",
      version: "0.0.1",
      build: 1,
      diawiUrl: "https://diawi.com/example1",
      fileSize: 15728640, // 15 MB
      changelog: "Primera versión de la aplicación\n- Funcionalidades básicas\n- Interfaz inicial",
      releaseType: "Release",
      minAndroid: "8.0",
      architectures: "arm64-v8a, armeabi-v7a",
      releaseDate: new Date("2025-11-20T10:00:00Z"),
    },
  })

  const version2 = await prisma.version.create({
    data: {
      appName: "A C Soluciones",
      version: "0.0.2",
      build: 2,
      diawiUrl: "https://diawi.com/example2",
      fileSize: 16777216, // 16 MB
      changelog: "Segunda versión\n- Corrección de bugs\n- Mejoras de rendimiento",
      releaseType: "Release",
      minAndroid: "8.0",
      architectures: "arm64-v8a, armeabi-v7a",
      releaseDate: new Date("2025-11-22T14:30:00Z"),
    },
  })

  const version3 = await prisma.version.create({
    data: {
      appName: "A C Soluciones",
      version: "0.0.3",
      build: 3,
      diawiUrl: "https://diawi.com/example3",
      fileSize: 17301504, // 16.5 MB
      changelog: "Tercera versión\n- Nuevas funcionalidades\n- Actualización de dependencias",
      releaseType: "Pre-release",
      minAndroid: "8.0",
      architectures: "arm64-v8a, armeabi-v7a",
      releaseDate: new Date("2025-11-24T09:15:00Z"),
      expiresAt: new Date("2025-12-01T23:59:59Z"), // Expira en 7 días
    },
  })
}

main()
  .catch((e) => {
    console.error("Error durante el seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

