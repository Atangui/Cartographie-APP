from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GeoZoneViewSet, EventTypeViewSet, GeoEventViewSet, AlertViewSet, initialize_database

router = DefaultRouter()
router.register(r'zones', GeoZoneViewSet, basename='geozone')
router.register(r'event-types', EventTypeViewSet, basename='eventtype')
router.register(r'events', GeoEventViewSet, basename='geoevent')
router.register(r'alerts', AlertViewSet, basename='alert')

urlpatterns = [
    path('', include(router.urls)),
    path('initialize/', initialize_database, name='initialize_database'),
]
