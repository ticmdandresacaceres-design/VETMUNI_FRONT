"use client"

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Position {
  lat: number
  lng: number
}

interface MapComponentProps {
  position: Position
  onLocationSelect: (position: Position) => void
}

// Fix para los iconos de Leaflet en Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

// Componente para manejar los clics en el mapa
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (position: Position) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

// Componente para mover el mapa a una nueva posición
function MapController({ position }: { position: Position }) {
  const map = useMap()
  
  useEffect(() => {
    if (map) {
      map.setView([position.lat, position.lng], map.getZoom())
    }
  }, [map, position])
  
  return null
}

export default function MapComponent({ position, onLocationSelect }: MapComponentProps) {
  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      key={`${position.lat}-${position.lng}`} // Forzar re-render cuando cambie la posición
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[position.lat, position.lng]} />
      <MapClickHandler onLocationSelect={onLocationSelect} />
      <MapController position={position} />
    </MapContainer>
  )
}