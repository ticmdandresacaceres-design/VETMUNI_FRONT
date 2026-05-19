'use client'

import { Map, MapTileLayer, MapMarker, MapPopup } from '@/components/ui/map';
import { Home, MapPin } from 'lucide-react';

interface DuenoLocationMapProps {
  latitud: number;
  longitud: number;
  nombre: string;
  direccion: string;
  className?: string;
}

function DuenoLocationMap({ latitud, longitud, nombre, direccion, className = '' }: DuenoLocationMapProps) {
  const lat = latitud;
  const lng = longitud;

  // Validar coordenadas
  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`}>
        <div className="text-center p-4">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Coordenadas no válidas</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border ${className}`}>
      <Map
        center={[lat, lng]}
        zoom={15}
        className="w-full h-full min-h-[300px]"
      >
        <MapTileLayer />
        <MapMarker 
          position={[lat, lng]}
          icon={
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg">
              <Home className="w-4 h-4 text-white" />
            </div>
          }
        >
          <MapPopup>
            <div className="text-center space-y-2 p-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
                <Home className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{nombre}</h3>
                <p className="text-xs text-gray-600 mt-1">{direccion}</p>
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <p>Lat: {lat.toFixed(6)}</p>
                  <p>Lng: {lng.toFixed(6)}</p>
                </div>
              </div>
            </div>
          </MapPopup>
        </MapMarker>
      </Map>
    </div>
  );
}

export default DuenoLocationMap;