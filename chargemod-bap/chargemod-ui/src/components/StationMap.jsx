

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons for Leaflet in bundlers
import 'leaflet/dist/leaflet.css';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png?url';
import icon1x from 'leaflet/dist/images/marker-icon.png?url';
import iconShadow from 'leaflet/dist/images/marker-shadow.png?url';

const DefaultIcon = L.icon({
  iconUrl: icon1x,
  iconRetinaUrl: icon2x,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const isValidLatLng = (p) =>
  p &&
  typeof p.lat === 'number' &&
  typeof p.lng === 'number' &&
  Number.isFinite(p.lat) &&
  Number.isFinite(p.lng) &&
  p.lat >= -90 && p.lat <= 90 &&
  p.lng >= -180 && p.lng <= 180;

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

export default function StationMap({ stations = [], userLocation }) {
  const validStations = useMemo(
    () => (Array.isArray(stations) ? stations.filter(s => isValidLatLng({ lat: s?.lat, lng: s?.lng })) : []),
    [stations]
  );

  const center = useMemo(() => {
    if (isValidLatLng(userLocation)) return userLocation;
    if (validStations.length > 0) return { lat: validStations[0].lat, lng: validStations[0].lng };
    return DEFAULT_CENTER;
  }, [userLocation, validStations]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {isValidLatLng(userLocation) && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You're here</Popup>
          </Marker>
        )}
        {validStations.map((s) => (
          <Marker key={s.id ?? `${s.lat},${s.lng}`} position={[s.lat, s.lng]}>
            <Popup>{s.name ?? 'Charging Station'}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


