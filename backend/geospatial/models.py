from django.db import models
from django.contrib.auth.models import User
import json


class GeoZone(models.Model):
    """Zones géographiques personnalisées créées par les utilisateurs"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    geometry = models.JSONField(help_text="GeoJSON geometry data")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class EventType(models.Model):
    """Types d'événements (météo, trafic, etc.)"""
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default="#FF0000")  # Hex color

    def __str__(self):
        return self.name


class GeoEvent(models.Model):
    """Événements géolocalisés simulés"""
    SEVERITY_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyenne'),
        ('high', 'Élevée'),
        ('critical', 'Critique'),
    ]

    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=200)
    description = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='low')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.event_type.name})"


class Alert(models.Model):
    """Alertes générées lorsqu'un événement se produit dans une zone"""
    zone = models.ForeignKey(GeoZone, on_delete=models.CASCADE, related_name='alerts')
    event = models.ForeignKey(GeoEvent, on_delete=models.CASCADE, related_name='alerts')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Alert for {self.zone.name} - {self.event.title}"
