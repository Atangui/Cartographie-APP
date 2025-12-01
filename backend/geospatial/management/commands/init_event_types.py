from django.core.management.base import BaseCommand
from geospatial.models import EventType


class Command(BaseCommand):
    help = 'Create initial event types'

    def handle(self, *args, **kwargs):
        event_types = [
            {'name': 'Météo', 'icon': '🌤️', 'color': '#2196F3'},
            {'name': 'Trafic', 'icon': '🚗', 'color': '#FF5722'},
            {'name': 'Urgence', 'icon': '🚨', 'color': '#F44336'},
            {'name': 'Travaux', 'icon': '🚧', 'color': '#FF9800'},
            {'name': 'Événement', 'icon': '📅', 'color': '#9C27B0'},
        ]

        for et_data in event_types:
            EventType.objects.get_or_create(
                name=et_data['name'],
                defaults={'icon': et_data['icon'], 'color': et_data['color']}
            )
            self.stdout.write(self.style.SUCCESS(f'Event type "{et_data["name"]}" created or already exists'))

        self.stdout.write(self.style.SUCCESS('Successfully initialized event types'))
