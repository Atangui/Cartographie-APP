import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GeoZone {
  id?: number;
  name: string;
  description: string;
  geometry: any;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

export interface EventType {
  id?: number;
  name: string;
  icon: string;
  color: string;
}

export interface GeoEvent {
  id?: number;
  event_type: number;
  event_type_details?: EventType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at?: string;
  is_active: boolean;
}

export interface Alert {
  id?: number;
  zone: number;
  zone_name?: string;
  event: number;
  event_details?: GeoEvent;
  message: string;
  created_at?: string;
  is_read: boolean;
}

// Zones API
export const zonesAPI = {
  getAll: () => api.get<GeoZone[]>('/zones/'),
  getById: (id: number) => api.get<GeoZone>(`/zones/${id}/`),
  create: (data: GeoZone) => api.post<GeoZone>('/zones/', data),
  update: (id: number, data: GeoZone) => api.put<GeoZone>(`/zones/${id}/`, data),
  delete: (id: number) => api.delete(`/zones/${id}/`),
};

// Event Types API
export const eventTypesAPI = {
  getAll: () => api.get<EventType[]>('/event-types/'),
  getById: (id: number) => api.get<EventType>(`/event-types/${id}/`),
  create: (data: EventType) => api.post<EventType>('/event-types/', data),
  update: (id: number, data: EventType) => api.put<EventType>(`/event-types/${id}/`, data),
  delete: (id: number) => api.delete(`/event-types/${id}/`),
};

// Events API
export const eventsAPI = {
  getAll: (params?: any) => api.get<GeoEvent[]>('/events/', { params }),
  getById: (id: number) => api.get<GeoEvent>(`/events/${id}/`),
  create: (data: GeoEvent) => api.post<GeoEvent>('/events/', data),
  update: (id: number, data: GeoEvent) => api.put<GeoEvent>(`/events/${id}/`, data),
  delete: (id: number) => api.delete(`/events/${id}/`),
  checkGeofencing: (eventId: number) => api.post('/events/check_geofencing/', { event_id: eventId }),
};

// Alerts API
export const alertsAPI = {
  getAll: (params?: any) => api.get<Alert[]>('/alerts/', { params }),
  getById: (id: number) => api.get<Alert>(`/alerts/${id}/`),
  markAsRead: (id: number) => api.post(`/alerts/${id}/mark_as_read/`),
  markAllAsRead: () => api.post('/alerts/mark_all_as_read/'),
};

export default api;
