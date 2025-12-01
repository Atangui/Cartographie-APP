from django.core.management.base import BaseCommand
from geospatial.models import EventType, GeoEvent, GeoZone, Alert
from shapely.geometry import Point, shape
import random


class Command(BaseCommand):
    help = 'Initialize demo data with zones, events, and alerts'

    def handle(self, *args, **kwargs):
        # Clear existing data
        Alert.objects.all().delete()
        GeoEvent.objects.all().delete()
        GeoZone.objects.all().delete()
        EventType.objects.all().delete()

        # Create Event Types
        event_types = [
            {'name': 'Météo', 'icon': '🌤️', 'color': '#2196F3'},
            {'name': 'Trafic', 'icon': '🚗', 'color': '#FF9800'},
            {'name': 'Urgence', 'icon': '🚨', 'color': '#F44336'},
            {'name': 'Travaux', 'icon': '🚧', 'color': '#FF5722'},
            {'name': 'Événement', 'icon': '🎪', 'color': '#9C27B0'},
        ]

        created_types = {}
        for et in event_types:
            event_type = EventType.objects.create(**et)
            created_types[et['name']] = event_type
            self.stdout.write(f"✓ Type d'événement créé: {et['name']}")

        # Create Demo Zones around Paris
        zones = [
            {
                'name': 'Centre de Paris',
                'description': 'Zone centrale autour de la Tour Eiffel',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[
                        [2.28, 48.85],
                        [2.32, 48.85],
                        [2.32, 48.87],
                        [2.28, 48.87],
                        [2.28, 48.85]
                    ]]
                }
            },
            {
                'name': 'Quartier Latin',
                'description': 'Zone universitaire et touristique',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[
                        [2.33, 48.84],
                        [2.36, 48.84],
                        [2.36, 48.86],
                        [2.33, 48.86],
                        [2.33, 48.84]
                    ]]
                }
            },
            {
                'name': 'La Défense',
                'description': 'Quartier d\'affaires',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[
                        [2.22, 48.88],
                        [2.26, 48.88],
                        [2.26, 48.90],
                        [2.22, 48.90],
                        [2.22, 48.88]
                    ]]
                }
            }
        ]

        created_zones = []
        for zone_data in zones:
            zone = GeoZone.objects.create(**zone_data)
            created_zones.append(zone)
            self.stdout.write(f"✓ Zone créée: {zone.name}")

        # Create Demo Events
        events = [
            {
                'event_type': created_types['Météo'],
                'title': 'Orage violent',
                'description': 'Fortes précipitations avec risque d\'inondations',
                'latitude': 48.8584,
                'longitude': 2.2945,
                'severity': 'high'
            },
            {
                'event_type': created_types['Trafic'],
                'title': 'Accident de la route',
                'description': 'Collision entre deux véhicules, ralentissements',
                'latitude': 48.8534,
                'longitude': 2.3488,
                'severity': 'medium'
            },
            {
                'event_type': created_types['Urgence'],
                'title': 'Intervention pompiers',
                'description': 'Feu dans un bâtiment, périmètre de sécurité',
                'latitude': 48.8566,
                'longitude': 2.3522,
                'severity': 'critical'
            },
            {
                'event_type': created_types['Travaux'],
                'title': 'Travaux voirie',
                'description': 'Réfection de chaussée, circulation perturbée',
                'latitude': 48.8900,
                'longitude': 2.2400,
                'severity': 'low'
            },
            {
                'event_type': created_types['Événement'],
                'title': 'Concert en plein air',
                'description': 'Grand rassemblement, affluence importante',
                'latitude': 48.8500,
                'longitude': 2.3000,
                'severity': 'low'
            },
            {
                'event_type': created_types['Trafic'],
                'title': 'Embouteillages',
                'description': 'Trafic dense aux heures de pointe',
                'latitude': 48.8700,
                'longitude': 2.3100,
                'severity': 'medium'
            }
        ]

        created_events = []
        for event_data in events:
            event = GeoEvent.objects.create(**event_data)
            created_events.append(event)
            self.stdout.write(f"✓ Événement créé: {event.title}")

        # Generate alerts for events in zones
        alert_count = 0
        for event in created_events:
            event_point = Point(event.longitude, event.latitude)
            for zone in created_zones:
                try:
                    zone_shape = shape(zone.geometry)
                    if zone_shape.contains(event_point):
                        Alert.objects.create(
                            zone=zone,
                            event=event,
                            message=f"Événement '{event.title}' détecté dans la zone '{zone.name}'"
                        )
                        alert_count += 1
                        self.stdout.write(f"  → Alerte générée: {event.title} dans {zone.name}")
                except Exception as e:
                    continue

        self.stdout.write(self.style.SUCCESS(f"\n✅ Initialisation terminée!"))
        self.stdout.write(f"  • {len(created_types)} types d'événements")
        self.stdout.write(f"  • {len(created_zones)} zones")
        self.stdout.write(f"  • {len(created_events)} événements")
        self.stdout.write(f"  • {alert_count} alertes générées")
