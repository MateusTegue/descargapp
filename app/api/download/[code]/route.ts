import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Endpoint proxy para descargar APKs desde Diawi
 * Evita redirecciones y permite descargar directamente desde nuestro dominio
 */
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    if (!code) {
      return NextResponse.json(
        { error: "Código de Diawi requerido" },
        { status: 400 }
      )
    }

    console.log("📥 [Download Proxy] Obteniendo URL del APK para código:", code)

    // Primero, obtener la página de Diawi para extraer la URL real del APK
    const installPageUrl = `https://webapp.diawi.com/install/${code}`
    
    const pageResponse = await fetch(installPageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (!pageResponse.ok) {
      console.error("❌ [Download Proxy] Error al obtener página de Diawi:", pageResponse.status)
      return NextResponse.json(
        { error: "Error al obtener información del APK" },
        { status: pageResponse.status }
      )
    }

    const html = await pageResponse.text()
    
    // Extraer la URL real del APK del HTML
    // Buscar el patrón: href="https://a3.files.diawi.com/app-file/XXXXX.apk"
    const apkUrlMatch = html.match(/href="(https:\/\/[^"]+\.files\.diawi\.com\/app-file\/[^"]+\.apk)"/)
    
    if (!apkUrlMatch || !apkUrlMatch[1]) {
      console.error("❌ [Download Proxy] No se pudo encontrar la URL del APK en el HTML")
      // Fallback: intentar con la URL directa
      const fallbackUrl = `https://i.diawi.com/${code}`
      console.log("🔄 [Download Proxy] Intentando con URL fallback:", fallbackUrl)
      
      const fallbackResponse = await fetch(fallbackUrl, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/vnd.android.package-archive, application/octet-stream, */*",
        },
        redirect: "follow",
      })

      if (!fallbackResponse.ok) {
        return NextResponse.json(
          { error: "No se pudo obtener el APK" },
          { status: fallbackResponse.status }
        )
      }

      const contentType = fallbackResponse.headers.get("content-type") || ""
      
      // Si es HTML, significa que redirigió a la página
      if (contentType.includes("text/html")) {
        return NextResponse.json(
          { error: "No se pudo obtener el APK. El enlace puede haber expirado." },
          { status: 404 }
        )
      }

      const blob = await fallbackResponse.blob()
      const arrayBuffer = await blob.arrayBuffer()

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.android.package-archive",
          "Content-Disposition": `attachment; filename="app.apk"`,
          "Content-Length": blob.size.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      })
    }

    const apkUrl = apkUrlMatch[1]
    console.log("✅ [Download Proxy] URL del APK encontrada:", apkUrl)

    // Descargar el APK desde la URL real
    const apkResponse = await fetch(apkUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/vnd.android.package-archive, application/octet-stream, */*",
      },
    })

    if (!apkResponse.ok) {
      console.error("❌ [Download Proxy] Error al descargar APK:", apkResponse.status)
      return NextResponse.json(
        { error: "Error al descargar el APK" },
        { status: apkResponse.status }
      )
    }

    // Obtener el blob del APK
    const blob = await apkResponse.blob()
    const arrayBuffer = await blob.arrayBuffer()

    console.log("✅ [Download Proxy] APK descargado exitosamente, tamaño:", blob.size)

    // Retornar el APK con headers apropiados para forzar la descarga
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": `attachment; filename="app.apk"`,
        "Content-Length": blob.size.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    })
  } catch (error) {
    console.error("❌ [Download Proxy] Error:", error)
    return NextResponse.json(
      { error: "Error al procesar la descarga" },
      { status: 500 }
    )
  }
}

