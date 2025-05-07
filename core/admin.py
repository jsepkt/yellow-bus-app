from django.contrib import admin
from .models import Student, DriverProfile, Route, Stop

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'route_number', 'seat_number', 'conduct_score']
    search_fields = ['first_name', 'last_name', 'route_number']
    list_filter = ['route_number']

@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'school_district']
    search_fields = ['user__first_name', 'user__last_name', 'school_district']

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['route_number', 'route_name', 'driver']
    search_fields = ['route_number', 'route_name']
    list_filter = ['driver']

@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ['name', 'route', 'pickup_time', 'dropoff_time']
    search_fields = ['name', 'route__route_number']
