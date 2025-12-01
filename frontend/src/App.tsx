import { useState, useEffect } from 'react'
import './App.css'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import AlertPanel from './components/AlertPanel'
import type { GeoZone, GeoEvent, Alert, EventType } from './api'

function App() {
  const [zones, setZones] = useState<GeoZone[]>([])
  const [events, setEvents] = useState<GeoEvent[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [selectedZone, setSelectedZone] = useState<GeoZone | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState<GeoEvent | null>(null)

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setDarkMode(savedMode === 'true')
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>🗺️ Geospatial Alert System</h1>
          <p>Cartographie et Géolocalisation Avancée</p>
        </div>
        <button 
          className="theme-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      
      <div className="app-content">
        <Sidebar 
          zones={zones}
          setZones={setZones}
          events={events}
          setEvents={setEvents}
          eventTypes={eventTypes}
          setEventTypes={setEventTypes}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          draggedEvent={draggedEvent}
          setDraggedEvent={setDraggedEvent}
        />
        
        <div className="main-content">
          <MapView 
            zones={zones}
            events={events}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            draggedEvent={draggedEvent}
            setDraggedEvent={setDraggedEvent}
            onEventUpdate={() => {
              // Trigger refresh in Sidebar
              setEvents([...events])
            }}
          />
          
          <AlertPanel 
            alerts={alerts}
            setAlerts={setAlerts}
          />
        </div>
      </div>
    </div>
  )
}

export default App
