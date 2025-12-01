import { useEffect, useState } from 'react';
import type { Alert } from '../api';
import { alertsAPI } from '../api';
import './AlertPanel.css';

interface AlertPanelProps {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
}

const AlertPanel = ({ alerts, setAlerts }: AlertPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setUnreadCount(alerts.filter((a) => !a.is_read).length);
  }, [alerts]);

  const fetchAlerts = async () => {
    try {
      const response = await alertsAPI.getAll();
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await alertsAPI.markAsRead(id);
      fetchAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await alertsAPI.markAllAsRead();
      fetchAlerts();
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  return (
    <div className={`alert-panel ${isOpen ? 'open' : ''}`}>
      <button className="alert-toggle" onClick={() => setIsOpen(!isOpen)}>
        🔔 Alertes {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="alert-content">
          <div className="alert-header">
            <h3>Alertes ({alerts.length})</h3>
            {unreadCount > 0 && (
              <button className="btn-mark-all" onClick={handleMarkAllAsRead}>
                ✓ Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="alert-list">
            {alerts.length === 0 ? (
              <p className="empty-state">Aucune alerte</p>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.is_read ? 'read' : 'unread'}`}>
                  <div className="alert-info">
                    <h4>{alert.zone_name}</h4>
                    <p>{alert.message}</p>
                    {alert.event_details && (
                      <div className="event-info">
                        <span className={`severity-dot ${alert.event_details.severity}`}></span>
                        <span>{alert.event_details.title}</span>
                      </div>
                    )}
                    <small>{new Date(alert.created_at!).toLocaleString()}</small>
                  </div>
                  {!alert.is_read && (
                    <button
                      className="btn-mark-read"
                      onClick={() => handleMarkAsRead(alert.id!)}
                      title="Marquer comme lu"
                    >
                      ✓
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
