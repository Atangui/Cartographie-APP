from django.contrib import admin
from .models import GeoZone, EventType, GeoEvent, Alert


@admin.register(GeoZone)
class GeoZoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']


@admin.register(EventType)
class EventTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'icon']
    search_fields = ['name']


@admin.register(GeoEvent)
class GeoEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'severity', 'latitude', 'longitude', 'is_active', 'created_at']
    list_filter = ['event_type', 'severity', 'is_active', 'created_at']
    search_fields = ['title', 'description']


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['zone', 'event', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['message']
