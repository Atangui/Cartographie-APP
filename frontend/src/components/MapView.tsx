import { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import type { GeoZone, GeoEvent } from '../api';
import { zonesAPI, eventsAPI } from '../api';
import './MapView.css';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  zones: GeoZone[];
  events: GeoEvent[];
  selectedZone: GeoZone | null;
  setSelectedZone: (zone: GeoZone | null) => void;
  draggedEvent: GeoEvent | null;
  setDraggedEvent: (event: GeoEvent | null) => void;
  onEventUpdate: () => void;
}

const severityColors: Record<string, string> = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#FF5722',
  critical: '#F44336',
};

// Component to add drawing controls with Geoman
function DrawControl({ onZoneCreated }: { onZoneCreated: () => void }) {
  const map = useMap();

  useEffect(() => {
    // Add Geoman controls to the map
    // @ts-ignore
    map.pm.addControls({
      position: 'topright',
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawMarker: false,
      drawText: false,
      cutPolygon: false,
      editMode: false,
      dragMode: false,
      removalMode: false,
      rotateMode: false,
    });

    // @ts-ignore
    map.pm.setGlobalOptions({
      pathOptions: {
        color: '#9C27B0',
        fillColor: '#9C27B0',
        fillOpacity: 0.3,
      },
    });

    // Listen for shape creation
    // @ts-ignore
    map.on('pm:create', (e: any) => {
      const layer = e.layer;
      const coordinates = layer.getLatLngs()[0].map((latLng: any) => [
        latLng.lng,
        latLng.lat,
      ]);

      coordinates.push(coordinates[0]); // Close the polygon

      const geoJSON = {
        type: 'Polygon',
        coordinates: [coordinates],
      };

      const zoneName = prompt('Nom de la zone:');
      if (zoneName) {
        zonesAPI
          .create({
            name: zoneName,
            description: 'Zone créée sur la carte',
            geometry: geoJSON,
            is_active: true,
          })
          .then(() => {
            alert('Zone créée avec succès!');
            layer.remove();
            onZoneCreated();
          })
          .catch((error) => {
            console.error('Erreur lors de la création de la zone:', error);
            alert('Erreur lors de la création de la zone');
            layer.remove();
          });
      } else {
        layer.remove();
      }
    });

    return () => {
      // @ts-ignore
      map.pm.removeControls();
      // @ts-ignore
      map.off('pm:create');
    };
  }, [map, onZoneCreated]);

  return null;
}

// Component to handle map drop events
function MapDropHandler({ draggedEvent, setDraggedEvent, onEventUpdate }: { 
  draggedEvent: GeoEvent | null; 
  setDraggedEvent: (event: GeoEvent | null) => void;
  onEventUpdate: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!draggedEvent) return;

    const container = map.getContainer();
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedEvent) return;

      // Convert mouse position to map coordinates
      const point = map.mouseEventToLatLng(e as any);
      const { lat, lng } = point;

      try {
        await eventsAPI.update(draggedEvent.id!, {
          ...draggedEvent,
          latitude: lat,
          longitude: lng,
        });
        await eventsAPI.checkGeofencing(draggedEvent.id!);
        setDraggedEvent(null);
        onEventUpdate();
        // Force page reload to show updated event
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors du déplacement:', error);
        alert('Erreur lors du déplacement');
        setDraggedEvent(null);
      }
    };

    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);

    return () => {
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('drop', handleDrop);
    };
  }, [map, draggedEvent, setDraggedEvent, onEventUpdate]);

  return null;
}

const MapView = ({ zones, events, selectedZone, setSelectedZone, draggedEvent, setDraggedEvent, onEventUpdate }: MapViewProps) => {
  const handleZoneCreated = () => {
    window.location.reload();
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[48.8566, 2.3522]} // Paris
        zoom={12}
        style={{ height: '100%', width: '100%', cursor: draggedEvent ? 'crosshair' : 'grab' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <DrawControl onZoneCreated={handleZoneCreated} />
        <MapDropHandler draggedEvent={draggedEvent} setDraggedEvent={setDraggedEvent} onEventUpdate={onEventUpdate} />

        {/* Render zones */}
        {zones.map((zone) => {
          if (zone.geometry && zone.geometry.coordinates) {
            const positions = zone.geometry.coordinates[0].map((coord: [number, number]) => [
              coord[1],
              coord[0],
            ]);
            
            return (
              <Polygon
                key={zone.id}
                positions={positions}
                pathOptions={{
                  color: selectedZone?.id === zone.id ? '#2196F3' : '#9C27B0',
                  fillOpacity: 0.3,
                }}
                eventHandlers={{
                  click: () => setSelectedZone(zone),
                }}
              >
                <Popup>
                  <strong>{zone.name}</strong>
                  <br />
                  {zone.description}
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* Render events */}
        {events.map((event) => {
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${severityColors[event.severity] || '#000'}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          });

          return (
            <Marker
              key={event.id}
              position={[event.latitude, event.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: severityColors[event.severity] }}>
                    {event.title}
                  </h3>
                  <p style={{ margin: '5px 0' }}><strong>Sévérité:</strong> {event.severity}</p>
                  <p style={{ margin: '5px 0' }}>{event.description}</p>
                  {event.event_type_details && (
                    <p style={{ margin: '5px 0' }}>
                      <strong>Type:</strong> {event.event_type_details.name}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
