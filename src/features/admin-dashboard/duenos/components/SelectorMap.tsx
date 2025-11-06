"use client"

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Locate, Search, X } from 'lucide-react'
import { toast } from 'sonner'

interface Position {
  lat: number
  lng: number
}

interface SelectorMapProps {
  initialPosition?: Position
  onPositionChange: (position: Position) => void
  height?: string
}

interface SearchResult {
  display_name: string
  lat: string
  lon: string
  importance: number
}

// Componente completo del mapa importado dinámicamente
const DynamicMapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    )
  }
)

export default function SelectorMap({ 
  initialPosition = { lat: -13.162478965136607, lng: -74.2133831059749 },
  onPositionChange,
  height = "300px"
}: SelectorMapProps) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isClient, setIsClient] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Asegurar que el componente se renderice solo en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Cerrar resultados al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showResults])

  const handlePositionChange = useCallback((newPosition: Position) => {
    setPosition(newPosition)
    onPositionChange(newPosition)
  }, [onPositionChange])

  const handleManualInput = (field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      const newPosition = { ...position, [field]: numValue }
      handlePositionChange(newPosition)
    }
  }

  const getCurrentLocation = () => {
    if (typeof window === 'undefined') return
    
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          handlePositionChange(newPos)
          setIsLoadingLocation(false)
          toast.success('Ubicación obtenida exitosamente')
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error)
          setIsLoadingLocation(false)
          toast.error('No se pudo obtener la ubicación actual')
        }
      )
    } else {
      setIsLoadingLocation(false)
      toast.error('Geolocalización no soportada en este navegador')
    }
  }

  // Función para buscar direcciones usando Nominatim API
  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=pe&limit=5&addressdetails=1`
      )
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda')
      }
      
      const data: SearchResult[] = await response.json()
      setSearchResults(data)
      setShowResults(data.length > 0 || query.trim().length > 0)
    } catch (error) {
      console.error('Error searching address:', error)
      toast.error('Error al buscar la dirección')
      setSearchResults([])
      setShowResults(false)
    } finally {
      setIsSearching(false)
    }
  }

  // Debounce para la búsqueda
  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    if (value.trim()) {
      setShowResults(true)
      searchTimeoutRef.current = setTimeout(() => {
        searchAddress(value)
      }, 500)
    } else {
      setShowResults(false)
      setSearchResults([])
    }
  }

  const selectSearchResult = (result: SearchResult) => {
    const newPosition = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    }
    handlePositionChange(newPosition)
    setSearchQuery(result.display_name)
    setShowResults(false)
    toast.success('Ubicación seleccionada')
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
  }

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Solo renderizar después de la hidratación
  if (!isClient) {
    return (
      <div 
        className="w-full bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    )
  }

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <Label className="text-sm font-medium">Seleccionar Ubicación</Label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className="inline-flex items-center gap-2 h-8 px-3 text-xs border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Locate className="h-3 w-3" />
          {isLoadingLocation ? 'Obteniendo...' : 'Mi ubicación'}
        </button>
      </div>

      {/* Buscador de direcciones */}
      <div className="relative z-50 shrink-0" ref={searchContainerRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-600 z-10" />
          <Input
            type="text"
            placeholder="Buscar dirección (ej: Av. Javier Prado, Lima)"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim() && (searchResults.length > 0 || isSearching)) {
                setShowResults(true)
              }
            }}
            className="pl-9 pr-8 relative z-10 text-gray-600 h-8 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 z-10 hover:bg-gray-100 rounded"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          )}
        </div>

        {/* Resultados de búsqueda */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 z-[999] mt-1 bg-white border border-gray-200 rounded-md shadow-xl max-h-40 overflow-y-auto">
            {isSearching && (
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  Buscando direcciones...
                </div>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <>
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSearchResult(result)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.display_name.split(',')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {result.display_name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {!isSearching && searchResults.length === 0 && searchQuery.trim() && (
              <div className="p-4">
                <div className="text-sm text-gray-500 text-center">
                  No se encontraron resultados para "{searchQuery}"
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mapa con altura flexible */}
      <div className="border rounded-lg overflow-hidden relative z-10 flex-1 min-h-0">
        <DynamicMapComponent position={position} onLocationSelect={handlePositionChange} />
      </div>

      <div className="grid grid-cols-2 gap-3 shrink-0">
        <div>
          <Label htmlFor="latitude" className="text-xs">Latitud</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={position.lat.toFixed(6)}
            onChange={(e) => handleManualInput('lat', e.target.value)}
            placeholder="-12.0464"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label htmlFor="longitude" className="text-xs">Longitud</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={position.lng.toFixed(6)}
            onChange={(e) => handleManualInput('lng', e.target.value)}
            placeholder="-77.0428"
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
        <MapPin className="h-3 w-3" />
        Haz clic en el mapa, busca una dirección o usa tu ubicación actual
      </div>
    </div>
  )
}