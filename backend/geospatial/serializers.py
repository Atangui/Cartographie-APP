from rest_framework import serializers
from .models import GeoZone, EventType, GeoEvent, Alert


class GeoZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeoZone
        fields = ['id', 'name', 'description', 'geometry', 'created_at', 'updated_at', 'is_active']
        read_only_fields = ['created_at', 'updated_at']


class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ['id', 'name', 'icon', 'color']


class GeoEventSerializer(serializers.ModelSerializer):
    event_type_details = EventTypeSerializer(source='event_type', read_only=True)
    
    class Meta:
        model = GeoEvent
        fields = ['id', 'event_type', 'event_type_details', 'title', 'description', 
                  'latitude', 'longitude', 'severity', 'created_at', 'is_active']
        read_only_fields = ['created_at']


class AlertSerializer(serializers.ModelSerializer):
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    event_details = GeoEventSerializer(source='event', read_only=True)
    
    class Meta:
        model = Alert
        fields = ['id', 'zone', 'zone_name', 'event', 'event_details', 
                  'message', 'created_at', 'is_read']
        read_only_fields = ['created_at']
