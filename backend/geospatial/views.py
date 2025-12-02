from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from shapely.geometry import Point, shape
from django.core.management import call_command
from .models import GeoZone, EventType, GeoEvent, Alert
from .serializers import GeoZoneSerializer, EventTypeSerializer, GeoEventSerializer, AlertSerializer


@api_view(['POST'])
def initialize_database(request):
    """Initialize database with demo data - ONE TIME USE"""
    try:
        # Run init commands
        call_command('init_event_types')
        call_command('init_demo_data')
        
        return Response({
            'status': 'success',
            'message': 'Database initialized with demo data',
            'data': {
                'event_types': EventType.objects.count(),
                'zones': GeoZone.objects.count(),
                'events': GeoEvent.objects.count(),
                'alerts': Alert.objects.count()
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GeoZoneViewSet(viewsets.ModelViewSet):
    """API endpoints pour les zones géographiques"""
    queryset = GeoZone.objects.all()
    serializer_class = GeoZoneSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset


class EventTypeViewSet(viewsets.ModelViewSet):
    """API endpoints pour les types d'événements"""
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer


class GeoEventViewSet(viewsets.ModelViewSet):
    """API endpoints pour les événements géolocalisés"""
    queryset = GeoEvent.objects.all()
    serializer_class = GeoEventSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get('is_active', None)
        severity = self.request.query_params.get('severity', None)
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        if severity:
            queryset = queryset.filter(severity=severity)
        
        return queryset

    @action(detail=False, methods=['post'])
    def check_geofencing(self, request):
        """Vérifie si un événement se trouve dans des zones et génère des alertes"""
        event_id = request.data.get('event_id')
        
        try:
            event = GeoEvent.objects.get(id=event_id)
        except GeoEvent.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        
        event_point = Point(event.longitude, event.latitude)
        zones = GeoZone.objects.filter(is_active=True)
        alerts_created = []
        
        for zone in zones:
            try:
                zone_shape = shape(zone.geometry)
                if zone_shape.contains(event_point):
                    # Créer une alerte
                    alert = Alert.objects.create(
                        zone=zone,
                        event=event,
                        message=f"Événement '{event.title}' détecté dans la zone '{zone.name}'"
                    )
                    alerts_created.append(AlertSerializer(alert).data)
            except Exception as e:
                continue
        
        return Response({
            'alerts_created': len(alerts_created),
            'alerts': alerts_created
        }, status=status.HTTP_200_OK)


class AlertViewSet(viewsets.ModelViewSet):
    """API endpoints pour les alertes"""
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        is_read = self.request.query_params.get('is_read', None)
        zone_id = self.request.query_params.get('zone', None)
        
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        if zone_id:
            queryset = queryset.filter(zone_id=zone_id)
        
        return queryset

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Marquer une alerte comme lue"""
        alert = self.get_object()
        alert.is_read = True
        alert.save()
        return Response({'status': 'alert marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Marquer toutes les alertes comme lues"""
        Alert.objects.filter(is_read=False).update(is_read=True)
        return Response({'status': 'all alerts marked as read'})
