import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

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

    const installPageUrl = `https://webapp.diawi.com/install/${code}`
    
    const pageResponse = await fetch(installPageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (!pageResponse.ok) {
      console.error("[Download Proxy] Error al obtener página de Diawi:", pageResponse.status)
      return NextResponse.json(
        { error: "Error al obtener información del APK" },
        { status: pageResponse.status }
      )
    }

    const html = await pageResponse.text()
    
    const apkUrlMatch = html.match(/href="(https:\/\/[^"]+\.files\.diawi\.com\/app-file\/[^"]+\.apk)"/)
    
    const sizeMatch = html.match(/<div class="item-title">Size<\/div>\s*<div class="item-after">([^<]+)<\/div>/)
    let fileSize: number | null = null
    
    if (sizeMatch && sizeMatch[1]) {
      const sizeText = sizeMatch[1].trim()
      // Convertir de "57.26 MB" a bytes
      const sizeMatchMB = sizeText.match(/([\d.]+)\s*MB/i)
      if (sizeMatchMB) {
        const sizeInMB = parseFloat(sizeMatchMB[1])
        fileSize = Math.round(sizeInMB * 1024 * 1024) 
      }
    }
    
    if (!apkUrlMatch || !apkUrlMatch[1]) {
      console.error("[Download Proxy] No se pudo encontrar la URL del APK en el HTML")
      // Fallback: intentar con la URL directa
      const fallbackUrl = `https://i.diawi.com/${code}`
      
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
          "Content-Disposition": `attachment; filename="app.apk"; filename*=UTF-8''app.apk`,
          "Content-Length": blob.size.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "X-Content-Type-Options": "nosniff",
          "Accept-Ranges": "bytes",
        },
      })
    }

    const apkUrl = apkUrlMatch[1]

    // Descargar el APK desde la URL real
    const apkResponse = await fetch(apkUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/vnd.android.package-archive, application/octet-stream, */*",
      },
    })

    if (!apkResponse.ok) {
      console.error("[Download Proxy] Error al descargar APK:", apkResponse.status)
      return NextResponse.json(
        { error: "Error al descargar el APK" },
        { status: apkResponse.status }
      )
    }

    // Obtener el blob del APK
    const blob = await apkResponse.blob()
    const arrayBuffer = await blob.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": `attachment; filename="app.apk"; filename*=UTF-8''app.apk`,
        "Content-Length": blob.size.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-Content-Type-Options": "nosniff",
        "Accept-Ranges": "bytes",
      },
    })
  } catch (error) {
    console.error("[Download Proxy] Error:", error)
    return NextResponse.json(
      { error: "Error al procesar la descarga" },
      { status: 500 }
    )
  }
}

