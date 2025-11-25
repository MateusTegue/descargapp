"use client"

import { useEffect, useState } from "react"
import { VersionCard } from "@/components/version-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import type { Version } from "@/types/version"

const ITEMS_PER_PAGE = 10

export const VersionList = () => {
  const [versions, setVersions] = useState<Version[]>([])
  const [filteredVersions, setFilteredVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [versionFilter, setVersionFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch("/api/versions")
        if (response.ok) {
          const data = await response.json()
          setVersions(data)
          setFilteredVersions(data)
        }
      } catch (error) {
        console.error("Error fetching versions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVersions()
  }, [])

  useEffect(() => {
    let filtered = [...versions]

    // Filtro de búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.changelog?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtro de versión
    if (versionFilter !== "all") {
      filtered = filtered.filter((v) => v.version === versionFilter)
    }

    // Filtro de estado
    if (statusFilter !== "all") {
      const now = new Date()
      filtered = filtered.filter((v) => {
        if (!v.expiresAt) {
          return statusFilter === "available"
        }
        const expiresAt = new Date(v.expiresAt)
        const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        if (statusFilter === "expired") return diffDays < 0
        if (statusFilter === "expiring") return diffDays >= 0 && diffDays <= 7
        if (statusFilter === "available") return diffDays > 7 || !v.expiresAt
        return true
      })
    }

    setFilteredVersions(filtered)
    setCurrentPage(1)
  }, [searchQuery, versionFilter, statusFilter, versions])

  const totalPages = Math.ceil(filteredVersions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedVersions = filteredVersions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const uniqueVersions = Array.from(new Set(versions.map((v) => v.version))).sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Cargando versiones...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={versionFilter} onValueChange={setVersionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por versión" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las versiones</SelectItem>
            {uniqueVersions.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="expiring">Expira pronto</SelectItem>
            <SelectItem value="expired">Expirada</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center text-sm text-muted-foreground">
          {filteredVersions.length} versión{filteredVersions.length !== 1 ? "es" : ""} encontrada{filteredVersions.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Lista de versiones */}
      {paginatedVersions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron versiones</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedVersions.map((version) => (
            <VersionCard key={version.id} version={version} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

