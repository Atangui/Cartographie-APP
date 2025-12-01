import { useEffect, useState } from 'react';
import type { GeoZone, GeoEvent, EventType } from '../api';
import { zonesAPI, eventsAPI, eventTypesAPI } from '../api';
import './Sidebar.css';

interface SidebarProps {
  zones: GeoZone[];
  setZones: (zones: GeoZone[]) => void;
  events: GeoEvent[];
  setEvents: (events: GeoEvent[]) => void;
  eventTypes: EventType[];
  setEventTypes: (types: EventType[]) => void;
  selectedZone: GeoZone | null;
  setSelectedZone: (zone: GeoZone | null) => void;
  draggedEvent: GeoEvent | null;
  setDraggedEvent: (event: GeoEvent | null) => void;
}

const Sidebar = ({
  zones,
  setZones,
  events,
  setEvents,
  eventTypes,
  setEventTypes,
  selectedZone,
  setSelectedZone,
  setDraggedEvent,
}: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<'zones' | 'events'>('zones');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<GeoEvent | null>(null);
  const [editingZone, setEditingZone] = useState<GeoZone | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    latitude: 48.8566,
    longitude: 2.3522,
    severity: 'low' as const,
    event_type: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchZones();
    fetchEvents();
    fetchEventTypes();
  }, []);

  useEffect(() => {
    // Set default event type when eventTypes are loaded
    if (eventTypes.length > 0 && newEvent.event_type === 0) {
      setNewEvent({ ...newEvent, event_type: eventTypes[0].id! });
    }
  }, [eventTypes]);

  const fetchZones = async () => {
    try {
      const response = await zonesAPI.getAll();
      setZones(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll({ is_active: true });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const response = await eventTypesAPI.getAll();
      setEventTypes(response.data);
    } catch (error) {
      console.error('Error fetching event types:', error);
    }
  };

  const handleDeleteZone = async (id: number) => {
    if (window.confirm('Supprimer cette zone?')) {
      try {
        await zonesAPI.delete(id);
        fetchZones();
      } catch (error) {
        console.error('Error deleting zone:', error);
      }
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('Supprimer cet événement?')) {
      try {
        await eventsAPI.delete(id);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      await eventsAPI.update(editingEvent.id!, {
        title: editingEvent.title,
        description: editingEvent.description,
        latitude: editingEvent.latitude,
        longitude: editingEvent.longitude,
        severity: editingEvent.severity,
        event_type: editingEvent.event_type,
        is_active: editingEvent.is_active,
      });
      await eventsAPI.checkGeofencing(editingEvent.id!);
      fetchEvents();
      setEditingEvent(null);
      alert('Événement modifié!');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Erreur lors de la modification');
    }
  };

  const handleUpdateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;
    
    try {
      await zonesAPI.update(editingZone.id!, {
        name: editingZone.name,
        description: editingZone.description,
        geometry: editingZone.geometry,
        is_active: editingZone.is_active,
      });
      fetchZones();
      setEditingZone(null);
      alert('Zone modifiée!');
    } catch (error) {
      console.error('Error updating zone:', error);
      alert('Erreur lors de la modification');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await eventsAPI.create(newEvent);
      await eventsAPI.checkGeofencing(response.data.id!);
      fetchEvents();
      setShowEventForm(false);
      setNewEvent({
        title: '',
        description: '',
        latitude: 48.8566,
        longitude: 2.3522,
        severity: 'low',
        event_type: eventTypes.length > 0 ? eventTypes[0].id! : 0,
        is_active: true,
      });
      alert('Événement créé et alertes générées!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Erreur lors de la création de l\'événement');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <button
          className={`tab ${activeTab === 'zones' ? 'active' : ''}`}
          onClick={() => setActiveTab('zones')}
        >
          📍 Zones ({zones.length})
        </button>
        <button
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          🚨 Événements ({events.length})
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'zones' && (
          <div className="zones-list">
            <div className="section-header">
              <h3>Zones géographiques</h3>
              <p className="hint">Dessinez des zones sur la carte avec l'outil de dessin</p>
            </div>
            {zones.length === 0 ? (
              <p className="empty-state">Aucune zone créée</p>
            ) : (
              zones.map((zone) => (
                <div key={zone.id}>
                  {editingZone?.id === zone.id ? (
                    <form className="edit-form" onSubmit={handleUpdateZone}>
                      <input
                        type="text"
                        value={editingZone?.name || ''}
                        onChange={(e) => setEditingZone({ ...editingZone!, name: e.target.value })}
                        required
                      />
                      <textarea
                        value={editingZone?.description || ''}
                        onChange={(e) => setEditingZone({ ...editingZone!, description: e.target.value })}
                      />
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">✓</button>
                        <button type="button" className="btn-secondary" onClick={() => setEditingZone(null)}>✕</button>
                      </div>
                    </form>
                  ) : (
                    <div
                      className={`zone-item ${selectedZone?.id === zone.id ? 'selected' : ''}`}
                      onClick={() => setSelectedZone(zone)}
                    >
                      <div className="zone-info">
                        <h4>{zone.name}</h4>
                        <p>{zone.description}</p>
                        <small>{new Date(zone.created_at!).toLocaleDateString()}</small>
                      </div>
                      <div className="item-actions">
                        <button
                          className="edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingZone(zone);
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteZone(zone.id!);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <div className="section-header">
              <h3>Événements simulés</h3>
              <button className="btn-primary" onClick={() => setShowEventForm(!showEventForm)}>
                ➕ Nouvel événement
              </button>
            </div>

            {showEventForm && (
              <form className="event-form" onSubmit={handleCreateEvent}>
                <input
                  type="text"
                  placeholder="Titre"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  required
                />
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Latitude"
                  value={newEvent.latitude}
                  onChange={(e) => setNewEvent({ ...newEvent, latitude: parseFloat(e.target.value) })}
                  required
                />
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Longitude"
                  value={newEvent.longitude}
                  onChange={(e) => setNewEvent({ ...newEvent, longitude: parseFloat(e.target.value) })}
                  required
                />
                <select
                  value={newEvent.severity}
                  onChange={(e) => setNewEvent({ ...newEvent, severity: e.target.value as any })}
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="critical">Critique</option>
                </select>
                <select
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent({ ...newEvent, event_type: parseInt(e.target.value) })}
                  required
                >
                  {eventTypes.length === 0 ? (
                    <option value="">Chargement...</option>
                  ) : (
                    eventTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Créer</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowEventForm(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            )}

            <div className="events-list">
              {events.length === 0 ? (
                <p className="empty-state">Aucun événement actif</p>
              ) : (
                events.map((event) => (
                  <div key={event.id}>
                    {editingEvent?.id === event.id ? (
                      <form className="event-form" onSubmit={handleUpdateEvent}>
                        <input
                          type="text"
                          value={editingEvent?.title || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent!, title: e.target.value })}
                          required
                        />
                        <textarea
                          value={editingEvent?.description || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent!, description: e.target.value })}
                          required
                        />
                        <input
                          type="number"
                          step="0.0001"
                          value={editingEvent?.latitude || 0}
                          onChange={(e) => setEditingEvent({ ...editingEvent!, latitude: parseFloat(e.target.value) })}
                          required
                        />
                        <input
                          type="number"
                          step="0.0001"
                          value={editingEvent?.longitude || 0}
                          onChange={(e) => setEditingEvent({ ...editingEvent!, longitude: parseFloat(e.target.value) })}
                          required
                        />
                        <select
                          value={editingEvent?.severity || 'low'}
                          onChange={(e) => setEditingEvent({ ...editingEvent!, severity: e.target.value as any })}
                        >
                          <option value="low">Faible</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Élevée</option>
                          <option value="critical">Critique</option>
                        </select>
                        <div className="form-actions">
                          <button type="submit" className="btn-primary">✓ Modifier</button>
                          <button type="button" className="btn-secondary" onClick={() => setEditingEvent(null)}>Annuler</button>
                        </div>
                      </form>
                    ) : (
                      <div 
                        className={`event-item severity-${event.severity}`}
                        draggable
                        onDragStart={() => setDraggedEvent(event)}
                        onDragEnd={() => setDraggedEvent(null)}
                      >
                        <div className="event-content">
                          <h4>{event.title}</h4>
                          <p>{event.description}</p>
                          <div className="event-meta">
                            <span className="severity-badge">{event.severity}</span>
                            <span>📍 {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}</span>
                          </div>
                        </div>
                        <div className="item-actions">
                          <button
                            className="edit-btn"
                            onClick={() => setEditingEvent(event)}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteEvent(event.id!)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
