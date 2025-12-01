# Copilot Instructions - Advanced Geospatial App

## Project Overview

This is a modern geospatial application with real-time alerts built with:
- **Frontend**: React 19 + TypeScript + Vite + Leaflet
- **Backend**: Django 5.0 + Django REST Framework + Shapely

## Development Guidelines

### Backend (Django)
- Use Django REST Framework viewsets for API endpoints
- Models are in `geospatial/models.py`: GeoZone, EventType, GeoEvent, Alert
- Use Shapely for geometric operations (geofencing)
- API available at `http://localhost:8000/api/`

### Frontend (React + TypeScript)
- Use functional components with hooks
- API client is in `src/api.ts`
- Components: MapView (Leaflet), Sidebar (zones/events), AlertPanel (alerts)
- Style with CSS modules or component-specific CSS files

### Running the Application
- Backend: `cd backend; .\venv\Scripts\Activate.ps1; python manage.py runserver`
- Frontend: `cd frontend; npm run dev`
- Or use VS Code task: "Start All Servers"

### Key Features
1. Draw geographic zones on the map (polygons)
2. Create simulated events with location and severity
3. Automatic geofencing checks generate alerts when events enter zones
4. Real-time alert panel with read/unread status

### Code Style
- Python: Follow PEP 8, use type hints where appropriate
- TypeScript: Enable strict mode, use proper typing
- CSS: Use BEM-like naming or component-scoped styles
